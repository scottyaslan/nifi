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
        'nf-universal-capture',
        'nf-custom-ui',
        'nf-dialog'],
    function (nfCommon,
              nfUniversalCapture,
              nfCustomUi,
              nfDialog) {

    /**
     * Creates an option for the specified relationship name.
     * 
     * @argument {object} relationship      The relationship
     */
    var createRelationshipOption = function (relationship) {
        var relationshipLabel = $('<div class="relationship-name ellipsis"></div>').text(relationship.name);

        // build the relationship checkbox element
        if (relationship.autoTerminate === true) {
            relationshipLabel.css('font-weight', 'bold');
        }

        // build the relationship container element
        var relationshipContainerElement = $('<div class="processor-relationship-container"></div>').append(relationshipLabel).appendTo('#read-only-auto-terminate-relationship-names');
        if (!nfCommon.isBlank(relationship.description)) {
            var relationshipDescription = $('<div class="relationship-description"></div>').text(relationship.description);
            relationshipContainerElement.append(relationshipDescription);
        }

        return relationshipContainerElement;
    };

    return {
        /**
         * Initializes the processor details dialog.
         * 
         * @param {boolean} overlayBackground       Whether to overlay the background
         */
        init: function (overlayBackground) {
            overlayBackground = nfCommon.isDefinedAndNotNull(overlayBackground) ? overlayBackground : true;

            // initialize the properties tabs
            $('#processor-details-tabs').tabbs({
                tabStyle: 'tab',
                selectedTabStyle: 'selected-tab',
                tabs: [{
                        name: 'Settings',
                        tabContentId: 'details-standard-settings-tab-content'
                    }, {
                        name: 'Scheduling',
                        tabContentId: 'details-scheduling-tab-content'
                    }, {
                        name: 'Properties',
                        tabContentId: 'details-processor-properties-tab-content'
                    }, {
                        name: 'Comments',
                        tabContentId: 'details-processor-comments-tab-content'
                    }],
                select: function () {
                    // remove all property detail dialogs
                    nfUniversalCapture.removeAllPropertyDetailDialogs();
                    
                    // resize the property grid in case this is the first time its rendered
                    if ($(this).text() === 'Properties') {
                        $('#read-only-processor-properties').propertytable('resetTableSize');
                    }

                    // show the border if processor relationship names if necessary
                    var processorRelationships = $('#read-only-auto-terminate-relationship-names');
                    if (processorRelationships.is(':visible') && processorRelationships.get(0).scrollHeight > processorRelationships.innerHeight()) {
                        processorRelationships.css('border-width', '1px');
                    }
                }
            });

            // configure the processor details dialog
            $('#processor-details').modal({
                headerText: 'Processor Details',
                overlayBackground: overlayBackground,
                handler: {
                    close: function () {
                        // empty the relationship list
                        $('#read-only-auto-terminate-relationship-names').css('border-width', '0').empty();

                        // clear the property grid
                        $('#read-only-processor-properties').propertytable('clear');
            
                        // clear the processor details
                        nfCommon.clearField('read-only-processor-id');
                        nfCommon.clearField('read-only-processor-type');
                        nfCommon.clearField('read-only-processor-name');
                        nfCommon.clearField('read-only-concurrently-schedulable-tasks');
                        nfCommon.clearField('read-only-scheduling-period');
                        nfCommon.clearField('read-only-penalty-duration');
                        nfCommon.clearField('read-only-yield-duration');
                        nfCommon.clearField('read-only-run-duration');
                        nfCommon.clearField('read-only-bulletin-level');
                        nfCommon.clearField('read-only-execution-status');
                        nfCommon.clearField('read-only-processor-comments');

                        // removed the cached processor details
                        $('#processor-details').removeData('processorDetails');
                        $('#processor-details').removeData('processorHistory');
                    }
                }
            });
            
            if (overlayBackground) {
                $('#processor-details').draggable({
                    containment: 'parent',
                    handle: '.dialog-header'
                });
            }

            // initialize the properties
            $('#read-only-processor-properties').propertytable({
                readOnly: true
            });
        },
        
        /**
         * Shows the details for the specified processor.
         * 
         * @argument {string} groupId       The group id
         * @argument {string} processorId   The processor id
         */
        showDetails: function (groupId, processorId) {
            // load the properties for the specified processor
            var getProcessor = $.ajax({
                type: 'GET',
                url: '../nifi-api/controller/process-groups/' + encodeURIComponent(groupId) + '/processors/' + encodeURIComponent(processorId),
                dataType: 'json'
            }).done(function (response) {
                if (nfCommon.isDefinedAndNotNull(response.processor)) {
                    // get the processor details
                    var details = response.processor;

                    // record the processor details
                    $('#processor-details').data('processorDetails', details);

                    // populate the processor settings
                    nfCommon.populateField('read-only-processor-id', details['id']);
                    nfCommon.populateField('read-only-processor-type', nfCommon.substringAfterLast(details['type'], '.'));
                    nfCommon.populateField('read-only-processor-name', details['name']);
                    nfCommon.populateField('read-only-concurrently-schedulable-tasks', details.config['concurrentlySchedulableTaskCount']);
                    nfCommon.populateField('read-only-scheduling-period', details.config['schedulingPeriod']);
                    nfCommon.populateField('read-only-penalty-duration', details.config['penaltyDuration']);
                    nfCommon.populateField('read-only-yield-duration', details.config['yieldDuration']);
                    nfCommon.populateField('read-only-run-duration', nfCommon.formatDuration(details.config['runDurationMillis']));
                    nfCommon.populateField('read-only-bulletin-level', details.config['bulletinLevel']);
                    nfCommon.populateField('read-only-processor-comments', details.config['comments']);

                    var showRunSchedule = true;

                    // make the scheduling strategy human readable
                    var schedulingStrategy = details.config['schedulingStrategy'];
                    if (schedulingStrategy === 'EVENT_DRIVEN') {
                        showRunSchedule = false;
                        schedulingStrategy = 'Event driven';
                    } else if (schedulingStrategy === 'CRON_DRIVEN') {
                        schedulingStrategy = 'CRON driven';
                    } else if (schedulingStrategy === 'TIMER_DRIVEN') {
                        schedulingStrategy = "Timer driven";
                    } else {
                        schedulingStrategy = "On primary node";
                    }
                    nfCommon.populateField('read-only-scheduling-strategy', schedulingStrategy);

                    // only show the run schedule when applicable
                    if (showRunSchedule === true) {
                        $('#read-only-run-schedule').show();
                    } else {
                        $('#read-only-run-schedule').hide();
                    }

                    // load the relationship list
                    if (!nfCommon.isEmpty(details.relationships)) {
                        $.each(details.relationships, function (i, relationship) {
                            createRelationshipOption(relationship);
                        });
                    } else {
                        $('#read-only-auto-terminate-relationship-names').append('<div class="unset">This processor has no relationships.</div>');
                    }
                }
            });

            // get the processor history
            var getProcessorHistory = $.ajax({
                type: 'GET',
                url: '../nifi-api/controller/history/processors/' + encodeURIComponent(processorId),
                dataType: 'json'
            }).done(function (response) {
                var processorHistory = response.componentHistory;

                // record the processor history
                $('#processor-details').data('processorHistory', processorHistory);
            });

            // show the dialog once we have the processor and its history
            $.when(getProcessor, getProcessorHistory).done(function (processorResponse, historyResponse) {
                var processorResponse = processorResponse[0];
                var processor = processorResponse.processor;
                var historyResponse = historyResponse[0];
                var history = historyResponse.componentHistory;

                // load the properties
                $('#read-only-processor-properties').propertytable('loadProperties', processor.config.properties, processor.config.descriptors, history.propertyHistory);

                var buttons = [{
                        buttonText: 'Ok',
                        handler: {
                            click: function () {
                                // hide the dialog
                                $('#processor-details').modal('hide');
                            }
                        }
                    }];

                // determine if we should show the advanced button
                if (nfCommon.isDefinedAndNotNull(nfCustomUi) && nfCommon.isDefinedAndNotNull(processor.config.customUiUrl) && processor.config.customUiUrl !== '') {
                    buttons.push({
                        buttonText: 'Advanced',
                        handler: {
                            click: function () {
                                // reset state and close the dialog manually to avoid hiding the faded background
                                $('#processor-details').modal('hide');

                                // show the custom ui
                                nfCustomUi.showCustomUi(processor.id, processor.config.customUiUrl, false);
                            }
                        }
                    });
                }

                // show the dialog
                $('#processor-details').modal('setButtonModel', buttons).modal('show');

                // add ellipsis if necessary
                $('#processor-details div.relationship-name').ellipsis();

                // show the border if necessary
                var processorRelationships = $('#read-only-auto-terminate-relationship-names');
                if (processorRelationships.is(':visible') && processorRelationships.get(0).scrollHeight > processorRelationships.innerHeight()) {
                    processorRelationships.css('border-width', '1px');
                }
            }).fail(function (xhr, status, error) {
                if (xhr.status === 400 || xhr.status === 404 || xhr.status === 409) {
                    nfDialog.showOkDialog({
                        dialogContent: nfCommon.escapeHtml(xhr.responseText),
                        overlayBackground: false
                    });
                } else {
                    nfCommon.handleAjaxError(xhr, status, error);
                }
            });
        }
    };
});