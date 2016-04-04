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
        'nf-context-menu',
        'nf-graph',
        'nf-birdseye',
        'nf-canvas-utils'],
    function (nfCommon,
              nfContextMenu,
              nfGraph,
              nfBirdseye,
              nfCanvasUtils) {

        /**
         * Updates component visibility based on their proximity to the screen's viewport.
         */
        var updateComponentVisibility = function() {
            var canvasContainer = $('#canvas-container');
            var translate = this.translate();
            var scale = this.scale();

            // scale the translation
            translate = [translate[0] / scale, translate[1] / scale];

            // get the normalized screen width and height
            var screenWidth = canvasContainer.width() / scale;
            var screenHeight = canvasContainer.height() / scale;

            // calculate the screen bounds one screens worth in each direction
            var screenLeft = -translate[0] - screenWidth;
            var screenTop = -translate[1] - screenHeight;
            var screenRight = screenLeft + (screenWidth * 3);
            var screenBottom = screenTop + (screenHeight * 3);

            // detects whether a component is visible and should be rendered
            var isComponentVisible = function (d) {
                if (!this.shouldRenderPerScale()) {
                    return false;
                }

                var left = d.component.position.x;
                var top = d.component.position.y;
                var right = left + d.dimensions.width;
                var bottom = top + d.dimensions.height;

                // determine if the component is now visible
                return screenLeft < right && screenRight > left && screenTop < bottom && screenBottom > top;
            };

            // detects whether a connection is visible and should be rendered
            var isConnectionVisible = function (d) {
                if (!this.shouldRenderPerScale()) {
                    return false;
                }

                var x, y;
                if (d.bends.length > 0) {
                    var i = Math.min(Math.max(0, d.labelIndex), d.bends.length - 1);
                    x = d.bends[i].x;
                    y = d.bends[i].y;
                } else {
                    x = (d.start.x + d.end.x) / 2;
                    y = (d.start.y + d.end.y) / 2;
                }

                return screenLeft < x && screenRight > x && screenTop < y && screenBottom > y;
            };

            // marks the specific component as visible and determines if its entering or leaving visibility
            var updateVisibility = function (d, isVisible) {
                var selection = d3.select('#id-' + d.component.id);
                var visible = isVisible(d);
                var wasVisible = selection.classed('visible');

                // mark the selection as appropriate
                selection.classed('visible', visible)
                    .classed('entering', function () {
                        return visible && !wasVisible;
                    }).classed('leaving', function () {
                    return !visible && wasVisible;
                });
            };

            // get the all components
            var graph = nfGraph.get();

            // update the visibility for each component
            $.each(graph.processors, function (_, d) {
                updateVisibility(d, isComponentVisible);
            });
            $.each(graph.ports, function (_, d) {
                updateVisibility(d, isComponentVisible);
            });
            $.each(graph.processGroups, function (_, d) {
                updateVisibility(d, isComponentVisible);
            });
            $.each(graph.remoteProcessGroups, function (_, d) {
                updateVisibility(d, isComponentVisible);
            });
            $.each(graph.connections, function (_, d) {
                updateVisibility(d, isConnectionVisible);
            });
        };

        // initialize the zoom behavior
        var behavior;

        return {
            init: function (MIN_SCALE, MAX_SCALE, TRANSLATE, SCALE, svg) {
                var refreshed;
                var zoomed = false;

                // define the behavior
                behavior = d3.behavior.zoom()
                    .scaleExtent([MIN_SCALE, MAX_SCALE])
                    .translate(TRANSLATE)
                    .scale(SCALE)
                    .on('zoomstart', function () {
                        // hide the context menu
                        nfContextMenu.hide();
                    })
                    .on('zoom', function () {
                        // if we have zoomed, indicate that we are panning
                        // to prevent deselection elsewhere
                        if (zoomed) {
                            panning = true;
                        } else {
                            zoomed = true;
                        }

                        // see if the scale has changed during this zoom event,
                        // we want to only transition when zooming in/out as running
                        // the transitions during pan events is
                        var transition = d3.event.sourceEvent.type === 'wheel' || d3.event.sourceEvent.type === 'mousewheel';

                        // refresh the canvas
                        refreshed = this.refresh({
                            persist: false,
                            transition: transition,
                            refreshComponents: false,
                            refreshBirdseye: false
                        });
                    })
                    .on('zoomend', function () {
                        // ensure the canvas was actually refreshed
                        if (nfCommon.isDefinedAndNotNull(refreshed)) {
                            this.updateVisibility();

                            // refresh the birdseye
                            refreshed.done(function () {
                                nfBirdseye.refresh();
                            });

                            // persist the users view
                            nfCanvasUtils.persistUserView();

                            // reset the refreshed deferred
                            refreshed = null;
                        }

                        panning = false;
                        zoomed = false;
                    });

                // add the behavior to the canvas and disable dbl click zoom
                svg.call(behavior).on('dblclick.zoom', null);
            },

            /**
             * Whether or not a component should be rendered based solely on the current scale.
             *
             * @returns {Boolean}
             */
            shouldRenderPerScale: function (MIN_SCALE_TO_RENDER) {
                return this.scale() >= MIN_SCALE_TO_RENDER;
            },

            /**
             * Updates component visibility based on the current translation/scale.
             */
            updateVisibility: function () {
                updateComponentVisibility();
                nfGraph.pan();
            },

            /**
             * Sets/gets the current translation.
             *
             * @param {array} translate     [x, y]
             */
            translate: function (translate) {
                if (nfCommon.isUndefined(translate)) {
                    return behavior.translate();
                } else {
                    behavior.translate(translate);
                }
            },

            /**
             * Sets/gets the current scale.
             *
             * @param {number} scale        The new scale
             */
            scale: function (scale) {
                if (nfCommon.isUndefined(scale)) {
                    return behavior.scale();
                } else {
                    behavior.scale(scale);
                }
            },

            /**
             * Zooms in a single zoom increment.
             */
            zoomIn: function (INCREMENT, MIN_SCALE) {
                var translate = this.translate();
                var scale = this.scale();
                var newScale = Math.min(scale * INCREMENT, MAX_SCALE);

                // get the canvas normalized width and height
                var canvasContainer = $('#canvas-container');
                var screenWidth = canvasContainer.width() / scale;
                var screenHeight = canvasContainer.height() / scale;

                // adjust the scale
                this.scale(newScale);

                // center around the center of the screen accounting for the translation accordingly
                nfCanvasUtils.centerBoundingBox({
                    x: (screenWidth / 2) - (translate[0] / scale),
                    y: (screenHeight / 2) - (translate[1] / scale),
                    width: 1,
                    height: 1
                });
            },

            /**
             * Zooms out a single zoom increment.
             */
            zoomOut: function (INCREMENT, MIN_SCALE) {
                var translate = this.translate();
                var scale = this.scale();
                var newScale = Math.max(scale / INCREMENT, MIN_SCALE);

                // get the canvas normalized width and height
                var canvasContainer = $('#canvas-container');
                var screenWidth = canvasContainer.width() / scale;
                var screenHeight = canvasContainer.height() / scale;

                // adjust the scale
                this.scale(newScale);

                // center around the center of the screen accounting for the translation accordingly
                nfCanvasUtils.centerBoundingBox({
                    x: (screenWidth / 2) - (translate[0] / scale),
                    y: (screenHeight / 2) - (translate[1] / scale),
                    width: 1,
                    height: 1
                });
            },

            /**
             * Zooms to fit the entire graph on the canvas.
             */
            fit: function (MIN_SCALE, MAX_SCALE) {
                var translate = this.translate();
                var scale = this.scale();
                var newScale;

                // get the canvas normalized width and height
                var canvasContainer = $('#canvas-container');
                var canvasWidth = canvasContainer.width();
                var canvasHeight = canvasContainer.height();

                // get the bounding box for the graph
                var graphBox = d3.select('#canvas').node().getBoundingClientRect();
                var graphWidth = graphBox.width / scale;
                var graphHeight = graphBox.height / scale;
                var graphLeft = graphBox.left / scale;
                var graphTop = (graphBox.top - this.CANVAS_OFFSET) / scale;


                // adjust the scale to ensure the entire graph is visible
                if (graphWidth > canvasWidth || graphHeight > canvasHeight) {
                    newScale = Math.min(canvasWidth / graphWidth, canvasHeight / graphHeight);

                    // ensure the scale is within bounds
                    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
                } else {
                    newScale = 1;

                    // since the entire graph will fit on the canvas, offset origin appropriately
                    graphLeft -= 100;
                    graphTop -= 50;
                }

                // set the new scale
                this.scale(newScale);

                // center as appropriate
                nfCanvasUtils.centerBoundingBox({
                    x: graphLeft - (translate[0] / scale),
                    y: graphTop - (translate[1] / scale),
                    width: canvasWidth / newScale,
                    height: canvasHeight / newScale
                });
            },

            /**
             * Zooms to the actual size (1 to 1).
             */
            actualSize: function (CANVAS_OFFSET) {
                var translate = this.translate();
                var scale = this.scale();

                // get the first selected component
                var selection = nfCanvasUtils.getSelection();

                // set the updated scale
                this.scale(1);

                // box to zoom towards
                var box;

                // if components have been selected position the view accordingly
                if (!selection.empty()) {
                    // gets the data for the first component
                    var selectionBox = selection.node().getBoundingClientRect();

                    // get the bounding box for the selected components
                    box = {
                        x: (selectionBox.left / scale) - (translate[0] / scale),
                        y: ((selectionBox.top - this.CANVAS_OFFSET) / scale) - (translate[1] / scale),
                        width: selectionBox.width / scale,
                        height: selectionBox.height / scale
                    };
                } else {
                    // get the offset
                    var canvasContainer = $('#canvas-container');

                    // get the canvas normalized width and height
                    var screenWidth = canvasContainer.width() / scale;
                    var screenHeight = canvasContainer.height() / scale;

                    // center around the center of the screen accounting for the translation accordingly
                    box = {
                        x: (screenWidth / 2) - (translate[0] / scale),
                        y: (screenHeight / 2) - (translate[1] / scale),
                        width: 1,
                        height: 1
                    };
                }

                // center as appropriate
                nfCanvasUtils.centerBoundingBox(box);
            },

            /**
             * Refreshes the view based on the configured translation and scale.
             *
             * @param {object} options Options for the refresh operation
             */
            refresh: function (options) {
                return $.Deferred(function (deferred) {

                    var persist = true;
                    var transition = false;
                    var refreshComponents = true;
                    var refreshBirdseye = true;

                    // extract the options if specified
                    if (nfCommon.isDefinedAndNotNull(options)) {
                        persist = nfCommon.isDefinedAndNotNull(options.persist) ? options.persist : persist;
                        transition = nfCommon.isDefinedAndNotNull(options.transition) ? options.transition : transition;
                        refreshComponents = nfCommon.isDefinedAndNotNull(options.refreshComponents) ? options.refreshComponents : refreshComponents;
                        refreshBirdseye = nfCommon.isDefinedAndNotNull(options.refreshBirdseye) ? options.refreshBirdseye : refreshBirdseye;
                    }

                    // update component visibility
                    if (refreshComponents) {
                        this.updateVisibility();
                    }

                    // persist if appropriate
                    if (persist === true) {
                        nfCanvasUtils.persistUserView();
                    }

                    // update the canvas
                    if (transition === true) {
                        canvas.transition()
                            .duration(500)
                            .attr('transform', function () {
                                return 'translate(' + behavior.translate() + ') scale(' + behavior.scale() + ')';
                            })
                            .each('end', function () {
                                // refresh birdseye if appropriate
                                if (refreshBirdseye === true) {
                                    nfBirdseye.refresh();
                                }

                                deferred.resolve();
                            });
                    } else {
                        canvas.attr('transform', function () {
                            return 'translate(' + behavior.translate() + ') scale(' + behavior.scale() + ')';
                        });

                        // refresh birdseye if appropriate
                        if (refreshBirdseye === true) {
                            nfBirdseye.refresh();
                        }

                        deferred.resolve();
                    }
                }).promise();
            }
        };

    }
)