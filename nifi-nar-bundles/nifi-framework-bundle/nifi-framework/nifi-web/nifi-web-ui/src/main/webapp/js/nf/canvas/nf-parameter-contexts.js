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

/* global define, module, require, exports */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery',
                'Slick',
                'd3',
                'nf.Client',
                'nf.Dialog',
                'nf.Storage',
                'nf.Common',
                'nf.CanvasUtils',
                'nf.ErrorHandler',
                'nf.FilteredDialogCommon',
                'nf.Shell',
                'nf.ComponentState',
                'nf.ComponentVersion',
                'nf.PolicyManagement',
                'nf.Processor',
                'nf.ProcessGroupConfiguration'],
            function ($, Slick, d3, nfClient, nfDialog, nfStorage, nfCommon, nfCanvasUtils, nfErrorHandler, nfFilteredDialogCommon, nfShell, nfComponentState, nfComponentVersion, nfPolicyManagement, nfProcessor, nfProcessGroupConfiguration) {
                return (nf.ParameterContexts = factory($, Slick, d3, nfClient, nfDialog, nfStorage, nfCommon, nfCanvasUtils, nfErrorHandler, nfFilteredDialogCommon, nfShell, nfComponentState, nfComponentVersion, nfPolicyManagement, nfProcessor, nfProcessGroupConfiguration));
            });
    } else if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = (nf.ParameterContexts =
            factory(require('jquery'),
                require('Slick'),
                require('d3'),
                require('nf.Client'),
                require('nf.Dialog'),
                require('nf.Storage'),
                require('nf.Common'),
                require('nf.CanvasUtils'),
                require('nf.ErrorHandler'),
                require('nf.FilteredDialogCommon'),
                require('nf.Shell'),
                require('nf.ComponentState'),
                require('nf.ComponentVersion'),
                require('nf.PolicyManagement'),
                require('nf.Processor'),
                require('nf.ProcessGroupConfiguration')));
    } else {
        nf.ParameterContexts = factory(root.$,
            root.Slick,
            root.d3,
            root.nf.Client,
            root.nf.Dialog,
            root.nf.Storage,
            root.nf.Common,
            root.nf.CanvasUtils,
            root.nf.ErrorHandler,
            root.nf.FilteredDialogCommon,
            root.nf.Shell,
            root.nf.ComponentState,
            root.nf.ComponentVersion,
            root.nf.PolicyManagement,
            root.nf.Processor,
            root.nf.ProcessGroupConfiguration);
    }
}(this, function ($, Slick, d3, nfClient, nfDialog, nfStorage, nfCommon, nfCanvasUtils, nfErrorHandler, nfFilteredDialogCommon, nfShell, nfComponentState, nfComponentVersion, nfPolicyManagement, nfProcessor, nfProcessGroupConfiguration) {
    'use strict';

    var config = {
        urls: {
            parameterContexts: '../nifi-api/parameter-contexts'
        }
    };

    var parameterContextsGridOptions = {
        forceFitColumns: true,
        enableTextSelectionOnCells: true,
        enableCellNavigation: true,
        enableColumnReorder: false,
        autoEdit: false,
        multiSelect: false,
        rowHeight: 24
    };

    var parametersGridOptions = {
        forceFitColumns: true,
        enableTextSelectionOnCells: true,
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        autoEdit: false,
        multiSelect: false,
        rowHeight: 24
    };

    /**
     * Formatter for the name column.
     *
     * @param {type} row
     * @param {type} cell
     * @param {type} value
     * @param {type} columnDef
     * @param {type} dataContext
     * @returns {String}
     */
    var nameFormatter = function (row, cell, value, columnDef, dataContext) {
        if (!dataContext.permissions.canRead) {
            return '<span class="blank">' + nfCommon.escapeHtml(dataContext.id) + '</span>';
        }

        return nfCommon.escapeHtml(dataContext.component.name);
    };

    /**
     * Sorts the specified data using the specified sort details.
     *
     * @param {object} sortDetails
     * @param {object} data
     */
    var sort = function (sortDetails, data) {
        // defines a function for sorting
        var comparer = function (a, b) {
            if (a.permissions.canRead && b.permissions.canRead) {
                var aString = nfCommon.isDefinedAndNotNull(a.component[sortDetails.columnId]) ? a.component[sortDetails.columnId] : '';
                var bString = nfCommon.isDefinedAndNotNull(b.component[sortDetails.columnId]) ? b.component[sortDetails.columnId] : '';
                return aString === bString ? 0 : aString > bString ? 1 : -1;
            } else {
                if (!a.permissions.canRead && !b.permissions.canRead) {
                    return 0;
                }
                if (a.permissions.canRead) {
                    return 1;
                } else {
                    return -1;
                }
            }
        };

        // perform the sort
        data.sort(comparer, sortDetails.sortAsc);
    };

    var lastSelectedId = null;

    /**
     * Sorts the specified data using the specified sort details.
     *
     * @param {object} sortDetails
     * @param {object} data
     */
    var sortParameters = function (sortDetails, data) {
        // defines a function for sorting
        var comparer = function (a, b) {
            if (sortDetails.columnId === 'name') {
                var aString = nfCommon.isDefinedAndNotNull(a[sortDetails.columnId]) ? a[sortDetails.columnId] : '';
                var bString = nfCommon.isDefinedAndNotNull(b[sortDetails.columnId]) ? b[sortDetails.columnId] : '';
                return aString === bString ? 0 : aString > bString ? 1 : -1;
            }
        };

        // perform the sort
        data.sort(comparer, sortDetails.sortAsc);
    };

    /**
     * Reset the dialog.
     */
    var resetDialog = function () {
        $('#parameter-context-name').val('');
        $('#parameter-context-description-field').val('');
        $('#parameter-table, #add-parameter').show();
        $('#parameter-context-tabs').show();
        $('#parameter-context-tabs').find('.tab')[0].click();
        $('#parameter-context-update-status').hide();

        newParameters = [];
        deletedParameters = [];
        updatedParameters = [];

        $('#process-group-parameter').text('');
        $('#parameter-process-group-id').text('').removeData('revision');
        $('#parameter-affected-components-context').removeClass('unset').text('');

        var parameterGrid = $('#parameter-table').data('gridInstance');
        var parameterData = parameterGrid.getData();
        parameterData.setItems([]);

        var affectedProcessorContainer = $('#parameter-context-affected-processors');
        nfCommon.cleanUpTooltips(affectedProcessorContainer, 'div.referencing-component-state');
        nfCommon.cleanUpTooltips(affectedProcessorContainer, 'div.referencing-component-bulletins');
        affectedProcessorContainer.empty();

        var affectedControllerServicesContainer = $('#parameter-context-affected-controller-services');
        nfCommon.cleanUpTooltips(affectedControllerServicesContainer, 'div.referencing-component-state');
        nfCommon.cleanUpTooltips(affectedControllerServicesContainer, 'div.referencing-component-bulletins');
        affectedControllerServicesContainer.empty();

        $('#parameter-context-affected-unauthorized-components').empty();

        // reset the last selected parameter
        lastSelectedId = null;
    };

    /**
     * Marshals the parameters in the table.
     */
    var marshalParameters = function () {
        var parameters = [];
        var map = {};

        // only return modified/new/deleted parameters
        $.each(newParameters, function () {
            var parameter = {
                parameter: {
                    'name': this.name,
                    'value': this.value,
                    'sensitive': this.sensitive,
                    'description': this.description
                }
            };

            map[this.name] = parameter;
        });

        $.each(updatedParameters, function () {
            var parameter =  {
                parameter: {
                    'name': this.name,
                    'description': this.description
                }
            };

            if (!this.sensitive) {
                parameter['parameter']['value'] = this.value;
            }

            map[this.name] = parameter;
        });

        $.each(deletedParameters, function () {
            var parameter =  {
                parameter: {
                    'name': this.name
                }
            };

            map[this.name] = parameter;
        });

        $.each(map, function (key, value) {
            parameters.push(value);
        });

        return parameters;
    };

    /**
     * Handles outstanding changes.
     *
     * @returns {deferred}
     */
    var handleOutstandingChanges = function () {
        if ($('#parameter-dialog:visible')) {
            // commit the current edit
            addNewParameter();
        }

        return $.Deferred(function (deferred) {
            if ($('#paramter-context-update-status').is(':visible')) {
                close();
                deferred.resolve();
            } else {
                var parameters = marshalParameters();

                // if there are no parameters there is nothing to save
                if ($.isEmptyObject(parameters)) {
                    close();
                    deferred.resolve();
                } else {
                    // see if those changes should be saved
                    nfDialog.showYesNoDialog({
                        headerText: 'Parameters',
                        dialogContent: 'Save changes before leaving parameter context configuration?',
                        noHandler: function () {
                            close();
                            deferred.resolve();
                        },
                        yesHandler: function () {
                            updateParameterContexts().done(function () {
                                deferred.resolve();
                            }).fail(function () {
                                deferred.reject();
                            });
                        }
                    });
                }
            }

        }).promise();
    };

    /**
     * Cancels adding a new parameter context.
     */
    var close = function () {
        $('#parameter-context-dialog').modal('hide');
    };

    /**
     * Renders the specified affected component.
     *
     * @param {object} affectedProcessorEntity
     * @param {jQuery} container
     */
    var renderAffectedProcessor = function (affectedProcessorEntity, container) {
        var affectedProcessorContainer = $('<li class="affected-component-container"></li>').appendTo(container);
        var affectedProcessor = affectedProcessorEntity.component;

        // processor state
        $('<div class="referencing-component-state"></div>').addClass(function () {
            if (nfCommon.isDefinedAndNotNull(affectedProcessor.state)) {
                var icon = $(this);

                var state = affectedProcessor.state.toLowerCase();
                if (state === 'stopped' && !nfCommon.isEmpty(affectedProcessor.validationErrors)) {
                    state = 'invalid';

                    // build the validation error listing
                    var list = nfCommon.formatUnorderedList(affectedProcessor.validationErrors);

                    // add tooltip for the warnings
                    icon.qtip($.extend({},
                        nfCanvasUtils.config.systemTooltipConfig,
                        {
                            content: list
                        }));
                }

                return state;
            } else {
                return '';
            }
        }).appendTo(affectedProcessorContainer);


        // processor name
        $('<span class="referencing-component-name link"></span>').text(affectedProcessor.name).on('click', function () {
            // check if there are outstanding changes
            handleOutstandingChanges().done(function () {
                // show the component in question
                nfCanvasUtils.showComponent(affectedProcessor.processGroupId, affectedProcessor.id);
            });
        }).appendTo(affectedProcessorContainer);

        // bulletin
        $('<div class="referencing-component-bulletins"></div>').addClass(affectedProcessor.id + '-affected-bulletins').appendTo(affectedProcessorContainer);

        // processor active threads
        $('<span class="referencing-component-active-thread-count"></span>').text(function () {
            if (nfCommon.isDefinedAndNotNull(affectedProcessor.activeThreadCount) && affectedProcessor.activeThreadCount > 0) {
                return '(' + affectedProcessor.activeThreadCount + ')';
            } else {
                return '';
            }
        }).appendTo(affectedProcessorContainer);
    };

    /**
     * Renders the specified affect controller service.
     *
     * @param {object} affectedControllerServiceEntity
     * @param {jQuery} container
     */
    var renderAffectedControllerService = function (affectedControllerServiceEntity, container) {
        var affectedControllerServiceContainer = $('<li class="affected-component-container"></li>').appendTo(container);
        var affectedControllerService = affectedControllerServiceEntity.component;

        // controller service state
        $('<div class="referencing-component-state"></div>').addClass(function () {
            if (nfCommon.isDefinedAndNotNull(affectedControllerService.state)) {
                var icon = $(this);

                var state = affectedControllerService.state === 'ENABLED' ? 'enabled' : 'disabled';
                if (state === 'disabled' && !nfCommon.isEmpty(affectedControllerService.validationErrors)) {
                    state = 'invalid';

                    // build the error listing
                    var list = nfCommon.formatUnorderedList(affectedControllerService.validationErrors);

                    // add tooltip for the warnings
                    icon.qtip($.extend({},
                        nfCanvasUtils.config.systemTooltipConfig,
                        {
                            content: list
                        }));
                }
                return state;
            } else {
                return '';
            }
        }).appendTo(affectedControllerServiceContainer);

        // bulletin
        $('<div class="referencing-component-bulletins"></div>').addClass(affectedControllerService.id + '-affected-bulletins').appendTo(affectedControllerServiceContainer);

        // controller service name
        $('<span class="referencing-component-name link"></span>').text(affectedControllerService.name).on('click', function () {
            // check if there are outstanding changes
            handleOutstandingChanges().done(function () {
                // show the component in question
                nfProcessGroupConfiguration.showConfiguration(affectedControllerService.processGroupId).done(function () {
                    nfProcessGroupConfiguration.selectControllerService(affectedControllerService.id);
                });
            });
        }).appendTo(affectedControllerServiceContainer);
    };

    /**
     * Populates the affected components for the specified parameter context.
     *
     * @param {object} affectedComponents
     */
    var populateAffectedComponents = function (affectedComponents) {
        var affectedProcessors = [];
        var affectedControllerServices = [];
        var unauthorizedAffectedComponents = [];

        // clear the affected components from the previous selection
        var processorContainer = $('#parameter-context-affected-processors');
        nfCommon.cleanUpTooltips(processorContainer, 'div.referencing-component-state');
        nfCommon.cleanUpTooltips(processorContainer, 'div.referencing-component-bulletins');
        processorContainer.empty();

        var controllerServiceContainer = $('#parameter-context-affected-controller-services');
        nfCommon.cleanUpTooltips(controllerServiceContainer, 'div.referencing-component-state');
        nfCommon.cleanUpTooltips(controllerServiceContainer, 'div.referencing-component-bulletins');
        controllerServiceContainer.empty();

        var unauthorizedComponentsContainer = $('#parameter-context-affected-unauthorized-components').empty();

        // affected component will be undefined when a new parameter is added
        if (nfCommon.isUndefined(affectedComponents)) {
            $('<li class="affected-component-container"><span class="unset">Pending Apply</span></li>').appendTo(processorContainer);
            $('<li class="affected-component-container"><span class="unset">Pending Apply</span></li>').appendTo(controllerServiceContainer);
            $('<li class="affected-component-container"><span class="unset">Pending Apply</span></li>').appendTo(unauthorizedComponentsContainer);
        } else {
            var referencingComponentsForBulletinRetrieval = [];

            // bin the affected components according to their type
            $.each(affectedComponents, function (_, affectedComponentEntity) {
                if (affectedComponentEntity.permissions.canRead === true && affectedComponentEntity.permissions.canWrite === true) {
                    referencingComponentsForBulletinRetrieval.push(affectedComponentEntity.id);

                    if (affectedComponentEntity.component.referenceType === 'PROCESSOR') {
                        affectedProcessors.push(affectedComponentEntity);
                    } else {
                        affectedControllerServices.push(affectedComponentEntity);
                    }
                } else {
                    // if we're unauthorized only because the user is lacking write permissions, we can still query for bulletins
                    if (affectedComponentEntity.permissions.canRead === true) {
                        referencingComponentsForBulletinRetrieval.push(affectedComponentEntity.id);
                    }

                    unauthorizedAffectedComponents.push(affectedComponentEntity);
                }
            });

            if (affectedProcessors.length === 0) {
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(processorContainer);
            } else {
                // sort the affected processors
                affectedProcessors.sort(nameComparator);

                // render each and register a click handler
                $.each(affectedProcessors, function (_, affectedProcessorEntity) {
                    renderAffectedProcessor(affectedProcessorEntity, processorContainer);
                });
            }

            if (affectedControllerServices.length === 0) {
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(controllerServiceContainer);
            } else {
                // sort the affected controller services
                affectedControllerServices.sort(nameComparator);

                // render each and register a click handler
                $.each(affectedControllerServices, function (_, affectedControllerServiceEntity) {
                    renderAffectedControllerService(affectedControllerServiceEntity, controllerServiceContainer);
                });
            }

            if (unauthorizedAffectedComponents.length === 0) {
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(unauthorizedComponentsContainer);
            } else {
                // sort the unauthorized affected components
                unauthorizedAffectedComponents.sort(function (a, b) {
                    if (a.permissions.canRead === true && b.permissions.canRead === true) {
                        // processors before controller services
                        var sortVal = a.component.referenceType === b.component.referenceType ? 0 : a.component.referenceType > b.component.referenceType ? -1 : 1;

                        // if a and b are the same type, then sort by name
                        if (sortVal === 0) {
                            sortVal = a.component.name === b.component.name ? 0 : a.component.name > b.component.name ? 1 : -1;
                        }

                        return sortVal;
                    } else {

                        // if lacking read and write perms on both, sort by id
                        if (a.permissions.canRead === false && b.permissions.canRead === false) {
                            return a.id > b.id ? 1 : -1;
                        } else {
                            // if only one has read perms, then let it come first
                            if (a.permissions.canRead === true) {
                                return -1;
                            } else {
                                return 1;
                            }
                        }
                    }
                });

                $.each(unauthorizedAffectedComponents, function (_, unauthorizedAffectedComponentEntity) {
                    if (unauthorizedAffectedComponentEntity.permissions.canRead === true) {
                        if (unauthorizedAffectedComponentEntity.component.referenceType === 'PROCESSOR') {
                            renderAffectedProcessor(unauthorizedAffectedComponentEntity, unauthorizedComponentsContainer);
                        } else {
                            renderAffectedControllerService(unauthorizedAffectedComponentEntity, unauthorizedComponentsContainer);
                        }
                    } else {
                        var affectedUnauthorizedComponentContainer = $('<li class="affected-component-container"></li>').appendTo(unauthorizedComponentsContainer);
                        $('<span class="unset"></span>').text(unauthorizedAffectedComponentEntity.id).appendTo(affectedUnauthorizedComponentContainer);
                    }
                });
            }

            // query for the bulletins
            if (referencingComponentsForBulletinRetrieval.length > 0) {
                nfCanvasUtils.queryBulletins(referencingComponentsForBulletinRetrieval).done(function (response) {
                    var bulletins = response.bulletinBoard.bulletins;

                    var bulletinsBySource = d3.nest()
                        .key(function (d) {
                            return d.sourceId;
                        })
                        .map(bulletins, d3.map);

                    bulletinsBySource.each(function (sourceBulletins, sourceId) {
                        $('div.' + sourceId + '-affected-bulletins').each(function () {
                            var bulletinIcon = $(this);

                            // if there are bulletins update them
                            if (sourceBulletins.length > 0) {
                                // format the new bulletins
                                var formattedBulletins = nfCommon.getFormattedBulletins(sourceBulletins);

                                var list = nfCommon.formatUnorderedList(formattedBulletins);

                                // update existing tooltip or initialize a new one if appropriate
                                bulletinIcon.addClass('has-bulletins').show().qtip($.extend({},
                                    nfCanvasUtils.config.systemTooltipConfig,
                                    {
                                        content: list
                                    }));
                            }
                        });
                    });
                });
            }
        }
    };

    /**
     * Sorts the specified entities based on the name.
     *
     * @param {object} a
     * @param {object} b
     * @returns {number}
     */
    var nameComparator = function (a, b) {
        return a.component.name.localeCompare(b.component.name);
    };

    var newParameters = [];
    var updatedParameters = [];
    var deletedParameters = [];

    /**
     * Adds a new parameter.
     */
    var addNewParameter = function () {
        var parameterName = $.trim($('#parameter-name').val());

        // ensure the parameter name is specified
        if (parameterName !== '') {
            var parameterGrid = $('#parameter-table').data('gridInstance');
            var parameterData = parameterGrid.getData();

            // ensure the parameter name is unique
            var matchingParameter = null;
            $.each(parameterData.getItems(), function (_, item) {
                if (parameterName === item.name) {
                    matchingParameter = item;
                }
            });

            if (matchingParameter === null) {
                var parameter = {
                    id: parameterCount,
                    type: 'Parameter',
                    sensitive: $('#parameter-dialog').find('input[name="sensitive"]:checked').val() === "sensitive" ? true : false,
                    name: parameterName,
                    value: $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-checked') ? '' : ($.trim($('#parameter-value-field').val()) === '' ? null : $.trim($('#parameter-value-field').val())),
                    description: $.trim($('#parameter-description-field').val()),
                    previousValue: null,
                    isEditable: true
                };

                // add a row for the new parameter
                parameterData.addItem(parameter);

                // sort the data
                parameterData.reSort();

                // select the new parameter row
                var row = parameterData.getRowById(parameterCount);
                parameterGrid.setActiveCell(row, parameterGrid.getColumnIndex('value'));
                newParameters.push(parameter);
                parameterCount++;
            } else {
                nfDialog.showOkDialog({
                    headerText: 'Parameter Exists',
                    dialogContent: 'A parameter with this name already exists.'
                });

                // select the existing properties row
                var matchingRow = parameterData.getRowById(matchingParameter.id);
                parameterGrid.setSelectedRows([matchingRow]);
                parameterGrid.scrollRowIntoView(matchingRow);
            }

            // close the new parameter dialog
            $('#parameter-dialog').modal('hide');

            // update the buttons to possibly trigger the disabled state
            $('#parameter-context-dialog').modal('refreshButtons');

        } else {
            nfDialog.showOkDialog({
                headerText: 'Configuration Error',
                dialogContent: 'The name of the parameter must be specified.'
            });
        }
    };

    /**
     * Update a parameter.
     */
    var updateParameter = function () {
        var parameterName = $.trim($('#parameter-name').val());

        // ensure the parameter name is specified
        if (parameterName !== '') {
            var parameterGrid = $('#parameter-table').data('gridInstance');
            var parameterData = parameterGrid.getData();

            // ensure the parameter name is unique
            var matchingParameter = null;
            $.each(parameterData.getItems(), function (_, item) {
                if (parameterName === item.name) {
                    matchingParameter = item;
                }
            });

            if (matchingParameter !== null) {
                var parameter = {
                    id: matchingParameter.id,
                    type: 'Parameter',
                    sensitive: matchingParameter.sensitive,
                    name: parameterName,
                    value: $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-checked') ? '' : ($.trim($('#parameter-value-field').val()) === '' ? null : $.trim($('#parameter-value-field').val())),
                    description: $.trim($('#parameter-description-field').val()),
                    previousValue: matchingParameter.value,
                    isEditable: matchingParameter.canWrite
                };

                // update row for the parameter
                parameterData.updateItem(matchingParameter.id, parameter);

                // sort the data
                parameterData.reSort();

                // select the parameter row
                var row = parameterData.getRowById(matchingParameter.id);
                parameterGrid.setActiveCell(row, parameterGrid.getColumnIndex('value'));
                updatedParameters.push(parameter);
            } else {
                nfDialog.showOkDialog({
                    headerText: 'Parameter Does Not Exists',
                    dialogContent: 'A parameter with this name does not exist.'
                });
            }

            // close the new parameter dialog
            $('#parameter-dialog').modal('hide');

            // update the buttons to possibly trigger the disabled state
            $('#parameter-context-dialog').modal('refreshButtons');
        } else {
            nfDialog.showOkDialog({
                headerText: 'Create Parameter Error',
                dialogContent: 'The name of the parameter must be specified.'
            });
        }
    };

    /**
     * Updates parameter contexts by issuing an update request and polling until it's completion.
     */
    var updateParameterContexts = function (parameterContextEntity) {
        var parameters = marshalParameters();

        if (parameters.length === 0) {
            // no
            parameterContextEntity.component.parameters = [];
            if ($('#parameter-context-name').val() === parameterContextEntity.component.name &&
                $('#parameter-context-description-field').val() === parameterContextEntity.component.description) {
                close();

                return;
            }
        } else {
            parameterContextEntity.component.parameters = parameters;
        }

        parameterContextEntity.component.name = $('#parameter-context-name').val();
        parameterContextEntity.component.description = $('#parameter-context-description-field').val();

        // update the parameters context
        var parameterNames = parameterContextEntity.component.parameters.map(function (parameterEntity) {
            return parameterEntity.parameter.name;
        });
        $('#parameter-affected-components-context').removeClass('unset').text(parameterNames.join(', '));

        return $.Deferred(function (deferred) {
            // updates the button model to show the close button
            var updateToCloseButtonModel = function () {
                $('#parameter-context-dialog').modal('setButtonModel', [{
                    buttonText: 'Close',
                    color: {
                        base: '#728E9B',
                        hover: '#004849',
                        text: '#ffffff'
                    },
                    handler: {
                        click: function () {
                            deferred.resolve();
                            close();
                        }
                    }
                }]);
            };

            var cancelled = false;

            // update the button model to show the cancel button
            $('#parameter-context-dialog').modal('setButtonModel', [{
                buttonText: 'Cancel',
                color: {
                    base: '#E3E8EB',
                    hover: '#C7D2D7',
                    text: '#004849'
                },
                handler: {
                    click: function () {
                        cancelled = true;
                        updateToCloseButtonModel()
                    }
                }
            }]);

            var requestId;
            var handleAjaxFailure = function (xhr, status, error) {
                // delete the request if possible
                if (nfCommon.isDefinedAndNotNull(requestId)) {
                    deleteUpdateRequest(parameterContextEntity.id, requestId);
                }

                // update the step status
                $('#parameter-context-update-steps').find('div.parameter-context-step.ajax-loading').removeClass('ajax-loading').addClass('ajax-error');

                // update the button model
                updateToCloseButtonModel();
            };

            submitUpdateRequest(parameterContextEntity).done(function (response) {
                var pollUpdateRequest = function (updateRequestEntity) {
                    var updateRequest = updateRequestEntity.request;
                    var errored = nfCommon.isDefinedAndNotNull(updateRequest.failureReason);

                    // get the request id
                    requestId = updateRequest.requestId;

                    // TODO: update the affected components
                    populateAffectedComponents(updateRequest.affectedComponents);

                    // update the progress/steps
                    populateParameterContextUpdateStep(updateRequest.updateSteps, cancelled, errored);

                    // if this request was cancelled, remove the update request
                    if (cancelled) {
                        deleteUpdateRequest(parameterContextEntity.id, requestId);
                    } else {
                        if (updateRequest.complete === true) {
                            if (errored) {
                                nfDialog.showOkDialog({
                                    headerText: 'Parameter Context Update Error',
                                    dialogContent: 'Unable to complete parameter context update request: ' + nfCommon.escapeHtml(updateRequest.failureReason)
                                });
                            }

                            // reload affected processors
                            $.each(updateRequest.affectedComponents, function (_, affectedComponentEntity) {
                                if (affectedComponentEntity.permissions.canRead === true) {
                                    var affectedComponent = affectedComponentEntity.component;

                                    // reload the processor if it's in the current group
                                    if (affectedComponent.referenceType === 'PROCESSOR' /*&& nfCanvasUtils.getGroupId() === affectedComponent.processGroupId*/) {
                                        nfProcessor.reload(affectedComponent.id);
                                    }
                                }
                            });

                            // update the parameter context table if displayed
                            var parameterContextGrid = $('#parameter-contexts-table').data('gridInstance');
                            if (nfCommon.isDefinedAndNotNull(parameterContextGrid)) {
                                var parameterContextData = parameterContextGrid.getData();

                                $.extend(parameterContextEntity, {
                                    revision: updateRequestEntity.parameterContextRevision,
                                    component: updateRequestEntity.request.parameterContext
                                });

                                parameterContextData.updateItem(parameterContextEntity.id, parameterContextEntity);
                            }

                            // delete the update request
                            deleteUpdateRequest(parameterContextEntity.id, requestId);

                            // update the button model
                            updateToCloseButtonModel();
                        } else {
                            // wait to get an updated status
                            setTimeout(function () {
                                getUpdateRequest(parameterContextEntity.id, requestId).done(function (getResponse) {
                                    pollUpdateRequest(getResponse);
                                }).fail(handleAjaxFailure);
                            }, 2000);
                        }
                    }
                };

                // update the visibility
                $('#parameter-table, #add-parameter').hide();
                $('#parameter-context-tabs').find('.tab')[1].click();
                $('#parameter-context-tabs').hide();
                $('#parameter-context-update-status').show();

                pollUpdateRequest(response);
            }).fail(handleAjaxFailure);
        }).promise();
    };

    /**
     * Obtains the current state of the updateRequest using the specified update request id.
     *
     * @param {string} updateRequestId
     * @returns {deferred} update request xhr
     */
    var getUpdateRequest = function (parameterContextId, updateRequestId) {
        return $.ajax({
            type: 'GET',
            url: config.urls.parameterContexts + '/' + encodeURIComponent(parameterContextId) + '/update-requests/' + encodeURIComponent(updateRequestId),
            dataType: 'json'
        }).fail(nfErrorHandler.handleAjaxError);
    };

    /**
     * Deletes an updateRequest using the specified update request id.
     *
     * @param {string} updateRequestId
     * @returns {deferred} update request xhr
     */
    var deleteUpdateRequest = function (parameterContextId, updateRequestId) {
        return $.ajax({
            type: 'DELETE',
            url: config.urls.parameterContexts + '/' + encodeURIComponent(parameterContextId) + '/update-requests/' + encodeURIComponent(updateRequestId) + '?' + $.param({
                'disconnectedNodeAcknowledged': nfStorage.isDisconnectionAcknowledged()
            }),
            dataType: 'json'
        }).fail(nfErrorHandler.handleAjaxError);
    };

    /**
     * Submits an parameter context update request.
     *
     * @param {object} parameterContextEntity
     * @returns {deferred} update request xhr
     */
    var submitUpdateRequest = function (parameterContextEntity) {
        return $.ajax({
            type: 'POST',
            data: JSON.stringify(parameterContextEntity),
            url: config.urls.parameterContexts + '/' + encodeURIComponent(parameterContextEntity.id) + '/update-requests',
            dataType: 'json',
            contentType: 'application/json'
        }).fail(nfErrorHandler.handleAjaxError);
    };

    /**
     * Populates the parameter update steps.
     *
     * @param {array} updateSteps
     * @param {boolean} whether this request has been cancelled
     * @param {boolean} whether this request has errored
     */
    var populateParameterContextUpdateStep = function (updateSteps, cancelled, errored) {
        var updateStatusContainer = $('#parameter-context-update-steps').empty();

        // go through each step
        $.each(updateSteps, function (_, updateStep) {
            var stepItem = $('<li></li>').text(updateStep.description).appendTo(updateStatusContainer);

            $('<div class="parameter-context-step"></div>').addClass(function () {
                if (nfCommon.isDefinedAndNotNull(updateStep.failureReason)) {
                    return 'ajax-error';
                } else {
                    if (updateStep.complete === true) {
                        return 'ajax-complete';
                    } else {
                        return cancelled === true || errored === true ? 'ajax-error' : 'ajax-loading';
                    }
                }
            }).appendTo(stepItem);

            $('<div class="clear"></div>').appendTo(stepItem);
        });
    };

    var parameterCount = 0;
    var parameterIndex = 0;

    /**
     * Loads the specified parameter registry.
     *
     * @param {object} parameterContext
     * @param {string} parameterToSelect to select
     */
    var loadParameters = function (parameterContext, parameterToSelect) {
        if (nfCommon.isDefinedAndNotNull(parameterContext)) {

            var parameterGrid = $('#parameter-table').data('gridInstance');
            var parameterData = parameterGrid.getData();

            // begin the update
            parameterData.beginUpdate();

            var parameters = [];
            $.each(parameterContext.component.parameters, function (i, parameterEntity) {
                var parameter = {
                    id: parameterCount++,
                    type: 'Parameter',
                    name: parameterEntity.parameter.name,
                    value: parameterEntity.parameter.value,
                    sensitive: parameterEntity.parameter.sensitive,
                    description: parameterEntity.parameter.description,
                    previousValue: parameterEntity.parameter.value,
                    isEditable: parameterEntity.canWrite,
                    affectedComponents: parameterEntity.parameter.referencingComponents
                };

                parameters.push({
                    parameter: parameter
                });

                parameterData.addItem(parameter);
            });

            // complete the update
            parameterData.endUpdate();
            parameterData.reSort();

            // if we are pre-selecting a specific parameter, get it's parameterIndex
            if (nfCommon.isDefinedAndNotNull(parameterToSelect)) {
                $.each(parameters, function (i, parameterEntity) {
                    if (parameterEntity.parameter.name === parameterToSelect) {
                        parameterIndex = parameterData.getRowById(parameterEntity.parameter.id);
                    }
                });
            }

            if (parameters.length === 0) {
                // empty the containers
                var processorContainer = $('#parameter-context-affected-processors');
                nfCommon.cleanUpTooltips(processorContainer, 'div.referencing-component-state');
                nfCommon.cleanUpTooltips(processorContainer, 'div.referencing-component-bulletins');
                processorContainer.empty();

                var controllerServiceContainer = $('#parameter-context-affected-controller-services');
                nfCommon.cleanUpTooltips(controllerServiceContainer, 'div.referencing-component-state');
                nfCommon.cleanUpTooltips(controllerServiceContainer, 'div.referencing-component-bulletins');
                controllerServiceContainer.empty();

                var unauthorizedComponentsContainer = $('#parameter-context-affected-unauthorized-components').empty();

                // indicate no affected components
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(processorContainer);
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(controllerServiceContainer);
                $('<li class="affected-component-container"><span class="unset">None</span></li>').appendTo(unauthorizedComponentsContainer);

                // update the selection context
                $('#parameter-affected-components-context').addClass('unset').text('None');
            } else {
                // select the desired row
                parameterGrid.setSelectedRows([parameterIndex]);
            }
        }
    };

    /**
     * Initializes the parameter table
     */
    var initParameterTable = function () {
        var parameterTable = $('#parameter-table');

        var nameFormatter = function (row, cell, value, columnDef, dataContext) {
            var nameWidthOffset = 30;
            var cellContent = $('<div></div>');

            // format the contents
            var formattedValue = $('<span/>').addClass('table-cell').text(value).appendTo(cellContent);
            if (dataContext.type === 'required') {
                formattedValue.addClass('required');
            }

            // show the parameter description if applicable
            if (!nfCommon.isBlank(dataContext.description)) {
                $('<div class="fa fa-question-circle" alt="Info" title="' + dataContext.description + '" style="float: right;"></div>').appendTo(cellContent);
                nameWidthOffset = 46; // 10 + icon width (10) + icon margin (6) + padding (20)
            }

            // adjust the width accordingly
            formattedValue.width(columnDef.width - nameWidthOffset).ellipsis();

            // return the cell content
            return cellContent.html();
        };

        var valueFormatter = function (row, cell, value, columnDef, dataContext) {
            if (dataContext.sensitive === true) {
                return '<span class="table-cell blank">********</span>';
            } else if (value === '') {
                return '<span class="table-cell blank">Empty string set</span>';
            } else if (value === null) {
                return '<span class="unset">No value set</span>';
            } else {
                return nfCommon.escapeHtml(value);
            }
        };

        var parameterActionFormatter = function (row, cell, value, columnDef, dataContext) {
            var markup = '';

            if (dataContext.isEditable === true) {
                markup += '<div title="Edit" class="edit-parameter pointer fa fa-pencil"></div>';
                markup += '<div title="Delete" class="delete-parameter pointer fa fa-trash"></div>';
            }

            return markup;
        };

        // define the column model for the controller services table
        var parameterColumns = [
            {
                id: 'name',
                name: 'Name',
                field: 'name',
                formatter: nameFormatter,
                sortable: true,
                resizable: true,
                rerenderOnResize: true
            },
            {
                id: 'value',
                name: 'Value',
                field: 'value',
                formatter: valueFormatter,
                sortable: false,
                resizable: true
            },
            {
                id: 'actions',
                name: '&nbsp;',
                resizable: false,
                rerenderOnResize: true,
                formatter: parameterActionFormatter,
                sortable: false,
                width: 90,
                maxWidth: 90
            }
        ];

        // initialize the dataview
        var parameterData = new Slick.Data.DataView({
            inlineFilters: false
        });

        // initialize the sort
        sortParameters({
            columnId: 'name',
            sortAsc: true
        }, parameterData);

        // initialize the grid
        var parametersGrid = new Slick.Grid(parameterTable, parameterData, parameterColumns, parametersGridOptions);
        parametersGrid.setSelectionModel(new Slick.RowSelectionModel());
        parametersGrid.registerPlugin(new Slick.AutoTooltips());
        parametersGrid.setSortColumn('name', true);
        parametersGrid.onSort.subscribe(function (e, args) {
            sortParameters({
                columnId: args.sortCol.id,
                sortAsc: args.sortAsc
            }, parameterData);
        });
        parametersGrid.onClick.subscribe(function (e, args) {
            // get the parameter at this row
            var parameter = parameterData.getItem(args.row);

            if (parametersGrid.getColumns()[args.cell].id === 'actions') {
                var target = $(e.target);

                // determine the desired action
                if (target.hasClass('delete-parameter')) {
                    // mark the property in question for removal and refresh the table
                    parameterData.deleteItem(parameter.id);
                    deletedParameters.push(parameter);

                    // reset the selection if necessary
                    var selectedRows = parametersGrid.getSelectedRows();
                    if (selectedRows.length === 0) {
                        parametersGrid.setSelectedRows([0]);
                    }

                    var rows = parameterData.getItems();
                    if (rows.length === 0) {
                        // clear usages
                        $('#parameter-affected-components-context').removeClass('unset').text('');

                        var affectedProcessorContainer = $('#parameter-context-affected-processors');
                        nfCommon.cleanUpTooltips(affectedProcessorContainer, 'div.referencing-component-state');
                        nfCommon.cleanUpTooltips(affectedProcessorContainer, 'div.referencing-component-bulletins');
                        affectedProcessorContainer.empty();

                        var affectedControllerServicesContainer = $('#parameter-context-affected-controller-services');
                        nfCommon.cleanUpTooltips(affectedControllerServicesContainer, 'div.referencing-component-state');
                        nfCommon.cleanUpTooltips(affectedControllerServicesContainer, 'div.referencing-component-bulletins');
                        affectedControllerServicesContainer.empty();

                        $('#parameter-context-affected-unauthorized-components').empty();

                        // reset the last selected parameter
                        lastSelectedId = null;
                    }

                    // update the buttons to possibly trigger the disabled state
                    $('#parameter-context-dialog').modal('refreshButtons');

                    // prevents standard edit logic
                    e.stopImmediatePropagation();
                } else if (target.hasClass('edit-parameter')) {
                    $('#parameter-dialog').modal('setHeaderText', 'Edit Parameter').modal('setButtonModel', [{
                        buttonText: 'Apply',
                        color: {
                            base: '#728E9B',
                            hover: '#004849',
                            text: '#ffffff'
                        },
                        disabled: function () {
                            var value = $('#parameter-value-field').val();
                            var description = $('#parameter-description-field').val();

                            if (value === parameter.value) {
                                if (value === '********') {
                                    return false;
                                } else if (value === '' && $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-unchecked')) {
                                    return true;
                                } else if ($('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-checked')) {
                                    return false;
                                }
                            } else if (value !== parameter.value) {
                                if (value === '' && $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-checked')) {
                                    return false;
                                } else if (value !== '') {
                                    return false;
                                } else if (value === '' && $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-unchecked')) {
                                    return true;
                                }
                            }

                            if (description !== parameter.description) {
                                return false;
                            }

                            return true;
                        },
                        handler: {
                            click: function () {
                                updateParameter();
                            }
                        }
                    }, {
                        buttonText: 'Cancel',
                        color: {
                            base: '#E3E8EB',
                            hover: '#C7D2D7',
                            text: '#004849'
                        },
                        handler: {
                            click: function () {
                                $(this).modal('hide');
                            }
                        }
                    }]).modal('show');

                    $('#parameter-name').val(parameter.name);
                    $('#parameter-name').prop('disabled', true);
                    $('#parameter-sensitive-radio-button').prop('disabled', true);
                    $('#parameter-not-sensitive-radio-button').prop('disabled', true);
                    if (parameter.value === '') {
                        $('#parameter-dialog').find('.nf-checkbox').removeClass('checkbox-unchecked').addClass('checkbox-checked');
                    } else {
                        $('#parameter-dialog').find('.nf-checkbox').removeClass('checkbox-checked').addClass('checkbox-unchecked');
                    }

                    if (parameter.sensitive) {
                        $('#parameter-sensitive-radio-button').prop('checked', true);
                        $('#parameter-not-sensitive-radio-button').prop('checked', false);
                    } else {
                        $('#parameter-sensitive-radio-button').prop('checked', false);
                        $('#parameter-not-sensitive-radio-button').prop('checked', true);
                        $('#parameter-value-field').val(parameter.value);
                    }
                    $('#parameter-description-field').val(parameter.description);

                    // prevents standard edit logic
                    e.stopImmediatePropagation();
                }
            }
        });
        parametersGrid.onSelectedRowsChanged.subscribe(function (e, args) {
            if ($.isArray(args.rows) && args.rows.length === 1) {
                // show the affected components for the selected parameter
                if (parametersGrid.getDataLength() > 0) {
                    var parameterIndex = args.rows[0];
                    var parameter = parametersGrid.getDataItem(parameterIndex);

                    // only populate affected components if this parameter is different than the last selected
                    if (lastSelectedId === null || lastSelectedId !== parameter.id) {
                        // update the details for this parameter
                        $('#parameter-affected-components-context').removeClass('unset').text(parameter.name);
                        populateAffectedComponents(parameter.affectedComponents);

                        // update the last selected id
                        lastSelectedId = parameter.id;
                    }
                }
            }
        });
        parametersGrid.onBeforeCellEditorDestroy.subscribe(function (e, args) {
            setTimeout(function () {
                parametersGrid.resizeCanvas();
            }, 50);
        });

        // wire up the dataview to the grid
        parameterData.onRowCountChanged.subscribe(function (e, args) {
            parametersGrid.updateRowCount();
            parametersGrid.render();
        });
        parameterData.onRowsChanged.subscribe(function (e, args) {
            parametersGrid.invalidateRows(args.rows);
            parametersGrid.render();
        });
        parameterData.syncGridSelection(parametersGrid, true);

        // hold onto an instance of the grid
        parameterTable.data('gridInstance', parametersGrid);
    };

    /**
     * Initializes the new parameter context dialog.
     */
    var initNewParameterContextDialog = function () {
        // initialize the parameter context tabs
        $('#parameter-context-tabs').tabbs({
            tabStyle: 'tab',
            selectedTabStyle: 'selected-tab',
            scrollableTabContentStyle: 'scrollable',
            tabs: [{
                name: 'Settings',
                tabContentId: 'parameter-context-standard-settings-tab-content'
            }, {
                name: 'Parameters',
                tabContentId: 'parameter-context-parameters-tab-content'
            }],
            select: function () {
                // update the parameters table size in case this is the first time its rendered
                if ($(this).text() === 'Parameters') {
                    var parameterGrid = $('#parameter-table').data('gridInstance');
                    if (nfCommon.isDefinedAndNotNull(parameterGrid)) {
                        parameterGrid.resizeCanvas();
                    }
                }
            }
        });

        // initialize the parameter context dialog
        $('#parameter-context-dialog').modal({
            scrollableContentStyle: 'scrollable',
            handler: {
                close: function () {
                    resetDialog();
                }
            }
        });

        $('#parameter-dialog').modal({
            handler: {
                close: function () {
                    $('#parameter-name').val('');
                    $('#parameter-value-field').val('');
                    $('#parameter-description-field').val('');
                    $('#parameter-sensitive-radio-button').prop('checked', false);
                    $('#parameter-not-sensitive-radio-button').prop('checked', false);
                    $('#parameter-name').prop('disabled', false);
                    $('#parameter-sensitive-radio-button').prop('disabled', false);
                    $('#parameter-not-sensitive-radio-button').prop('disabled', false);
                    $('#parameter-dialog').find('.nf-checkbox').removeClass('checkbox-checked').addClass('checkbox-unchecked');
                },
                open: function () {
                    $('#parameter-sensitive-radio-button').prop('checked', false);
                    $('#parameter-not-sensitive-radio-button').prop('checked', true);
                    $('#parameter-name').focus();
                }
            }
        });

        $('#parameter-name').on('keydown', function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if (code === $.ui.keyCode.ENTER) {
                addNewParameter();

                // prevents the enter from propagating into the field for editing the new property value
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });

        $('#add-parameter').on('click', function () {
            $('#parameter-dialog').modal('setHeaderText', 'Add Parameter').modal('setButtonModel', [{
                buttonText: 'Apply',
                color: {
                    base: '#728E9B',
                    hover: '#004849',
                    text: '#ffffff'
                },
                disabled: function () {
                    if (($('#parameter-name').val() !== '' && $('#parameter-value-field').val() !== '') || ($('#parameter-name').val() !== '' && $('#parameter-dialog').find('.nf-checkbox').hasClass('checkbox-checked'))) {
                        return false;
                    }
                    return true;
                },
                handler: {
                    click: function () {
                        addNewParameter();
                    }
                }
            }, {
                buttonText: 'Cancel',
                color: {
                    base: '#E3E8EB',
                    hover: '#C7D2D7',
                    text: '#004849'
                },
                handler: {
                    click: function () {
                        $(this).modal('hide');
                    }
                }
            }]).modal('show');
            $('#parameter-dialog').modal('show');
        });

        $('#parameter-context-name').on('keyup', function (evt) {
            // update the buttons to possibly trigger the disabled state
            $('#parameter-context-dialog').modal('refreshButtons');
        });

        $('#parameter-name').on('keyup', function (evt) {
            // update the buttons to possibly trigger the disabled state
            $('#parameter-dialog').modal('refreshButtons');
        });

        $('#parameter-value-field').on('keyup', function (evt) {
            // update the buttons to possibly trigger the disabled state
            $('#parameter-dialog').modal('refreshButtons');
        });

        $('#parameter-description-field').on('keyup', function (evt) {
            // update the buttons to possibly trigger the disabled state
            $('#parameter-dialog').modal('refreshButtons');
        });

        $('#parameter-dialog').find('.nf-checkbox').on('change', function (evt) {
            // update the buttons to possibly trigger the disabled state
            $('#parameter-dialog').modal('refreshButtons');
        });

        initParameterTable();
    };

    /**
     * Loads the parameter contexts.
     */
    var loadParameterContexts = function () {
        var parameterContexts = $.Deferred(function (deferred) {
            $.ajax({
                type: 'GET',
                url: config.urls.parameterContexts,
                dataType: 'json'
            }).done(function (response) {
                deferred.resolve(response);
            }).fail(function (xhr, status, error) {
                deferred.reject(xhr, status, error);
            });
        }).promise();

        // return a deferred for all parts of the parameter contexts
        return $.when(parameterContexts).done(function (response) {
            $('#parameter-contexts-last-refreshed').text(response.currentTime);
        }).fail(nfErrorHandler.handleAjaxError);
    };

    /**
     * Reset state of this dialog.
     */
    var reset = function () {
        // adjust the table size
        nfParameterContexts.resetTableSize();
    };

    /**
     * Shows the parameter contexts.
     */
    var showParameterContexts = function (response) {
        // show the parameter contexts dialog
        nfShell.showContent('#parameter-contexts').done(function () {
            reset();
        });

        initParameterContexts(response);
    };

    /**
     * Initializes the parameter contexts.
     */
    var initParameterContexts = function (response) {
        var parameterContextActionFormatter = function (row, cell, value, columnDef, dataContext) {
            var markup = '';

            var canWrite = dataContext.permissions.canWrite;
            var canRead = dataContext.permissions.canRead;

            if (canRead && canWrite) {
                markup += '<div title="Edit" class="pointer edit-parameter-context fa fa-pencil"></div>';
            }

            if (canRead && canWrite && nfCommon.canModifyParameterContexts()) {
                markup += '<div title="Remove" class="pointer delete-parameter-context fa fa-trash"></div>';
            }

            // allow policy configuration conditionally
            if (nfCanvasUtils.isManagedAuthorizer() && nfCommon.canAccessTenants()) {
                markup += '<div title="Access Policies" class="pointer edit-access-policies fa fa-key"></div>';
            }

            return markup;
        };

        var descriptionFormatter = function (row, cell, value, columnDef, dataContext) {
            if (!dataContext.permissions.canRead) {
                return '<span class="blank">' + nfCommon.escapeHtml(dataContext.id) + '</span>';
            }

            return nfCommon.escapeHtml(dataContext.component.description);
        };

        // define the column model for the parameter contexts table
        var parameterContextsColumnModel = [
            {
                id: 'name',
                name: 'Name',
                sortable: true,
                resizable: true,
                formatter: nameFormatter
            },
            {
                id: 'description',
                name: 'Description',
                sortable: true,
                resizable: true,
                formatter: descriptionFormatter
            }
        ];

        // action column should always be last
        parameterContextsColumnModel.push({
            id: 'actions',
            name: '&nbsp;',
            resizable: false,
            formatter: parameterContextActionFormatter,
            sortable: false,
            width: 90,
            maxWidth: 90
        });

        // initialize the dataview
        var parameterContextsData = new Slick.Data.DataView({
            inlineFilters: false
        });

        parameterContextsData.setItems([]);

        // initialize the sort
        sort({
            columnId: 'name',
            sortAsc: true
        }, parameterContextsData);

        // initialize the grid
        var parameterContextsGrid = new Slick.Grid('#parameter-contexts-table', parameterContextsData, parameterContextsColumnModel, parameterContextsGridOptions);
        parameterContextsGrid.setSelectionModel(new Slick.RowSelectionModel());
        parameterContextsGrid.registerPlugin(new Slick.AutoTooltips());
        parameterContextsGrid.setSortColumn('name', true);
        parameterContextsGrid.onSort.subscribe(function (e, args) {
            sort({
                columnId: args.sortCol.id,
                sortAsc: args.sortAsc
            }, parameterContextsData);
        });

        // configure a click listener
        parameterContextsGrid.onClick.subscribe(function (e, args) {
            var target = $(e.target);

            // get the context at this row
            var parameterContextEntity = parameterContextsData.getItem(args.row);

            // determine the desired action
            if (parameterContextsGrid.getColumns()[args.cell].id === 'actions') {
                if (target.hasClass('edit-parameter-context')) {
                    nfParameterContexts.showParameterContext(parameterContextEntity);
                } else if (target.hasClass('delete-parameter-context')) {
                    nfParameterContexts.promptToDeleteParameterContext(parameterContextEntity);
                } else if (target.hasClass('edit-access-policies')) {
                    // TODO: show the policies for this service
                    nfPolicyManagement.showParameterContextPolicy(parameterContextEntity);

                    // close the settings dialog
                    $('#shell-close-button').click();
                }
            }
        });

        // wire up the dataview to the grid
        parameterContextsData.onRowCountChanged.subscribe(function (e, args) {
            parameterContextsGrid.updateRowCount();
            parameterContextsGrid.render();
        });
        parameterContextsData.onRowsChanged.subscribe(function (e, args) {
            parameterContextsGrid.invalidateRows(args.rows);
            parameterContextsGrid.render();
        });
        parameterContextsData.syncGridSelection(parameterContextsGrid, true);

        // hold onto an instance of the grid
        $('#parameter-contexts-table').data('gridInstance', parameterContextsGrid).on('mouseenter', 'div.slick-cell', function (e) {
            var errorIcon = $(this).find('div.has-errors');
            if (errorIcon.length && !errorIcon.data('qtip')) {
                var contextId = $(this).find('span.row-id').text();

                // get the task item
                var parameterContextEntity = parameterContextsData.getItemById(contextId);

                // format the errors
                var tooltip = nfCommon.formatUnorderedList(parameterContextEntity.component.validationErrors);

                // show the tooltip
                if (nfCommon.isDefinedAndNotNull(tooltip)) {
                    errorIcon.qtip($.extend({},
                        nfCommon.config.tooltipConfig,
                        {
                            content: tooltip,
                            position: {
                                target: 'mouse',
                                viewport: $('#shell-container'),
                                adjust: {
                                    x: 8,
                                    y: 8,
                                    method: 'flipinvert flipinvert'
                                }
                            }
                        }));
                }
            }
        });

        // get parameter contexts
        return $.ajax({
            type: 'GET',
            url: config.urls.parameterContexts,
            dataType: 'json'
        }).done(function (response) {
            var contexts = [];
            $.each(response.parameterContexts, function (_, parameterContext) {
                contexts.push($.extend({
                    type: 'ParameterContext'
                }, parameterContext));
            });

            // update the parameter contexts
            parameterContextsData.setItems(contexts);
            parameterContextsData.reSort();
            parameterContextsGrid.invalidate();
        }).fail(nfErrorHandler.handleAjaxError);
    };

    var nfParameterContexts = {
        /**
         * Initializes the parameter contexts page.
         */
        init: function () {
            // parameter context refresh button
            $('#parameter-contexts-refresh-button').click(function () {
                loadParameterContexts();
            });

            // create a new parameter context
            $('#new-parameter-context').on('click', function () {
                $('#parameter-context-dialog').modal('setHeaderText', 'Add Parameter Context').modal('setButtonModel', [{
                    buttonText: 'Apply',
                    color: {
                        base: '#728E9B',
                        hover: '#004849',
                        text: '#ffffff'
                    },
                    disabled: function () {
                        if ($('#parameter-context-name').val() !== '') {
                            return false;
                        }
                        return true;
                    },
                    handler: {
                        click: function () {
                            nfParameterContexts.addParameterContext();
                        }
                    }
                }, {
                    buttonText: 'Cancel',
                    color: {
                        base: '#E3E8EB',
                        hover: '#C7D2D7',
                        text: '#004849'
                    },
                    handler: {
                        click: function () {
                            $(this).modal('hide');
                        }
                    }
                }]).modal('show');

                // set the initial focus
                $('#parameter-context-name').focus();
            });

            // initialize the new parameter context dialog
            initNewParameterContextDialog();
        },

        /**
         * Adds a new parameter context.
         *
         * @param {object} parameterContextCreatedDeferred          The parameter context created callback.
         */
        addParameterContext: function (parameterContextCreatedDeferred) {
            // build the parameter context entity
            var parameterContextEntity = {
                "component": {
                    "name": $('#parameter-context-name').val(),
                    "description": $('#parameter-context-description-field').val(),
                    "parameters": marshalParameters()
                },
                'revision': nfClient.getRevision({
                    'revision': {
                        'version': 0
                    }
                })
            };

            var addContext = $.ajax({
                type: 'POST',
                url: config.urls.parameterContexts,
                data: JSON.stringify(parameterContextEntity),
                dataType: 'json',
                contentType: 'application/json'
            }).done(function (parameterContextEntity) {
                // add the item
                var parameterContextGrid = $('#parameter-contexts-table').data('gridInstance');

                if (nfCommon.isDefinedAndNotNull(parameterContextGrid)) {
                    var parameterContextData = parameterContextGrid.getData();
                    parameterContextData.addItem(parameterContextEntity);

                    // resort
                    parameterContextData.reSort();
                    parameterContextGrid.invalidate();

                    // select the new parameter context
                    var row = parameterContextData.getRowById(parameterContextEntity.id);
                    nfFilteredDialogCommon.choseRow(parameterContextGrid, row);
                    parameterContextGrid.scrollRowIntoView(row);
                }

                // invoke callback if necessary
                if (typeof parameterContextCreatedDeferred === 'function') {
                    parameterContextCreatedDeferred(parameterContextEntity);
                }
            }).fail(nfErrorHandler.handleAjaxError);

            // hide the dialog
            $('#parameter-context-dialog').modal('hide');

            return addContext;
        },

        /**
         * Update the size of the grid based on its container's current size.
         */
        resetTableSize: function () {
            var parameterContextsGrid = $('#parameter-contexts-table').data('gridInstance');
            if (nfCommon.isDefinedAndNotNull(parameterContextsGrid)) {
                parameterContextsGrid.resizeCanvas();
            }
        },

        /**
         * Shows the parameter context dialog.
         */
        showParameterContexts: function () {
            // conditionally allow creation of new parameter contexts
            $('#new-parameter-context').prop('disabled', !nfCommon.canModifyParameterContexts());

            // load the parameter contexts
            return loadParameterContexts().done(showParameterContexts);
        },

        /**
         * Loads the parameter context dialogs.
         */
        loadParameterContexts: function () {
            return loadParameterContexts();
        },

        /**
         * Shows the dialog for the specified parameter context.
         *
         * @argument {parameterContext} parameterContextEntity      The parameter context
         */
        showParameterContext: function (parameterContextEntity) {
            parameterCount = 0;

            // reload the parameter context in case the parameters have changed
            var reloadContext = $.ajax({
                type: 'GET',
                url: config.urls.parameterContexts + '/' + encodeURIComponent(parameterContextEntity.id),
                dataType: 'json'
            });

            // once everything is loaded, show the dialog
            reloadContext.done(function (parameterContextEntity) {
                $('#parameter-context-name').val(parameterContextEntity.component.name);
                $('#parameter-context-description-field').val(parameterContextEntity.component.description);

                loadParameters(parameterContextEntity);

                // show the context
                $('#parameter-context-dialog').modal('setHeaderText', 'Update Parameter Context').modal('setButtonModel', [{
                    buttonText: 'Apply',
                    color: {
                        base: '#728E9B',
                        hover: '#004849',
                        text: '#ffffff'
                    },
                    disabled: function () {
                        if ($('#parameter-context-name').val() !== '') {
                            return false;
                        }
                        return true;
                    },
                    handler: {
                        click: function () {
                            updateParameterContexts(parameterContextEntity);
                        }
                    }
                }, {
                    buttonText: 'Cancel',
                    color: {
                        base: '#E3E8EB',
                        hover: '#C7D2D7',
                        text: '#004849'
                    },
                    handler: {
                        click: function () {
                            $(this).modal('hide');
                        }
                    }
                }]).modal('show');

                // select the parameters tab
                $('#parameter-context-tabs').find('li:last').click();
            }).fail(nfErrorHandler.handleAjaxError);
        },

        /**
         * Prompts the user before attempting to delete the specified parameter context.
         *
         * @param {object} parameterContextEntity
         */
        promptToDeleteParameterContext: function (parameterContextEntity) {
            // prompt for deletion
            nfDialog.showYesNoDialog({
                headerText: 'Delete Parameter Context',
                dialogContent: 'Delete parameter context \'' + nfCommon.escapeHtml(parameterContextEntity.component.name) + '\'?',
                yesHandler: function () {
                    nfParameterContexts.remove(parameterContextEntity);
                }
            });
        },

        /**
         * Deletes the specified parameter context.
         *
         * @param {object} parameterContextEntity
         */
        remove: function (parameterContextEntity) {
            $.ajax({
                type: 'DELETE',
                url: config.urls.parameterContexts + '/' + encodeURIComponent(parameterContextEntity.id) + '?' + $.param({
                    'disconnectedNodeAcknowledged': nfStorage.isDisconnectionAcknowledged(),
                    'clientId': parameterContextEntity.revision.clientId,
                    'version': parameterContextEntity.revision.version
                }),
                dataType: 'json'
            }).done(function (response) {
                // remove the parameter context
                var parameterContextGrid = $('#parameter-contexts-table').data('gridInstance');
                var parameterContextData = parameterContextGrid.getData();
                parameterContextData.deleteItem(parameterContextEntity.id);
            }).fail(nfErrorHandler.handleAjaxError);
        }
    };

    return nfParameterContexts;
}));
