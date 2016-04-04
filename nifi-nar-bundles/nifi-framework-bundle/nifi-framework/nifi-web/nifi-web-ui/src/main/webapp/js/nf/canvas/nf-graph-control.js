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
        'nf-canvas',
        'nf-context-menu'],
    function (nfCommon,
              nfCanvas,
              nfContextMenu) {

    var config = {
        translateIncrement: 20
    };

    return {
        /**
         * Initializes the graph controls.
         */
        init: function () {
            // pan up
            nfCommon.addHoverEffect('#pan-up-button', 'pan-up', 'pan-up-hover').on('click', function () {
                var translate = nfCanvas.View.translate();
                nfCanvas.View.translate([translate[0], translate[1] + config.translateIncrement]);

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // pan down
            nfCommon.addHoverEffect('#pan-down-button', 'pan-down', 'pan-down-hover').on('click', function () {
                var translate = nfCanvas.View.translate();
                nfCanvas.View.translate([translate[0], translate[1] - config.translateIncrement]);

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // pan left
            nfCommon.addHoverEffect('#pan-left-button', 'pan-left', 'pan-left-hover').on('click', function () {
                var translate = nfCanvas.View.translate();
                nfCanvas.View.translate([translate[0] + config.translateIncrement, translate[1]]);

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // pan right
            nfCommon.addHoverEffect('#pan-right-button', 'pan-right', 'pan-right-hover').on('click', function () {
                var translate = nfCanvas.View.translate();
                nfCanvas.View.translate([translate[0] - config.translateIncrement, translate[1]]);

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // zoom in
            nfCommon.addHoverEffect('#zoom-in-button', 'zoom-in', 'zoom-in-hover').on('click', function () {
                nfCanvas.View.zoomIn();

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // zoom out
            nfCommon.addHoverEffect('#zoom-out-button', 'zoom-out', 'zoom-out-hover').on('click', function () {
                nfCanvas.View.zoomOut();

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // zoom fit
            nfCommon.addHoverEffect('#zoom-fit-button', 'fit-image', 'fit-image-hover').on('click', function () {
                nfCanvas.View.fit();

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });

            // one to one
            nfCommon.addHoverEffect('#zoom-actual-button', 'actual-size', 'actual-size-hover').on('click', function () {
                nfCanvas.View.actualSize();

                // hide the context menu
                nfContextMenu.hide();

                // refresh the canvas
                nfCanvas.View.refresh({
                    transition: true
                });
            });
        }
    };
});