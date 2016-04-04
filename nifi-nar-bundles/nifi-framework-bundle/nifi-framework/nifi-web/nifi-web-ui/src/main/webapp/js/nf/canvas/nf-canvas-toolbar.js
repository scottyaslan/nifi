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

define(['nf-toolbar-action',
        'nf-common',
        'nf-clipboard',
        'nf-canvas-utils'],
    function (nfToolbarAction,
              nfCommon,
              nfClipboard,
              nfCanvasUtils) {

        var actions;

        return {
            /**
             * Initializes the canvas toolbar.
             */
            init: function () {
                actions = {};

                var separator = $('<div/>').addClass('control-separator');
                var border = $('<div/>').addClass('control-border');

                var globalControls = $('#global-controls')[0];
                border.clone().appendTo(globalControls);
                actions['enable'] = new nfToolbarAction(globalControls, 'enable', 'action-enable', 'enable-all', 'enable-all-hover', 'enable-all-disable', 'Enable');
                border.clone().appendTo(globalControls);
                actions['disable'] = new nfToolbarAction(globalControls, 'disable', 'action-disable', 'disable-all', 'disable-all-hover', 'disable-all-disable', 'Disable');
                border.clone().appendTo(globalControls);
                separator.clone().appendTo(globalControls);
                border.clone().appendTo(globalControls);
                actions['start'] = new nfToolbarAction(globalControls, 'start', 'action-start', 'start-all', 'start-all-hover', 'start-all-disable', 'Start');
                border.clone().appendTo(globalControls);
                actions['stop'] = new nfToolbarAction(globalControls, 'stop', 'action-stop', 'stop-all', 'stop-all-hover', 'stop-all-disable', 'Stop');
                border.clone().appendTo(globalControls);
                separator.clone().appendTo(globalControls);
                border.clone().appendTo(globalControls);
                actions['template'] = new nfToolbarAction(globalControls, 'template', 'action-template', 'template', 'template-hover', 'template-disable', 'Create Template');
                border.clone().appendTo(globalControls);
                separator.clone().appendTo(globalControls);
                border.clone().addClass('secondary').appendTo(globalControls);
                actions['copy'] = new nfToolbarAction(globalControls, 'copy', 'action-copy', 'copy', 'copy-hover', 'copy-disable', 'Copy', true);
                border.clone().addClass('secondary').appendTo(globalControls);
                actions['paste'] = new nfToolbarAction(globalControls, 'paste', 'action-paste', 'paste', 'paste-hover', 'paste-disable', 'Paste', true);
                border.clone().addClass('secondary').appendTo(globalControls);
                separator.clone().addClass('secondary').appendTo(globalControls);
                border.clone().addClass('secondary').appendTo(globalControls);
                actions['group'] = new nfToolbarAction(globalControls, 'group', 'action-group', 'group', 'group-hover', 'group-disable', 'Group', true);
                border.clone().addClass('secondary').appendTo(globalControls);
                separator.clone().addClass('secondary').appendTo(globalControls);
                border.clone().addClass('secondary').appendTo(globalControls);
                actions['fill'] = new nfToolbarAction(globalControls, 'fillColor', 'action-fill', 'fill', 'fill-hover', 'fill-disable', 'Change Color', true);
                border.clone().addClass('secondary').appendTo(globalControls);
                separator.clone().addClass('secondary').appendTo(globalControls);
                border.clone().addClass('secondary').appendTo(globalControls);
                actions['delete'] = new nfToolbarAction(globalControls, 'delete', 'action-delete', 'delete', 'delete-hover', 'delete-disable', 'Delete', true);
                border.addClass('secondary').appendTo(globalControls);
                separator.addClass('secondary').appendTo(globalControls);

                // set up initial states for selection-less items
                if (nfCommon.isDFM()) {
                    actions['start'].enable();
                    actions['stop'].enable();
                    actions['template'].enable();
                } else {
                    actions['start'].disable();
                    actions['stop'].disable();
                    actions['template'].disable();
                }

                // disable actions that require selection
                actions['enable'].disable();
                actions['disable'].disable();
                actions['copy'].disable();
                actions['paste'].disable();
                actions['fill'].disable();
                actions['delete'].disable();
                actions['group'].disable();

                // add a clipboard listener if appropriate
                if (nfCommon.isDFM()) {
                    nfClipboard.addListener(this, function (action, data) {
                        if (nfClipboard.isCopied()) {
                            actions['paste'].enable();
                        } else {
                            actions['paste'].disable();
                        }
                    });
                }
            },

            /**
             * Called when the selection changes to update the toolbar appropriately.
             */
            refresh: function () {
                // wait for the toolbar to initialize
                if (nfCommon.isUndefined(actions)) {
                    return;
                }

                // only refresh the toolbar if DFM
                if (nfCommon.isDFM()) {
                    var selection = nfCanvasUtils.getSelection();

                    // if all selected components are deletable enable the delete button
                    if (!selection.empty()) {
                        var enableDelete = true;
                        selection.each(function (d) {
                            if (!nfCanvasUtils.isDeletable(d3.select(this))) {
                                enableDelete = false;
                                return false;
                            }
                        });
                        if (enableDelete) {
                            actions['delete'].enable();
                        } else {
                            actions['delete'].disable();
                        }
                    } else {
                        actions['delete'].disable();
                    }

                    // if there are any copyable components enable the button
                    if (nfCanvasUtils.isCopyable(selection)) {
                        actions['copy'].enable();
                    } else {
                        actions['copy'].disable();
                    }

                    // determine if the selection is groupable
                    if (!selection.empty() && nfCanvasUtils.isDisconnected(selection)) {
                        actions['group'].enable();
                    } else {
                        actions['group'].disable();
                    }

                    // if there are any colorable components enable the fill button
                    if (nfCanvasUtils.isColorable(selection)) {
                        actions['fill'].enable();
                    } else {
                        actions['fill'].disable();
                    }

                    // ensure the selection supports enable
                    if (nfCanvasUtils.canEnable(selection)) {
                        actions['enable'].enable();
                    } else {
                        actions['enable'].disable();
                    }

                    // ensure the selection supports disable
                    if (nfCanvasUtils.canDisable(selection)) {
                        actions['disable'].enable();
                    } else {
                        actions['disable'].disable();
                    }
                }
            }
        };
    });