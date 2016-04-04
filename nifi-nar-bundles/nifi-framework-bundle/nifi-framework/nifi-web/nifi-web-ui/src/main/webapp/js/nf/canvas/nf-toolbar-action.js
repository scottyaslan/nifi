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

/**
 * Creates a new toolbar action.
 *
 * @argument {jQuery} container         The container to add the action to
 * @argument {string} action            The action to perform
 * @argument {string} id                The id of the element for the action
 * @argument {string} cls               The css class for the element
 * @argument {string} hoverCls          The css class for the hover state of the element
 * @argument {string} disableCls        The css class for the disabled state of the element
 * @argument {string} title             The title (tooltip) of the element
 * @argument {boolean} secondary        If secondary icon will be hidden as the screen gets smallers
 */

define(['nf-context-menu',
        'nf-actions',
        'nf-canvas-utils'],
    function(nfContextMenu,
             nfActions,
             nfCanvasUtils) {
        /**
         * Creates a new toolbar action.
         *
         * @argument {jQuery} container         The container to add the action to
         * @argument {string} action            The action to perform
         * @argument {string} id                The id of the element for the action
         * @argument {string} cls               The css class for the element
         * @argument {string} hoverCls          The css class for the hover state of the element
         * @argument {string} disableCls        The css class for the disabled state of the element
         * @argument {string} title             The title (tooltip) of the element
         * @argument {boolean} secondary        If secondary icon will be hidden as the screen gets smallers
         */
        nfToolbarAction = function (container, action, id, cls, hoverCls, disableCls, title, secondary) {
            this.container = container;
            this.action = action;
            this.id = id;
            this.cls = cls;
            this.hoverCls = hoverCls;
            this.disableCls = disableCls;
            this.title = title;
            this.secondary = secondary;
            this.initAction();
        };

        nfToolbarAction.prototype.container = null;
        nfToolbarAction.prototype.action = null;
        nfToolbarAction.prototype.id = null;
        nfToolbarAction.prototype.cls = null;
        nfToolbarAction.prototype.hoverCls = null;
        nfToolbarAction.prototype.disableCls = null;
        nfToolbarAction.prototype.title = null;
        nfToolbarAction.prototype.secondary = null;

        /**
         * Initializes the toolbar action by dynamically creating an element,
         * registering mouse listeners, and inserting it into the DOM.
         */
        nfToolbarAction.prototype.initAction = function () {
            var self = this;
            var cls = 'toolbar-icon';
            if (this.secondary === true) {
                cls += ' secondary';
            }

            // create the default button
            $('<div/>').addClass(cls).attr('id', this.id).attr('title', this.title).mouseover(function () {
                if (!$(this).hasClass(self.disableCls)) {
                    $(this).removeClass(self.cls).addClass(self.hoverCls);
                }
            }).mouseout(function () {
                if (!$(this).hasClass(self.disableCls)) {
                    $(this).addClass(self.cls).removeClass(self.hoverCls);
                }
            }).click(function () {
                if (!$(this).hasClass(self.disableCls)) {
                    // hide the context menu
                    nfContextMenu.hide();

                    // execute the action
                    nfActions[self.action](nfCanvasUtils.getSelection());
                }
            }).appendTo(this.container);
        };

        /**
         * Enables the toolbar action.
         */
        nfToolbarAction.prototype.enable = function () {
            $('#' + this.id).removeClass(this.disableCls).addClass(this.cls).addClass('pointer');
        };

        /**
         * Disables the toolbar action.
         */
        nfToolbarAction.prototype.disable = function () {
            $('#' + this.id).removeClass(this.cls).addClass(this.disableCls).removeClass('pointer');
        };

        return nfToolbarAction;
    }
);