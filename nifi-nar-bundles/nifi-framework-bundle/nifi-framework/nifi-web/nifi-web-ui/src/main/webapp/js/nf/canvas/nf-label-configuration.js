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

define(['nf-client',
        'nf-label',
        'nf-common',
        'nf-canvas-utils'],
    function (nfClient,
              nfLabel,
              nfCommon,
              nfCanvasUtils) {

    var labelUri = '';

    return {
        /**
         * Initializes the label details dialog.
         */
        init: function () {
            // make the new property dialog draggable
            $('#label-configuration').modal({
                overlayBackground: true,
                buttons: [{
                    buttonText: 'Apply',
                    handler: {
                        click: function () {
                            var revision = nfClient.getRevision();

                            // get the new values
                            var labelValue = $('#label-value').val();
                            var fontSize = $('#label-font-size').combo('getSelectedOption');

                            // save the new label value
                            $.ajax({
                                type: 'PUT',
                                url: labelUri,
                                data: {
                                    'version': revision.version,
                                    'clientId': revision.clientId,
                                    'label': labelValue,
                                    'style[font-size]': fontSize.value
                                },
                                dataType: 'json'
                            }).done(function (response) {
                                // update the revision
                                nfClient.setRevision(response.revision);

                                // get the label out of the response
                                nfLabel.set(response.label);
                            }).fail(nfCommon.handleAjaxError);

                            // reset and hide the dialog
                            this.modal('hide');
                        }
                    }
                }, {
                    buttonText: 'Cancel',
                    handler: {
                        click: function () {
                            this.modal('hide');
                        }
                    }
                }],
                handler: {
                    close: function () {
                        labelUri = '';
                    }
                }
            }).draggable({
                containment: 'parent',
                cancel: 'textarea, .button, .combo'
            });

            // create the available sizes
            var sizes = [];
            for (var i = 12; i <= 24; i += 2) {
                sizes.push({
                    text: i + 'px',
                    value: i + 'px'
                });
            }

            // initialize the font size combo
            $('#label-font-size').combo({
                options: sizes,
                selectedOption: {
                    value: '12px'
                },
                select: function (option) {
                    var labelValue = $('#label-value');

                    // reset the value to trigger IE to update, otherwise the
                    // new line height wasn't being picked up
                    labelValue.css({
                        'font-size': option.value,
                        'line-height': option.value
                    }).val(labelValue.val());
                }
            });
        },
        
        /**
         * Shows the configuration for the specified label.
         * 
         * @argument {selection} selection      The selection
         */
        showConfiguration: function (selection) {
            if (nfCanvasUtils.isLabel(selection)) {
                var selectionData = selection.datum();

                // get the label value
                var labelValue = '';
                if (nfCommon.isDefinedAndNotNull(selectionData.component.label)) {
                    labelValue = selectionData.component.label;
                }

                // get the font size
                var fontSize = '12px';
                if (nfCommon.isDefinedAndNotNull(selectionData.component.style['font-size'])) {
                    fontSize = selectionData.component.style['font-size'];
                }

                // store the label uri
                labelUri = selectionData.component.uri;

                // populate the dialog
                $('#label-value').val(labelValue);
                $('#label-font-size').combo('setSelectedOption', {
                    value: fontSize
                });

                // show the detail dialog
                $('#label-configuration').modal('show');
            }
        }
    };
});