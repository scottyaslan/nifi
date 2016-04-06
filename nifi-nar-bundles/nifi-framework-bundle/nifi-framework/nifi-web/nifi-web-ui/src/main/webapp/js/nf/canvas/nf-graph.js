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

/* global nf */

define(['nf-common',
        'nf-label',
        'nf-funnel',
        'nf-port',
        'nf-remote-process-group',
        'nf-process-group',
        'nf-processor'],
    function (nfCommon,
              nfLabel,
              nfFunnel,
              nfPort,
              nfRemoteProcessGroup,
              nfProcessGroup,
              nfProcessor) {

        var combinePorts = function (contents) {
            if (nfCommon.isDefinedAndNotNull(contents.inputPorts) && nfCommon.isDefinedAndNotNull(contents.outputPorts)) {
                return contents.inputPorts.concat(contents.outputPorts);
            } else if (nfCommon.isDefinedAndNotNull(contents.inputPorts)) {
                return contents.inputPorts;
            } else if (nfCommon.isDefinedAndNotNull(contents.outputPorts)) {
                return contents.outputPorts;
            } else {
                return [];
            }
        };

        var combinePortStatus = function (status) {
            if (nfCommon.isDefinedAndNotNull(status.inputPortStatusSnapshots) && nfCommon.isDefinedAndNotNull(status.outputPortStatusSnapshots)) {
                return status.inputPortStatusSnapshots.concat(status.outputPortStatusSnapshots);
            } else if (nfCommon.isDefinedAndNotNull(status.inputPortStatusSnapshots)) {
                return status.inputPortStatusSnapshots;
            } else if (nfCommon.isDefinedAndNotNull(status.outputPortStatusSnapshots)) {
                return status.outputPortStatusSnapshots;
            } else {
                return [];
            }
        };

        return {
            init: function (canvas) {

                // initialize the object responsible for each type of component
                nfLabel.init();
                nfFunnel.init();
                nfPort.init();
                nfRemoteProcessGroup.init();
                nfProcessGroup.init();
                nfProcessor.init();
                nfConnection.init();

                // load the graph
                return nfCanvasUtils.enterGroup(canvas.getGroupId(), this, canvas);
            },

            /**
             * Populates the graph with the resources defined in the response.
             *
             * @argument {object} processGroupContents      The contents of the process group
             * @argument {boolean} selectAll                Whether or not to select the new contents
             */
            add: function (processGroupContents, selectAll) {
                selectAll = nfCommon.isDefinedAndNotNull(selectAll) ? selectAll : false;

                // if we are going to select the new components, deselect the previous selection
                if (selectAll) {
                    canvasUtils.getSelection().classed('selected', false);
                }

                // merge the ports together
                var ports = combinePorts(processGroupContents);

                // add the components to the responsible object
                if (!nfCommon.isEmpty(processGroupContents.labels)) {
                    nfLabel.add(processGroupContents.labels, selectAll);
                }
                if (!nfCommon.isEmpty(processGroupContents.funnels)) {
                    nfFunnel.add(processGroupContents.funnels, selectAll);
                }
                if (!nfCommon.isEmpty(processGroupContents.remoteProcessGroups)) {
                    nfRemoteProcessGroup.add(processGroupContents.remoteProcessGroups, selectAll);
                }
                if (!nfCommon.isEmpty(ports)) {
                    nfPort.add(ports, selectAll);
                }
                if (!nfCommon.isEmpty(processGroupContents.processGroups)) {
                    nfProcessGroup.add(processGroupContents.processGroups, selectAll);
                }
                if (!nfCommon.isEmpty(processGroupContents.processors)) {
                    nfProcessor.add(processGroupContents.processors, selectAll);
                }
                if (!nfCommon.isEmpty(processGroupContents.connections)) {
                    nfConnection.add(processGroupContents.connections, selectAll);
                }

                // trigger the toolbar to refresh if the selection is changing
                if (selectAll) {
                    nfCanvasToolbar.refresh();
                }
            },

            /**
             * Gets the components currently on the canvas.
             */
            get: function () {
                return {
                    labels: nfLabel.get(),
                    funnels: nfFunnel.get(),
                    ports: nfPort.get(),
                    remoteProcessGroups: nfRemoteProcessGroup.get(),
                    processGroups: nfProcessGroup.get(),
                    processors: nfProcessor.get(),
                    connections: nfConnection.get()
                };
            },

            /**
             * Sets the components contained within the specified process group.
             *
             * @param {type} processGroupContents
             */
            set: function (processGroupContents) {
                // merge the ports together
                var ports = combinePorts(processGroupContents);

                // set the components
                if (!nfCommon.isEmpty(processGroupContents.labels)) {
                    nfLabel.set(processGroupContents.labels);
                }
                if (!nfCommon.isEmpty(processGroupContents.funnels)) {
                    nfFunnel.set(processGroupContents.funnels);
                }
                if (!nfCommon.isEmpty(ports)) {
                    nfPort.set(ports);
                }
                if (!nfCommon.isEmpty(processGroupContents.remoteProcessGroups)) {
                    nfRemoteProcessGroup.set(processGroupContents.remoteProcessGroups);
                }
                if (!nfCommon.isEmpty(processGroupContents.processGroups)) {
                    nfProcessGroup.set(processGroupContents.processGroups);
                }
                if (!nfCommon.isEmpty(processGroupContents.processors)) {
                    nfProcessor.set(processGroupContents.processors);
                }
                if (!nfCommon.isEmpty(processGroupContents.connections)) {
                    nfConnection.set(processGroupContents.connections);
                }
            },

            /**
             * Populates the status for the components specified. This will update the content
             * of the existing components on the graph and will not cause them to be repainted.
             * This operation must be very inexpensive due to the frequency it is called.
             *
             * @argument {object} aggregateSnapshot    The status of the process group aggregated accross the cluster
             */
            setStatus: function (aggregateSnapshot) {
                // merge the port status together
                var portStatus = combinePortStatus(aggregateSnapshot);

                // set the component status
                nfPort.setStatus(portStatus);
                nfRemoteProcessGroup.setStatus(aggregateSnapshot.remoteProcessGroupStatusSnapshots);
                nfProcessGroup.setStatus(aggregateSnapshot.processGroupStatusSnapshots);
                nfProcessor.setStatus(aggregateSnapshot.processorStatusSnapshots);
                nfConnection.setStatus(aggregateSnapshot.connectionStatusSnapshots);
            },

            /**
             * Clears all the components currently on the canvas. This function does not automatically refresh.
             */
            removeAll: function () {
                // remove all the components
                nfLabel.removeAll();
                nfFunnel.removeAll();
                nfPort.removeAll();
                nfRemoteProcessGroup.removeAll();
                nfProcessGroup.removeAll();
                nfProcessor.removeAll();
                nfConnection.removeAll();
            },

            /**
             * Refreshes all components currently on the canvas.
             */
            pan: function () {
                // refresh the components
                nfPort.pan();
                nfRemoteProcessGroup.pan();
                nfProcessGroup.pan();
                nfProcessor.pan();
                nfConnection.pan();
            }
        };
    });