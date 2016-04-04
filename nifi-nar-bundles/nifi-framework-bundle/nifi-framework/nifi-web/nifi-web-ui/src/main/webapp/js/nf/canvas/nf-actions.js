/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global nf, d3 */

define(['nf-common',
    'nf-shell',
    'nf-go-to',
    'nf-snippet',
    'nf-birdseye',
    'nf-queue-listing',
    'nf-connection',
    'nf-label-configuration',
    'nf-component-state',
    'nf-processor',
    'nf-process-group',
    'nf-remote-process-group',
    'nf-graph',
    'nf-client',
    'nf-dialog',
    'nf-canvas',
    'nf-clipboard',
    'nf-canvas-utils',
    'nf-status-history',
    'nf-label',
    'nf-port',
    'nf-secure-port-details',
    'nf-secure-port-configuration'],
    function (nfCommon,
              nfShell,
              nfGoto,
              nfSnippet,
              nfBirdseye,
              nfQueueListing,
              nfConnection,
              nfLabelConfiguration,
              nfComponentState,
              nfProcessor,
              nfProcessGroup,
              nfRemoteProcessGroup,
              nfGraph,
              nfClient,
              nfDialog,
              nfCanvas,
              nfClipboard,
              nfCanvasUtils,
              nfStatusHistory,
              nfLabel,
              nfPort,
              nfSecurePortDetails,
              nfSecurePortConfiguration) {

    var config = {
        urls: {
            controller: '../nifi-api/controller'
        }
    };
    
    /**
     * Initializes the drop request status dialog.
     */
    var initializeDropRequestStatusDialog = function () {
        // initialize the drop requst progress bar
        var dropRequestProgressBar = $('#drop-request-percent-complete').progressbar();

        // configure the drop request status dialog
        $('#drop-request-status-dialog').modal({
            overlayBackground: false,
            handler: {
                close: function () {
                    // reset the progress bar
                    dropRequestProgressBar.find('div.progress-label').remove();

                    // update the progress bar
                    var label = $('<div class="progress-label"></div>').text('0%');
                    dropRequestProgressBar.progressbar('value', 0).append(label);
                    
                    // clear the current button model
                    $('#drop-request-status-dialog').modal('setButtonModel', []);
                }
            }
        }).draggable({
            containment: 'parent',
            handle: '.dialog-header'
        });
    };
    

    /**
     * Updates the resource with the specified data.
     * 
     * @param {string} uri
     * @param {object} data
     */
    var updateResource = function (uri, data) {
        var revision = nfClient.getRevision();

        // ensure the version and client ids are specified
        data.version = revision.version;
        data.clientId = revision.clientId;

        return $.ajax({
            type: 'PUT',
            url: uri,
            data: data,
            dataType: 'json'
        }).done(function (response) {
            // update the revision
            nfClient.setRevision(response.revision);
        }).fail(function (xhr, status, error) {
            if (xhr.status === 400 || xhr.status === 404 || xhr.status === 409) {
                nfDialog.showOkDialog({
                    dialogContent: nfCommon.escapeHtml(xhr.responseText),
                    overlayBackground: true
                });
            }
        });
    };

    // create a method for updating process groups and processors
    var updateProcessGroup = function (response) {
        if (nfCommon.isDefinedAndNotNull(response.processGroup)) {
            if (nfCommon.isDefinedAndNotNull(response.processGroup.contents)) {
                var contents = response.processGroup.contents;

                // update all the components in the contents
                nfGraph.set(contents);

                // update each process group
                $.each(contents.processGroups, function (_, processGroup) {
                    // reload the group's connections
                    var connections = nfConnection.getComponentConnections(processGroup.id);
                    $.each(connections, function (_, connection) {
                        nfConnection.reload(connection);
                    });
                });
            }
        }
    };

    return {
        /**
         * Initializes the actions.
         */
        init: function () {
            initializeDropRequestStatusDialog();
        },
        
        /**
         * Enters the specified process group.
         * 
         * @param {selection} selection     The the currently selected component
         */
        enterGroup: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isProcessGroup(selection)) {
                var selectionData = selection.datum();
                nfCanvasUtils.enterGroup(selectionData.component.id);
            }
        },
        
        /**
         * Exits the current process group but entering the parent group.
         */
        leaveGroup: function () {
            nfCanvasUtils.enterGroup(nfCanvas.getParentGroupId());
        },
        
        /**
         * Refresh the flow of the remote process group in the specified selection.
         * 
         * @param {selection} selection
         */
        refreshRemoteFlow: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isRemoteProcessGroup(selection)) {
                var d = selection.datum();
                var refreshTimestamp = d.component.flowRefreshed;

                var setLastRefreshed = function (lastRefreshed) {
                    // set the new value in case the component is redrawn during the refresh
                    d.component.flowRefreshed = lastRefreshed;

                    // update the UI to show last refreshed if appropriate
                    if (selection.classed('visible')) {
                        selection.select('text.remote-process-group-last-refresh')
                                .text(function () {
                                    return lastRefreshed;
                                });
                    }
                };

                var poll = function (nextDelay) {
                    $.ajax({
                        type: 'GET',
                        url: d.component.uri,
                        dataType: 'json'
                    }).done(function (response) {
                        var remoteProcessGroup = response.remoteProcessGroup;

                        // the timestamp has not updated yet, poll again
                        if (refreshTimestamp === remoteProcessGroup.flowRefreshed) {
                            schedule(nextDelay);
                        } else {
                            nfRemoteProcessGroup.set(response.remoteProcessGroup);

                            // reload the group's connections
                            var connections = nfConnection.getComponentConnections(remoteProcessGroup.id);
                            $.each(connections, function (_, connection) {
                                nfConnection.reload(connection);
                            });
                        }
                    });
                };

                var schedule = function (delay) {
                    if (delay <= 32) {
                        setTimeout(function () {
                            poll(delay * 2);
                        }, delay * 1000);
                    } else {
                        // reset to the previous value since the contents could not be updated (set to null?)
                        setLastRefreshed(refreshTimestamp);
                    }
                };

                setLastRefreshed('Refreshing...');
                poll(1);
            }
        },
        
        /**
         * Opens the remote process group in the specified selection.
         * 
         * @param {selection} selection         The selection
         */
        openUri: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isRemoteProcessGroup(selection)) {
                var selectionData = selection.datum();
                var uri = selectionData.component.targetUri;

                if (!nfCommon.isBlank(uri)) {
                    window.open(encodeURI(uri));
                } else {
                    nfDialog.showOkDialog({
                        dialogContent: 'No target URI defined.'
                    });
                }
            }
        },
        
        /**
         * Shows and selects the source of the connection in the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        showSource: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isConnection(selection)) {
                var selectionData = selection.datum();

                // the source is in the current group
                if (selectionData.component.source.groupId === nfCanvas.getGroupId()) {
                    var source = d3.select('#id-' + selectionData.component.source.id);
                    this.show(source);
                } else if (selectionData.component.source.type === 'REMOTE_OUTPUT_PORT') {
                    // if the source is remote
                    var remoteSource = d3.select('#id-' + selectionData.component.source.groupId);
                    this.show(remoteSource);
                } else {
                    // if the source is local but in a sub group
                    nfCanvasUtils.showComponent(selectionData.component.source.groupId, selectionData.component.source.id);
                }
            }
        },
        
        /**
         * Shows and selects the destination of the connection in the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        showDestination: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isConnection(selection)) {
                var selectionData = selection.datum();

                // the destination is in the current group or its remote
                if (selectionData.component.destination.groupId === nfCanvas.getGroupId()) {
                    var destination = d3.select('#id-' + selectionData.component.destination.id);
                    this.show(destination);
                } else if (selectionData.component.destination.type === 'REMOTE_INPUT_PORT') {
                    // if the destination is remote
                    var remoteDestination = d3.select('#id-' + selectionData.component.destination.groupId);
                    this.show(remoteDestination);
                } else {
                    // if the destination is local but in a sub group
                    nfCanvasUtils.showComponent(selectionData.component.destination.groupId, selectionData.component.destination.id);
                }
            }
        },
        
        /**
         * Shows the downstream components from the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        showDownstream: function (selection) {
            if (selection.size() === 1 && !nfCanvasUtils.isConnection(selection)) {

                // open the downstream dialog according to the selection
                if (nfCanvasUtils.isProcessor(selection)) {
                    nfGoTo.showDownstreamFromProcessor(selection);
                } else if (nfCanvasUtils.isFunnel(selection)) {
                    nfGoTo.showDownstreamFromFunnel(selection);
                } else if (nfCanvasUtils.isInputPort(selection)) {
                    nfGoTo.showDownstreamFromInputPort(selection);
                } else if (nfCanvasUtils.isOutputPort(selection)) {
                    nfGoTo.showDownstreamFromOutputPort(selection);
                } else if (nfCanvasUtils.isProcessGroup(selection) || nfCanvasUtils.isRemoteProcessGroup(selection)) {
                    nfGoTo.showDownstreamFromGroup(selection);
                }
            }
        },
        
        /**
         * Shows the upstream components from the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        showUpstream: function (selection) {
            if (selection.size() === 1 && !nfCanvasUtils.isConnection(selection)) {

                // open the downstream dialog according to the selection
                if (nfCanvasUtils.isProcessor(selection)) {
                    nfGoTo.showUpstreamFromProcessor(selection);
                } else if (nfCanvasUtils.isFunnel(selection)) {
                    nfGoTo.showUpstreamFromFunnel(selection);
                } else if (nfCanvasUtils.isInputPort(selection)) {
                    nfGoTo.showUpstreamFromInputPort(selection);
                } else if (nfCanvasUtils.isOutputPort(selection)) {
                    nfGoTo.showUpstreamFromOutputPort(selection);
                } else if (nfCanvasUtils.isProcessGroup(selection) || nfCanvasUtils.isRemoteProcessGroup(selection)) {
                    nfGoTo.showUpstreamFromGroup(selection);
                }
            }
        },
        
        /**
         * Shows and selects the component in the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        show: function (selection) {
            if (selection.size() === 1) {
                // deselect the current selection
                var currentlySelected = nfCanvasUtils.getSelection();
                currentlySelected.classed('selected', false);

                // select only the component/connection in question
                selection.classed('selected', true);
                this.center(selection);
            }
        },
        
        /**
         * Selects all components in the specified selection.
         * 
         * @param {selection} selection     Selection of components to select
         */
        select: function (selection) {
            selection.classed('selected', true);
        },
        
        /**
         * Selects all components.
         */
        selectAll: function () {
            this.select(d3.selectAll('g.component, g.connection'));
        },
        
        /**
         * Centers the component in the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        center: function (selection) {
            if (selection.size() === 1) {
                var box;
                if (nfCanvasUtils.isConnection(selection)) {
                    var x, y;
                    var d = selection.datum();

                    // get the position of the connection label
                    if (d.bends.length > 0) {
                        var i = Math.min(Math.max(0, d.labelIndex), d.bends.length - 1);
                        x = d.bends[i].x;
                        y = d.bends[i].y;
                    } else {
                        x = (d.start.x + d.end.x) / 2;
                        y = (d.start.y + d.end.y) / 2;
                    }

                    box = {
                        x: x,
                        y: y,
                        width: 1,
                        height: 1
                    };
                } else {
                    var selectionData = selection.datum();
                    var selectionPosition = selectionData.component.position;

                    box = {
                        x: selectionPosition.x,
                        y: selectionPosition.y,
                        width: selectionData.dimensions.width,
                        height: selectionData.dimensions.height
                    };
                }

                // center on the component
                nfCanvasUtils.centerBoundingBox(box);

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            }
        },
        
        /**
         * Enables all eligible selected components.
         *
         * @argument {selection} selection      The selection
         */
        enable: function (selection) {
            var componentsToEnable = nfCanvasUtils.filterEnable(selection);

            if (componentsToEnable.empty()) {
                nfDialog.showOkDialog({
                    dialogContent: 'No eligible components are selected. Please select the components to be enabled and ensure they are no longer running.',
                    overlayBackground: true
                });
            } else {
                var enableRequests = [];

                // enable the selected processors
                componentsToEnable.each(function (d) {
                    var selected = d3.select(this);
                    enableRequests.push(updateResource(d.component.uri, {state: 'STOPPED'}).done(function (response) {
                        if (nfCanvasUtils.isProcessor(selected)) {
                            nfProcessor.set(response.processor);
                        } else if (nfCanvasUtils.isInputPort(selected)) {
                            nfPort.set(response.inputPort);
                        } else if (nfCanvasUtils.isOutputPort(selected)) {
                            nfPort.set(response.outputPort);
                        }
                    }));
                });

                // refresh the toolbar once the updates have completed
                if (enableRequests.length > 0) {
                    $.when.apply(window, enableRequests).always(function () {
                        nfCanvasToolbar.refresh();
                    });
                }
            }
        },
        
        /**
         * Disables all eligible selected components.
         *
         * @argument {selection} selection      The selection
         */
        disable: function (selection) {
            var componentsToDisable = nfCanvasUtils.filterDisable(selection);

            if (componentsToDisable.empty()) {
                nfDialog.showOkDialog({
                    dialogContent: 'No eligible components are selected. Please select the components to be disabled and ensure they are no longer running.',
                    overlayBackground: true
                });
            } else {
                var disableRequests = [];

                // disable the selected components
                componentsToDisable.each(function (d) {
                    var selected = d3.select(this);
                    disableRequests.push(updateResource(d.component.uri, {state: 'DISABLED'}).done(function (response) {
                        if (nfCanvasUtils.isProcessor(selected)) {
                            nfProcessor.set(response.processor);
                        } else if (nfCanvasUtils.isInputPort(selected)) {
                            nfPort.set(response.inputPort);
                        } else if (nfCanvasUtils.isOutputPort(selected)) {
                            nfPort.set(response.outputPort);
                        }
                    }));
                });

                // refresh the toolbar once the updates have completed
                if (disableRequests.length > 0) {
                    $.when.apply(window, disableRequests).always(function () {
                        nfCanvasToolbar.refresh();
                    });
                }
            }
        },
        
        /**
         * Opens provenance with the component in the specified selection.
         *
         * @argument {selection} selection The selection
         */
        openProvenance: function (selection) {
            if (selection.size() === 1) {
                var selectionData = selection.datum();

                // open the provenance page with the specified component
                nfShell.showPage('provenance?' + $.param({
                    componentId: selectionData.component.id
                }));
            }
        },

        /**
         * Starts the components in the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        start: function (selection) {
            if (selection.empty()) {
                updateResource(config.urls.controller + '/process-groups/' + encodeURIComponent(nfCanvas.getGroupId()), {running: true}).done(updateProcessGroup);
            } else {
                var componentsToStart = selection.filter(function (d) {
                    return nfCanvasUtils.isRunnable(d3.select(this));
                });

                // ensure there are startable components selected
                if (componentsToStart.empty()) {
                    nfDialog.showOkDialog({
                        dialogContent: 'No eligible components are selected. Please select the components to be started and ensure they are no longer running.',
                        overlayBackground: true
                    });
                } else {
                    var startRequests = [];

                    // start each selected component
                    componentsToStart.each(function (d) {
                        var selected = d3.select(this);

                        // processor endpoint does not use running flag...
                        var data = {};
                        if (nfCanvasUtils.isProcessor(selected) || nfCanvasUtils.isInputPort(selected) || nfCanvasUtils.isOutputPort(selected)) {
                            data['state'] = 'RUNNING';
                        } else {
                            data['running'] = true;
                        }

                        startRequests.push(updateResource(d.component.uri, data).done(function (response) {
                            if (nfCanvasUtils.isProcessor(selected)) {
                                nfProcessor.set(response.processor);
                            } else if (nfCanvasUtils.isProcessGroup(selected)) {
                                nfProcessGroup.set(response.processGroup);

                                // reload the group's connections
                                var connections = nfConnection.getComponentConnections(response.processGroup.id);
                                $.each(connections, function (_, connection) {
                                    nfConnection.reload(connection);
                                });
                            } else if (nfCanvasUtils.isInputPort(selected)) {
                                nfPort.set(response.inputPort);
                            } else if (nfCanvasUtils.isOutputPort(selected)) {
                                nfPort.set(response.outputPort);
                            }
                        }));
                    });

                    // refresh the toolbar once the updates have completed
                    if (startRequests.length > 0) {
                        $.when.apply(window, startRequests).always(function () {
                            nfCanvasToolbar.refresh();
                        });
                    }
                }
            }
        },
        
        /**
         * Stops the components in the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        stop: function (selection) {
            if (selection.empty()) {
                updateResource(config.urls.controller + '/process-groups/' + encodeURIComponent(nfCanvas.getGroupId()), {running: false}).done(updateProcessGroup);
            } else {
                var componentsToStop = selection.filter(function (d) {
                    return nfCanvasUtils.isStoppable(d3.select(this));
                });

                // ensure there are some component to stop
                if (componentsToStop.empty()) {
                    nfDialog.showOkDialog({
                        dialogContent: 'No eligible components are selected. Please select the components to be stopped.',
                        overlayBackground: true
                    });
                } else {
                    var stopRequests = [];

                    // stop each selected component
                    componentsToStop.each(function (d) {
                        var selected = d3.select(this);

                        // processor endpoint does not use running flag...
                        var data = {};
                        if (nfCanvasUtils.isProcessor(selected) || nfCanvasUtils.isInputPort(selected) || nfCanvasUtils.isOutputPort(selected)) {
                            data['state'] = 'STOPPED';
                        } else {
                            data['running'] = false;
                        }

                        stopRequests.push(updateResource(d.component.uri, data).done(function (response) {
                            if (nfCanvasUtils.isProcessor(selected)) {
                                nfProcessor.set(response.processor);
                            } else if (nfCanvasUtils.isProcessGroup(selected)) {
                                nfProcessGroup.set(response.processGroup);

                                // reload the group's connections
                                var connections = nfConnection.getComponentConnections(response.processGroup.id);
                                $.each(connections, function (_, connection) {
                                    nfConnection.reload(connection);
                                });
                            } else if (nfCanvasUtils.isInputPort(selected)) {
                                nfPort.set(response.inputPort);
                            } else if (nfCanvasUtils.isOutputPort(selected)) {
                                nfPort.set(response.outputPort);
                            }
                        }));
                    });

                    // refresh the toolbar once the updates have completed
                    if (stopRequests.length > 0) {
                        $.when.apply(window, stopRequests).always(function () {
                            nfCanvasToolbar.refresh();
                        });
                    }
                }
            }
        },
        
        /**
         * Enables transmission for the components in the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        enableTransmission: function (selection) {
            var componentsToEnable = selection.filter(function (d) {
                return nfCanvasUtils.canStartTransmitting(d3.select(this));
            });

            // start each selected component
            componentsToEnable.each(function (d) {
                updateResource(d.component.uri, {transmitting: true}).done(function (response) {
                    nfRemoteProcessGroup.set(response.remoteProcessGroup);
                });
            });
        },
        
        /**
         * Disables transmission for the components in the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        disableTransmission: function (selection) {
            var componentsToDisable = selection.filter(function (d) {
                return nfCanvasUtils.canStopTransmitting(d3.select(this));
            });

            // stop each selected component
            componentsToDisable.each(function (d) {
                updateResource(d.component.uri, {transmitting: false}).done(function (response) {
                    nfRemoteProcessGroup.set(response.remoteProcessGroup);
                });
            });
        },
        
        /**
         * Shows the configuration dialog for the specified selection.
         * 
         * @param {selection} selection     Selection of the component to be configured
         */
        showConfiguration: function (selection) {
            if (selection.size() === 1) {
                if (nfCanvasUtils.isProcessor(selection)) {
                    nfProcessorConfiguration.showConfiguration(selection);
                } else if (nfCanvasUtils.isLabel(selection)) {
                    nfLabelConfiguration.showConfiguration(selection);
                } else if (nfCanvasUtils.isProcessGroup(selection)) {
                    nfProcessGroupConfiguration.showConfiguration(selection);
                } else if (nfCanvasUtils.isRemoteProcessGroup(selection)) {
                    nfRemoteProcessGroupConfiguration.showConfiguration(selection);
                } else if (nfCanvasUtils.isInputPort(selection) || nfCanvasUtils.isOutputPort(selection)) {
                    // ports in the root group can be configured for access control
                    if (nfCanvas.getParentGroupId() === null && nfCanvas.isSecureSiteToSite()) {
                        nfSecurePortConfiguration.showConfiguration(selection);
                    } else {
                        nfPortConfiguration.showConfiguration(selection);
                    }
                } else if (nfCanvasUtils.isConnection(selection)) {
                    nfConnectionConfiguration.showConfiguration(selection);
                }
            }
        },
        
        // Defines an action for showing component details (like configuration but read only).
        showDetails: function (selection) {
            if (selection.size() === 1) {
                var selectionData = selection.datum();
                if (nfCanvasUtils.isProcessor(selection)) {
                    nfProcessorDetails.showDetails(nfCanvas.getGroupId(), selectionData.component.id);
                } else if (nfCanvasUtils.isProcessGroup(selection)) {
                    nfProcessGroupDetails.showDetails(selection);
                } else if (nfCanvasUtils.isRemoteProcessGroup(selection)) {
                    nfRemoteProcessGroupDetails.showDetails(selection);
                } else if (nfCanvasUtils.isInputPort(selection) || nfCanvasUtils.isOutputPort(selection)) {
                    // ports in the root group can be configured for access control
                    if (nfCanvas.getParentGroupId() === null && nfCanvas.isSecureSiteToSite()) {
                        nfSecurePortDetails.showDetails(selection);
                    } else {
                        nfPortDetails.showDetails(selection);
                    }
                } else if (nfCanvasUtils.isConnection(selection)) {
                    nfConnectionDetails.showDetails(nfCanvas.getGroupId(), selectionData.component.id);
                }
            }
        },
        
        /**
         * Shows the usage documentation for the component in the specified selection.
         * 
         * @param {selection} selection     The selection
         */
        showUsage: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isProcessor(selection)) {
                var selectionData = selection.datum();
                nfShell.showPage('../nifi-docs/documentation?' + $.param({
                    select: nfCommon.substringAfterLast(selectionData.component.type, '.')
                }));
            }
        },
        
        /**
         * Shows the stats for the specified selection.
         * 
         * @argument {selection} selection      The selection
         */
        showStats: function (selection) {
            if (selection.size() === 1) {
                var selectionData = selection.datum();
                if (nfCanvasUtils.isProcessor(selection)) {
                    nfStatusHistory.showProcessorChart(nfCanvas.getGroupId(), selectionData.component.id);
                } else if (nfCanvasUtils.isProcessGroup(selection)) {
                    nfStatusHistory.showProcessGroupChart(nfCanvas.getGroupId(), selectionData.component.id);
                } else if (nfCanvasUtils.isRemoteProcessGroup(selection)) {
                    nfStatusHistory.showRemoteProcessGroupChart(nfCanvas.getGroupId(), selectionData.component.id);
                } else if (nfCanvasUtils.isConnection(selection)) {
                    nfStatusHistory.showConnectionChart(nfCanvas.getGroupId(), selectionData.component.id);
                }
            }
        },
        
        /**
         * Opens the remote ports dialog for the remote process group in the specified selection.
         * 
         * @param {selection} selection         The selection
         */
        remotePorts: function (selection) {
            if (selection.size() === 1 && nfCanvasUtils.isRemoteProcessGroup(selection)) {
                nfRemoteProcessGroupPorts.showPorts(selection);
            }
        },
        
        /**
         * Reloads the status for the entire canvas (components and flow.)
         */
        reloadStatus: function () {
            nfCanvas.reloadStatus();
        },
        
        /**
         * Deletes the component in the specified selection.
         * 
         * @param {selection} selection     The selection containing the component to be removed
         */
        'delete': function (selection) {
            if (nfCommon.isUndefined(selection) || selection.empty()) {
                nfDialog.showOkDialog({
                    dialogContent: 'No eligible components are selected. Please select the components to be deleted.',
                    overlayBackground: true
                });
            } else {
                if (selection.size() === 1) {
                    var selectionData = selection.datum();
                    var revision = nfClient.getRevision();

                    $.ajax({
                        type: 'DELETE',
                        url: selectionData.component.uri + '?' + $.param({
                            version: revision.version,
                            clientId: revision.clientId
                        }),
                        dataType: 'json'
                    }).done(function (response) {
                        // update the revision
                        nfClient.setRevision(response.revision);

                        // remove the component/connection in question
                        nf[selectionData.type].remove(selectionData.component.id);

                        // if the selection is a connection, reload the source and destination accordingly
                        if (nfCanvasUtils.isConnection(selection) === false) {
                            var connections = nfConnection.getComponentConnections(selectionData.component.id);
                            if (connections.length > 0) {
                                var ids = [];
                                $.each(connections, function (_, connection) {
                                    ids.push(connection.id);
                                });

                                // remove the corresponding connections
                                nfConnection.remove(ids);
                            }
                        }

                        // refresh the birdseye/toolbar
                        nfBirdseye.refresh();
                        nfCanvasToolbar.refresh();
                    }).fail(nfCommon.handleAjaxError);
                } else {
                    // create a snippet for the specified component and link to the data flow
                    var snippetDetails = nfSnippet.marshal(selection, true);
                    nfSnippet.create(snippetDetails).done(function (response) {
                        var snippet = response.snippet;

                        // remove the snippet, effectively removing the components
                        nfSnippet.remove(snippet.id).done(function () {
                            var components = d3.map();

                            // add the id to the type's array
                            var addComponent = function (type, id) {
                                if (!components.has(type)) {
                                    components.set(type, []);
                                }
                                components.get(type).push(id);
                            };

                            // go through each component being removed
                            selection.each(function (d) {
                                // remove the corresponding entry
                                addComponent(d.type, d.component.id);

                                // if this is not a connection, see if it has any connections that need to be removed
                                if (d.type !== 'Connection') {
                                    var connections = nfConnection.getComponentConnections(d.component.id);
                                    if (connections.length > 0) {
                                        $.each(connections, function (_, connection) {
                                            addComponent('Connection', connection.id);
                                        });
                                    }
                                }
                            });

                            // remove all the non connections in the snippet first
                            components.forEach(function (type, ids) {
                                if (type !== 'Connection') {
                                    nf[type].remove(ids);
                                }
                            });
                            
                            // then remove all the connections
                            if (components.has('Connection')) {
                                nfConnection.remove(components.get('Connection'));
                            }

                            // refresh the birdseye/toolbar
                            nfBirdseye.refresh();
                            nfCanvasToolbar.refresh();
                        }).fail(function (xhr, status, error) {
                            // unable to acutally remove the components so attempt to
                            // unlink and remove just the snippet - if unlinking fails
                            // just ignore
                            nfSnippet.unlink(snippet.id).done(function () {
                                nfSnippet.remove(snippet.id);
                            });

                            nfCommon.handleAjaxError(xhr, status, error);
                        });
                    }).fail(nfCommon.handleAjaxError);
                }
            }
        },
        
        /**
         * Deletes the flow files in the specified connection.
         * 
         * @param {type} selection
         */
        emptyQueue: function (selection) {
            if (selection.size() !== 1 || !nfCanvasUtils.isConnection(selection)) {
                return;
            }
            
            // prompt the user before emptying the queue
            nfDialog.showYesNoDialog({
                headerText: 'Empty Queue',
                dialogContent: 'Are you sure you want to empty this queue? All FlowFiles waiting at the time of the request will be removed.',
                overlayBackground: false,
                noText: 'Cancel',
                yesText: 'Empty',
                yesHandler: function () {
                    // get the connection data
                    var connection = selection.datum();
                    
                    var MAX_DELAY = 4;
                    var cancelled = false;
                    var dropRequest = null;
                    var dropRequestTimer = null;

                    // updates the progress bar
                    var updateProgress = function (percentComplete) {
                        // remove existing labels
                        var progressBar = $('#drop-request-percent-complete');
                        progressBar.find('div.progress-label').remove();

                        // update the progress bar
                        var label = $('<div class="progress-label"></div>').text(percentComplete + '%');
                        if (percentComplete > 0) {
                            label.css('margin-top', '-19px');
                        }
                        progressBar.progressbar('value', percentComplete).append(label);
                    };

                    // update the button model of the drop request status dialog
                    $('#drop-request-status-dialog').modal('setButtonModel', [{
                            buttonText: 'Stop',
                            handler: {
                                click: function () {
                                    cancelled = true;

                                    // we are waiting for the next poll attempt
                                    if (dropRequestTimer !== null) {
                                        // cancel it
                                        clearTimeout(dropRequestTimer);

                                        // cancel the drop request
                                        completeDropRequest();
                                    }
                                }
                            }
                        }]);

                    // completes the drop request by removing it and showing how many flowfiles were deleted
                    var completeDropRequest = function () {
                        if (nfCommon.isDefinedAndNotNull(dropRequest)) {
                            $.ajax({
                                type: 'DELETE',
                                url: dropRequest.uri,
                                dataType: 'json'
                            }).done(function(response) {
                                // report the results of this drop request
                                dropRequest = response.dropRequest;
                                
                                // build the results
                                var droppedTokens = dropRequest.dropped.split(/ \/ /);
                                var results = $('<div></div>');
                                $('<span class="label"></span>').text(droppedTokens[0]).appendTo(results);
                                $('<span></span>').text(' FlowFiles (' + droppedTokens[1] + ')').appendTo(results);
                                
                                // if the request did not complete, include the original
                                if (dropRequest.percentCompleted < 100) {
                                    var originalTokens = dropRequest.original.split(/ \/ /);
                                    $('<span class="label"></span>').text(' out of ' + originalTokens[0]).appendTo(results);
                                    $('<span></span>').text(' (' + originalTokens[1] + ')').appendTo(results);
                                }
                                $('<span></span>').text(' were removed from the queue.').appendTo(results);
                                
                                // if this request failed so the error
                                if (nfCommon.isDefinedAndNotNull(dropRequest.failureReason)) {
                                    $('<br/><br/><span></span>').text(dropRequest.failureReason).appendTo(results);
                                }
                                
                                // display the results
                                nfDialog.showOkDialog({
                                    dialogContent: results,
                                    overlayBackground: false
                                });
                            }).always(function() {
                                $('#drop-request-status-dialog').modal('hide');
                            });
                        } else {
                            // nothing was removed
                            nfDialog.showOkDialog({
                                dialogContent: 'No FlowFiles were removed.',
                                overlayBackground: false
                            });
                            
                            // close the dialog
                            $('#drop-request-status-dialog').modal('hide');
                        }
                    };

                    // process the drop request
                    var processDropRequest = function (delay) {
                        // update the percent complete
                        updateProgress(dropRequest.percentCompleted);

                        // update the status of the drop request
                        $('#drop-request-status-message').text(dropRequest.state);
                        
                        // update the current number of enqueued flowfiles
                        if (nfCommon.isDefinedAndNotNull(connection.status) && nfCommon.isDefinedAndNotNull(dropRequest.currentCount)) {
                            connection.status.queued = dropRequest.current;
                            nfConnection.refresh(connection.id);
                        }
                        
                        // close the dialog if the 
                        if (dropRequest.finished === true || cancelled === true) {
                            completeDropRequest();
                        } else {
                            // wait delay to poll again
                            dropRequestTimer = setTimeout(function () {
                                // clear the drop request timer
                                dropRequestTimer = null;

                                // schedule to poll the status again in nextDelay
                                pollDropRequest(Math.min(MAX_DELAY, delay * 2));
                            }, delay * 1000);
                        }
                    };

                    // schedule for the next poll iteration
                    var pollDropRequest = function (nextDelay) {
                        $.ajax({
                            type: 'GET',
                            url: dropRequest.uri,
                            dataType: 'json'
                        }).done(function(response) {
                            dropRequest = response.dropRequest;
                            processDropRequest(nextDelay);
                        }).fail(completeDropRequest);
                    };

                    // issue the request to delete the flow files
                    $.ajax({
                        type: 'POST',
                        url: connection.component.uri + '/drop-requests',
                        dataType: 'json'
                    }).done(function(response) {
                        // initialize the progress bar value
                        updateProgress(0);
                        
                        // show the progress dialog
                        $('#drop-request-status-dialog').modal('show');
                        
                        // process the drop request
                        dropRequest = response.dropRequest;
                        processDropRequest(1);
                    }).fail(completeDropRequest);
                }
            });
        },

        /**
         * Lists the flow files in the specified connection.
         *
         * @param {selection} selection
         */
        listQueue: function (selection) {
            if (selection.size() !== 1 || !nfCanvasUtils.isConnection(selection)) {
                return;
            }

            // get the connection data
            var connection = selection.datum();

            // list the flow files in the specified connection
            nfQueueListing.listQueue(connection);
        },

        /**
         * Views the state for the specified processor.
         *
         * @param {selection} selection
         */
        viewState: function (selection) {
            if (selection.size() !== 1 || !nfCanvasUtils.isProcessor(selection)) {
                return;
            }

            // get the processor data
            var processor = selection.datum();

            // view the state for the selected processor
            nfComponentState.showState(processor.component, nfCanvasUtils.supportsModification(selection));
        },

        /**
         * Opens the fill color dialog for the component in the specified selection.
         * 
         * @param {type} selection      The selection
         */
        fillColor: function (selection) {
            if (nfCanvasUtils.isColorable(selection)) {
                // we know that the entire selection is processors or labels... this
                // checks if the first item is a processor... if true, all processors
                var allProcessors = nfCanvasUtils.isProcessor(selection);
                
                var color;
                if (allProcessors) {
                    color = nfProcessor.defaultColor();
                } else {
                    color = nfLabel.defaultColor();
                }
                
                // if there is only one component selected, get its color otherwise use default
                if (selection.size() === 1) {
                    var selectionData = selection.datum();
                    
                    // use the specified color if appropriate
                    if (nfCommon.isDefinedAndNotNull(selectionData.component.style['background-color'])) {
                        color = selectionData.component.style['background-color'];
                    }
                }

                // set the color
                $('#fill-color').minicolors('value', color);

                // update the preview visibility
                if (allProcessors) {
                    $('#fill-color-processor-preview').show();
                    $('#fill-color-label-preview').hide();
                } else {
                    $('#fill-color-processor-preview').hide();
                    $('#fill-color-label-preview').show();
                }

                // show the dialog
                $('#fill-color-dialog').modal('show');
            }
        },
        
        /**
         * Groups the currently selected components into a new group.
         */
        group: function () {
            var selection = nfCanvasUtils.getSelection();

            // ensure that components have been specified
            if (selection.empty()) {
                return;
            }

            // ensure the selected components are eligible being moved into a new group
            $.when(nfCanvasUtils.eligibleForMove(selection)).done(function () {
                // determine the origin of the bounding box for the selected components
                var origin = nfCanvasUtils.getOrigin(selection);

                var pt = {'x': origin.x, 'y': origin.y};
                $.when(nfCanvasToolbox.promptForGroupName(pt)).done(function (processGroup) {
                    var group = d3.select('#id-' + processGroup.id);
                    nfCanvasUtils.moveComponents(selection, group);
                });
            });
        },
        
        /**
         * Moves the currently selected component into the current parent group.
         */
        moveIntoParent: function () {
            var selection = nfCanvasUtils.getSelection();

            // ensure that components have been specified
            if (selection.empty()) {
                return;
            }
            
            // move the current selection into the parent group
            nfCanvasUtils.moveComponentsToParent(selection);
        },
        
        /**
         * Creates a new template based off the currently selected components. If no components
         * are selected, a template of the entire canvas is made.
         */
        template: function () {
            var selection = nfCanvasUtils.getSelection();

            // if no components are selected, use the entire graph
            if (selection.empty()) {
                selection = d3.selectAll('g.component, g.connection');
            }

            // ensure that components have been specified
            if (selection.empty()) {
                nfDialog.showOkDialog({
                    dialogContent: "The current selection is not valid to create a template.",
                    overlayBackground: false
                });
                return;
            }

            // remove dangling edges (where only the source or destination is also selected)
            selection = nfCanvasUtils.trimDanglingEdges(selection);

            // ensure that components specified are valid
            if (selection.empty()) {
                nfDialog.showOkDialog({
                    dialogContent: "The current selection is not valid to create a template.",
                    overlayBackground: false
                });
                return;
            }

            // prompt for the template name
            $('#new-template-dialog').modal('setButtonModel', [{
                    buttonText: 'Create',
                    handler: {
                        click: function () {
                            // hide the dialog
                            $('#new-template-dialog').modal('hide');

                            // get the template details
                            var templateName = $('#new-template-name').val();
                            var templateDescription = $('#new-template-description').val();

                            // create a snippet
                            var snippetDetails = nfSnippet.marshal(selection, false);

                            // create the snippet
                            nfSnippet.create(snippetDetails).done(function (response) {
                                var snippet = response.snippet;

                                // create the template
                                $.ajax({
                                    type: 'POST',
                                    url: config.urls.controller + '/templates',
                                    data: {
                                        name: templateName,
                                        description: templateDescription,
                                        snippetId: snippet.id
                                    },
                                    dataType: 'json'
                                }).done(function () {
                                    // show the confirmation dialog
                                    nfDialog.showOkDialog({
                                        dialogContent: "Template '" + nfCommon.escapeHtml(templateName) + "' was successfully created.",
                                        overlayBackground: false
                                    });
                                }).always(function () {
                                    // remove the snippet
                                    nfSnippet.remove(snippet.id);

                                    // clear the template dialog fields
                                    $('#new-template-name').val('');
                                    $('#new-template-description').val('');
                                }).fail(nfCommon.handleAjaxError);
                            }).fail(nfCommon.handleAjaxError);
                        }
                    }
                }, {
                    buttonText: 'Cancel',
                    handler: {
                        click: function () {
                            $('#new-template-dialog').modal('hide');
                        }
                    }
                }]).modal('show');

            // auto focus on the template name
            $('#new-template-name').focus();
        },
        
        /**
         * Copies the component in the specified selection.
         * 
         * @param {selection} selection     The selection containing the component to be copied
         */
        copy: function (selection) {
            if (selection.empty()) {
                return;
            }

            // determine the origin of the bounding box of the selection
            var origin = nfCanvasUtils.getOrigin(selection);

            // copy the snippet details
            nfClipboard.copy({
                snippet: nfSnippet.marshal(selection, false),
                origin: origin
            });
        },
        
        /**
         * Pastes the currently copied selection.
         * 
         * @param {selection} selection     The selection containing the component to be copied
         * @param {obj} evt                 The mouse event
         */
        paste: function (selection, evt) {
            if (nfCommon.isDefinedAndNotNull(evt)) {
                // get the current scale and translation
                var scale = nfCanvas.View.scale();
                var translate = nfCanvas.View.translate();

                var mouseX = evt.pageX;
                var mouseY = evt.pageY - nfCanvas.CANVAS_OFFSET;

                // adjust the x and y coordinates accordingly
                var x = (mouseX / scale) - (translate[0] / scale);
                var y = (mouseY / scale) - (translate[1] / scale);

                // record the paste origin
                var pasteLocation = {
                    x: x,
                    y: y
                };
            }

            // perform the paste
            nfClipboard.paste().done(function (data) {
                var copySnippet = $.Deferred(function (deferred) {
                    var reject = function (xhr, status, error) {
                        deferred.reject(xhr.responseText);
                    };

                    // create a snippet from the details
                    nfSnippet.create(data['snippet']).done(function (createResponse) {
                        var snippet = createResponse.snippet;

                        // determine the origin of the bounding box of the copy
                        var origin = pasteLocation;
                        var snippetOrigin = data['origin'];

                        // determine the appropriate origin
                        if (!nfCommon.isDefinedAndNotNull(origin)) {
                            snippetOrigin.x += 25;
                            snippetOrigin.y += 25;
                            origin = snippetOrigin;
                        }

                        // copy the snippet to the new location
                        nfSnippet.copy(snippet.id, nfCanvas.getGroupId(), origin).done(function (copyResponse) {
                            var snippetContents = copyResponse.contents;

                            // update the graph accordingly
                            nfGraph.add(snippetContents, true);

                            // update component visibility
                            nfCanvas.View.updateVisibility();

                            // refresh the birdseye/toolbar
                            nfBirdseye.refresh();

                            // remove the original snippet
                            nfSnippet.remove(snippet.id).fail(reject);
                        }).fail(function () {
                            // an error occured while performing the copy operation, reload the
                            // graph in case it was a partial success
                            nfCanvas.reload().done(function () {
                                // update component visibility
                                nfCanvas.View.updateVisibility();

                                // refresh the birdseye/toolbar
                                nfBirdseye.refresh();
                            });
                        }).fail(reject);
                    }).fail(reject);
                }).promise();

                // show the appropriate message is the copy fails
                copySnippet.fail(function (responseText) {
                    // look for a message
                    var message = 'An error occurred while attempting to copy and paste.';
                    if ($.trim(responseText) !== '') {
                        message = responseText;
                    }

                    nfDialog.showOkDialog({
                        dialogContent: nfCommon.escapeHtml(message),
                        overlayBackground: true
                    });
                });
            });
        },
        
        /**
         * Moves the connection in the specified selection to the front.
         * 
         * @param {selection} selection
         */
        toFront: function (selection) {
            if (selection.size() !== 1 || !nfCanvasUtils.isConnection(selection)) {
                return;
            }

            // get the connection data
            var connection = selection.datum();

            // determine the current max zIndex
            var maxZIndex = -1;
            $.each(nfConnection.get(), function (_, otherConnection) {
                if (connection.component.id !== otherConnection.component.id && otherConnection.component.zIndex > maxZIndex) {
                    maxZIndex = otherConnection.component.zIndex;
                }
            });

            // ensure the edge wasn't already in front
            if (maxZIndex >= 0) {
                // use one higher
                var zIndex = maxZIndex + 1;

                var revision = nfClient.getRevision();

                // update the edge in question
                $.ajax({
                    type: 'PUT',
                    url: connection.component.uri,
                    data: {
                        version: revision.version,
                        clientId: revision.clientId,
                        zIndex: zIndex
                    },
                    dataType: 'json'
                }).done(function (response) {
                    // update the edge's zIndex
                    nfConnection.set(response.connection);
                    nfConnection.reorder();

                    // update the revision
                    nfClient.setRevision(response.revision);
                });
            }
        }
    };
});