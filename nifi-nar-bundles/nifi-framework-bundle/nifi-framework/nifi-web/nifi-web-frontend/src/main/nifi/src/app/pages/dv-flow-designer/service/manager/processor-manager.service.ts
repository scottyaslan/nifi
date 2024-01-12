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

import { DestroyRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanvasState } from '../../state';
import { CanvasUtils } from '../canvas-utils.service';
import { PositionBehavior } from '../behavior/position-behavior.service';
import { SelectableBehavior } from '../behavior/selectable-behavior.service';
import { EditableBehavior } from '../behavior/editable-behavior.service';
import * as d3 from 'd3';
import {
    selectFlowLoadingStatus,
    selectProcessors,
    selectAnySelectedComponentIds,
    selectTransitionRequired
} from '../../state/flow/flow.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuickSelectBehavior } from '../behavior/quick-select-behavior.service';
import { ValidationErrorsTip } from '../../../../ui/common/tooltips/validation-errors-tip/validation-errors-tip.component';
import { TextTip } from '../../../../ui/common/tooltips/text-tip/text-tip.component';
import { Dimension } from '../../state/shared';
import { ComponentType } from '../../../../state/shared';
import { filter, switchMap } from 'rxjs';
import { NiFiCommon } from '../../../../service/nifi-common.service';

@Injectable({
    providedIn: 'root'
})
export class ProcessorManager {
    private destroyRef = inject(DestroyRef);

    private dimensions: Dimension = {
        width: 352,
        height: 128
    };

    private static readonly PREVIEW_NAME_LENGTH: number = 25;

    private processors: [] = [];
    private processorContainer: any;
    private transitionRequired: boolean = false;

    private viewContainerRef: ViewContainerRef | undefined;

    constructor(
        private store: Store<CanvasState>,
        private canvasUtils: CanvasUtils,
        private nifiCommon: NiFiCommon,
        private positionBehavior: PositionBehavior,
        private selectableBehavior: SelectableBehavior,
        private quickSelectBehavior: QuickSelectBehavior,
        private editableBehavior: EditableBehavior
    ) {}

    private select() {
        return this.processorContainer.selectAll('g.processor').data(this.processors, function (d: any) {
            return d.id;
        });
    }

    private renderProcessors(entered: any) {
        if (entered.empty()) {
            return entered;
        }

        const processor = entered
            .append('g')
            .attr('id', function (d: any) {
                return 'id-' + d.id;
            })
            .attr('class', 'processor component');

        // processor border
        processor
            .append('rect')
            .attr('class', 'border')
            .attr('width', function (d: any) {
                return d.dimensions.width;
            })
            .attr('height', function (d: any) {
                return d.dimensions.height;
            })
            .attr('fill', 'transparent')
            .attr('stroke', 'transparent');

        // processor body
        processor
            .append('rect')
            .attr('class', 'body')
            .attr('width', function (d: any) {
                return d.dimensions.width;
            })
            .attr('height', function (d: any) {
                return d.dimensions.height;
            })
            .attr('filter', 'url(#component-drop-shadow)')
            .attr('stroke-width', 0);

        // processor name
        processor
            .append('text')
            .attr('x', 75)
            .attr('y', 18)
            .attr('width', 230)
            .attr('height', 14)
            .attr('class', 'processor-name');

        // processor icon container
        processor
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 50)
            .attr('height', 50)
            .attr('class', 'processor-icon-container');

        // processor icon
        processor.append('text').attr('x', 9).attr('y', 35).attr('class', 'processor-icon').text('\ue807');

        // restricted icon background
        processor.append('circle').attr('r', 9).attr('cx', 12).attr('cy', 12).attr('class', 'restricted-background');

        // restricted icon
        processor.append('text').attr('x', 7.75).attr('y', 17).attr('class', 'restricted').text('\uf132');

        // is primary icon background
        processor.append('circle').attr('r', 9).attr('cx', 38).attr('cy', 36).attr('class', 'is-primary-background');

        // is primary icon
        processor
            .append('text')
            .attr('x', 34.75)
            .attr('y', 40)
            .attr('class', 'is-primary')
            .text('P')
            .append('title')
            .text(function () {
                return 'This component is only scheduled to execute on the Primary Node';
            });

        this.selectableBehavior.activate(processor);
        this.quickSelectBehavior.activate(processor);

        return processor;
    }

    private updateProcessors(updated: any) {
        if (updated.empty()) {
            return;
        }
        const self: ProcessorManager = this;

        // processor border authorization
        updated
            .select('rect.border')
            .classed('unauthorized', function (d: any) {
                return d.permissions.canRead === false;
            })
            .classed('ghost', function (d: any) {
                return d.permissions.canRead === true && d.component.extensionMissing === true;
            });

        // processor body authorization
        updated.select('rect.body').classed('unauthorized', function (d: any) {
            return d.permissions.canRead === false;
        });

        updated.each(function (this: any, processorData: any) {
            const processor: any = d3.select(this);
            let details: any = processor.select('g.processor-canvas-details');

            // update the component behavior as appropriate
            self.editableBehavior.editable(processor);

            // if this processor is visible, render everything
            if (processor.classed('visible')) {
                if (details.empty()) {
                    details = processor.append('g').attr('class', 'processor-canvas-details');

                    // run status icon
                    details
                        .append('text')
                        .attr('class', 'run-status-icon')
                        .attr('x', 55)
                        .attr('y', 23)
                        .attr('width', 14)
                        .attr('height', 14);

                    // processor type
                    details
                        .append('text')
                        .attr('class', 'processor-type')
                        .attr('x', 75)
                        .attr('y', 32)
                        .attr('width', 230)
                        .attr('height', 12);

                    // processor type
                    details
                        .append('text')
                        .attr('class', 'processor-bundle')
                        .attr('x', 75)
                        .attr('y', 45)
                        .attr('width', 200)
                        .attr('height', 12);

                    // -----
                    // stats
                    // -----

                    // draw the processor statistics table

                    // in
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 19)
                        .attr('x', 0)
                        .attr('y', 50)
                        .attr('fill', '#f4f6f7');

                    // border
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 1)
                        .attr('x', 0)
                        .attr('y', 68)
                        .attr('fill', '#c7d2d7');

                    // read/write
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 19)
                        .attr('x', 0)
                        .attr('y', 69)
                        .attr('fill', '#ffffff');

                    // border
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 1)
                        .attr('x', 0)
                        .attr('y', 87)
                        .attr('fill', '#c7d2d7');

                    // out
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 20)
                        .attr('x', 0)
                        .attr('y', 88)
                        .attr('fill', '#f4f6f7');

                    // border
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 1)
                        .attr('x', 0)
                        .attr('y', 106)
                        .attr('fill', '#c7d2d7');

                    // tasks/time
                    details
                        .append('rect')
                        .attr('width', function () {
                            return processorData.dimensions.width;
                        })
                        .attr('height', 19)
                        .attr('x', 0)
                        .attr('y', 107)
                        .attr('fill', '#ffffff');

                    // stats label container
                    const processorStatsLabel = details.append('g').attr('transform', 'translate(10, 55)');

                    // in label
                    processorStatsLabel
                        .append('text')
                        .attr('width', 73)
                        .attr('height', 10)
                        .attr('y', 9)
                        .attr('class', 'stats-label')
                        .text('In');

                    // read/write label
                    processorStatsLabel
                        .append('text')
                        .attr('width', 73)
                        .attr('height', 10)
                        .attr('y', 27)
                        .attr('class', 'stats-label')
                        .text('Read/Write');

                    // out label
                    processorStatsLabel
                        .append('text')
                        .attr('width', 73)
                        .attr('height', 10)
                        .attr('y', 46)
                        .attr('class', 'stats-label')
                        .text('Out');

                    // tasks/time label
                    processorStatsLabel
                        .append('text')
                        .attr('width', 73)
                        .attr('height', 10)
                        .attr('y', 65)
                        .attr('class', 'stats-label')
                        .text('Tasks/Time');

                    // stats value container
                    const processorStatsValue = details.append('g').attr('transform', 'translate(85, 55)');

                    // in value
                    const inText = processorStatsValue
                        .append('text')
                        .attr('width', 180)
                        .attr('height', 9)
                        .attr('y', 9)
                        .attr('class', 'processor-in stats-value');

                    // in count
                    inText.append('tspan').attr('class', 'count');

                    // in size
                    inText.append('tspan').attr('class', 'size');

                    // read/write value
                    processorStatsValue
                        .append('text')
                        .attr('width', 180)
                        .attr('height', 10)
                        .attr('y', 27)
                        .attr('class', 'processor-read-write stats-value');

                    // out value
                    const outText = processorStatsValue
                        .append('text')
                        .attr('width', 180)
                        .attr('height', 10)
                        .attr('y', 46)
                        .attr('class', 'processor-out stats-value');

                    // out count
                    outText.append('tspan').attr('class', 'count');

                    // out size
                    outText.append('tspan').attr('class', 'size');

                    // tasks/time value
                    processorStatsValue
                        .append('text')
                        .attr('width', 180)
                        .attr('height', 10)
                        .attr('y', 65)
                        .attr('class', 'processor-tasks-time stats-value');

                    // stats value container
                    const processorStatsInfo = details.append('g').attr('transform', 'translate(305, 55)');

                    // in info
                    processorStatsInfo
                        .append('text')
                        .attr('width', 25)
                        .attr('height', 10)
                        .attr('y', 9)
                        .attr('class', 'stats-info')
                        .text('5 min');

                    // read/write info
                    processorStatsInfo
                        .append('text')
                        .attr('width', 25)
                        .attr('height', 10)
                        .attr('y', 27)
                        .attr('class', 'stats-info')
                        .text('5 min');

                    // out info
                    processorStatsInfo
                        .append('text')
                        .attr('width', 25)
                        .attr('height', 10)
                        .attr('y', 46)
                        .attr('class', 'stats-info')
                        .text('5 min');

                    // tasks/time info
                    processorStatsInfo
                        .append('text')
                        .attr('width', 25)
                        .attr('height', 10)
                        .attr('y', 65)
                        .attr('class', 'stats-info')
                        .text('5 min');

                    // --------
                    // comments
                    // --------

                    details
                        .append('path')
                        .attr('class', 'component-comments')
                        .attr(
                            'transform',
                            'translate(' +
                                (processorData.dimensions.width - 2) +
                                ', ' +
                                (processorData.dimensions.height - 10) +
                                ')'
                        )
                        .attr('d', 'm0,0 l0,8 l-8,0 z');

                    // -------------------
                    // active thread count
                    // -------------------

                    // active thread count
                    details.append('text').attr('class', 'active-thread-count-icon').attr('y', 46).text('\ue83f');

                    // active thread background
                    details.append('text').attr('class', 'active-thread-count').attr('y', 46);

                    // ---------
                    // bulletins
                    // ---------

                    // bulletin background
                    details
                        .append('rect')
                        .attr('class', 'bulletin-background')
                        .attr('x', function () {
                            return processorData.dimensions.width - 24;
                        })
                        .attr('width', 24)
                        .attr('height', 24);

                    // bulletin icon
                    details
                        .append('text')
                        .attr('class', 'bulletin-icon')
                        .attr('x', function () {
                            return processorData.dimensions.width - 17;
                        })
                        .attr('y', 17)
                        .text('\uf24a');
                }

                if (processorData.permissions.canRead) {
                    // update the processor name
                    processor
                        .select('text.processor-name')
                        .each(function (this: any, d: any) {
                            const processorName = d3.select(this);

                            // reset the processor name to handle any previous state
                            processorName.text(null).selectAll('title').remove();

                            // apply ellipsis to the processor name as necessary
                            self.canvasUtils.ellipsis(processorName, d.component.name, 'processor-name');
                        })
                        .append('title')
                        .text(function (d: any) {
                            return d.component.name;
                        });

                    // update the processor type
                    processor
                        .select('text.processor-type')
                        .each(function (this: any, d: any) {
                            const processorType = d3.select(this);

                            // reset the processor type to handle any previous state
                            processorType.text(null).selectAll('title').remove();

                            // apply ellipsis to the processor type as necessary
                            self.canvasUtils.ellipsis(
                                processorType,
                                self.nifiCommon.formatType(d.component),
                                'processor-type'
                            );
                        })
                        .append('title')
                        .text(function (d: any) {
                            return self.nifiCommon.formatType(d.component);
                        });

                    // update the processor bundle
                    processor
                        .select('text.processor-bundle')
                        .each(function (this: any, d: any) {
                            const processorBundle = d3.select(this);

                            // reset the processor type to handle any previous state
                            processorBundle.text(null).selectAll('title').remove();

                            // apply ellipsis to the processor type as necessary
                            self.canvasUtils.ellipsis(
                                processorBundle,
                                self.nifiCommon.formatBundle(d.component.bundle),
                                'processor-bundle'
                            );
                        })
                        .append('title')
                        .text(function (d: any) {
                            return self.nifiCommon.formatBundle(d.component.bundle);
                        });

                    // update the processor comments
                    processor
                        .select('path.component-comments')
                        .style(
                            'visibility',
                            self.nifiCommon.isBlank(processorData.component.config.comments) ? 'hidden' : 'visible'
                        )
                        .each(function (this: any) {
                            if (
                                !self.nifiCommon.isBlank(processorData.component.config.comments) &&
                                self.viewContainerRef
                            ) {
                                self.canvasUtils.canvasTooltip(self.viewContainerRef, TextTip, d3.select(this), {
                                    text: processorData.component.config.comments
                                });
                            }
                        });
                } else {
                    // clear the processor name
                    processor.select('text.processor-name').text(null);

                    // clear the processor type
                    processor.select('text.processor-type').text(null);

                    // clear the processor bundle
                    processor.select('text.processor-bundle').text(null);

                    // clear the processor comments
                    processor.select('path.component-comments').style('visibility', 'hidden');
                }

                // populate the stats
                self.updateProcessorStatus(processor);
            } else {
                if (processorData.permissions.canRead) {
                    // update the processor name
                    processor.select('text.processor-name').text(function (d: any) {
                        const name = d.component.name;
                        if (name.length > ProcessorManager.PREVIEW_NAME_LENGTH) {
                            return name.substring(0, ProcessorManager.PREVIEW_NAME_LENGTH) + String.fromCharCode(8230);
                        } else {
                            return name;
                        }
                    });
                } else {
                    // clear the processor name
                    processor.select('text.processor-name').text(null);
                }

                // remove the details if necessary
                if (!details.empty()) {
                    details.remove();
                }
            }

            // ---------------
            // processor color
            // ---------------

            //update the processor icon container
            processor
                .select('rect.processor-icon-container')
                .classed('unauthorized', !processorData.permissions.canRead);

            //update the processor icon
            processor.select('text.processor-icon').classed('unauthorized', !processorData.permissions.canRead);

            //update the processor border
            processor.select('rect.border').classed('unauthorized', !processorData.permissions.canRead);

            // use the specified color if appropriate
            if (processorData.permissions.canRead) {
                if (processorData.component.style['background-color']) {
                    const color = processorData.component.style['background-color'];

                    //update the processor icon container
                    processor.select('rect.processor-icon-container').style('fill', function () {
                        return color;
                    });

                    //update the processor border
                    processor.select('rect.border').style('stroke', function () {
                        return color;
                    });
                }
            }

            // update the processor color
            processor.select('text.processor-icon').style('fill', function (d: any) {
                // get the default color
                let color: string = self.defaultIconColor();

                if (!d.permissions.canRead) {
                    return color;
                }

                // use the specified color if appropriate
                if (d.component.style['background-color']) {
                    color = d.component.style['background-color'];

                    //special case #ffffff implies default fill
                    if (color.toLowerCase() === '#ffffff') {
                        color = self.defaultIconColor();
                    } else {
                        color = self.canvasUtils.determineContrastColor(self.nifiCommon.substringAfterLast(color, '#'));
                    }
                }

                return color;
            });

            // restricted component indicator
            processor.select('circle.restricted-background').style('visibility', self.showRestricted);
            processor.select('text.restricted').style('visibility', self.showRestricted);

            // is primary component indicator
            processor.select('circle.is-primary-background').style('visibility', self.showIsPrimary);
            processor.select('text.is-primary').style('visibility', self.showIsPrimary);
        });
    }

    private updateProcessorStatus(updated: any) {
        if (updated.empty()) {
            return;
        }
        const self: ProcessorManager = this;

        // update the run status
        updated
            .select('text.run-status-icon')
            .attr('fill', function (d: any) {
                let fill: string = '#728e9b';

                if (d.status.aggregateSnapshot.runStatus === 'Validating') {
                    fill = '#a8a8a8';
                } else if (d.status.aggregateSnapshot.runStatus === 'Invalid') {
                    fill = '#cf9f5d';
                } else if (d.status.aggregateSnapshot.runStatus === 'Running') {
                    fill = '#7dc7a0';
                } else if (d.status.aggregateSnapshot.runStatus === 'Stopped') {
                    fill = '#d18686';
                }

                return fill;
            })
            .attr('font-family', function (d: any) {
                let family: string = 'FontAwesome';
                if (d.status.aggregateSnapshot.runStatus === 'Disabled') {
                    family = 'flowfont';
                }
                return family;
            })
            .classed('fa-spin', function (d: any) {
                return d.status.aggregateSnapshot.runStatus === 'Validating';
            })
            .text(function (d: any) {
                let img: string = '';
                if (d.status.aggregateSnapshot.runStatus === 'Disabled') {
                    img = '\ue802';
                } else if (d.status.aggregateSnapshot.runStatus === 'Validating') {
                    img = '\uf1ce';
                } else if (d.status.aggregateSnapshot.runStatus === 'Invalid') {
                    img = '\uf071';
                } else if (d.status.aggregateSnapshot.runStatus === 'Running') {
                    img = '\uf04b';
                } else if (d.status.aggregateSnapshot.runStatus === 'Stopped') {
                    img = '\uf04d';
                }
                return img;
            })
            .each(function (this: any, d: any) {
                // if there are validation errors generate a tooltip
                if (self.needsTip(d) && self.viewContainerRef) {
                    self.canvasUtils.canvasTooltip(self.viewContainerRef, ValidationErrorsTip, d3.select(this), {
                        isValidating: d.status.aggregateSnapshot.runStatus === 'Validating',
                        validationErrors: d.component.validationErrors
                    });
                }
            });

        // in count value
        updated.select('text.processor-in tspan.count').text(function (d: any) {
            return self.nifiCommon.substringBeforeFirst(d.status.aggregateSnapshot.input, ' ');
        });

        // in size value
        updated.select('text.processor-in tspan.size').text(function (d: any) {
            return ' ' + self.nifiCommon.substringAfterFirst(d.status.aggregateSnapshot.input, ' ');
        });

        // read/write value
        updated.select('text.processor-read-write').text(function (d: any) {
            return d.status.aggregateSnapshot.read + ' / ' + d.status.aggregateSnapshot.written;
        });

        // out count value
        updated.select('text.processor-out tspan.count').text(function (d: any) {
            return self.nifiCommon.substringBeforeFirst(d.status.aggregateSnapshot.output, ' ');
        });

        // out size value
        updated.select('text.processor-out tspan.size').text(function (d: any) {
            return ' ' + self.nifiCommon.substringAfterFirst(d.status.aggregateSnapshot.output, ' ');
        });

        // tasks/time value
        updated.select('text.processor-tasks-time').text(function (d: any) {
            return d.status.aggregateSnapshot.tasks + ' / ' + d.status.aggregateSnapshot.tasksDuration;
        });

        updated.each(function (this: any, d: any) {
            const processor = d3.select(this);

            // -------------------
            // active thread count
            // -------------------

            self.canvasUtils.activeThreadCount(processor, d);

            // ---------
            // bulletins
            // ---------

            if (self.viewContainerRef) {
                self.canvasUtils.bulletins(self.viewContainerRef, processor, d.bulletins);
            }
        });
    }

    private removeProcessors(removed: any) {
        removed.remove();
    }

    private defaultIconColor(): string {
        return '#ad9897';
    }

    /**
     * Determines whether the specific component needs a tooltip.
     *
     * @param d
     * @return if a tip is required
     */
    private needsTip(d: any) {
        return (
            (d.permissions.canRead && !this.nifiCommon.isEmpty(d.component.validationErrors)) ||
            d.status.aggregateSnapshot.runStatus === 'Validating'
        );
    }

    /**
     * Returns whether the resticted indicator should be shown for a given component
     * @param d
     * @returns {*}
     */
    private showRestricted(d: any): string {
        if (!d.permissions.canRead) {
            return 'hidden';
        }

        return d.component.restricted ? 'visible' : 'hidden';
    }

    /**
     * Returns whether the is primary indicator should be shown for a given component
     * @param d
     * @returns {*}
     */
    private showIsPrimary(d: any): string {
        // TODO
        // return nfClusterSummary.isClustered() && d.status.aggregateSnapshot.executionNode === 'PRIMARY' ? 'visible' : 'hidden';
        return d.status.aggregateSnapshot.executionNode === 'PRIMARY' ? 'visible' : 'hidden';
    }

    public init(viewContainerRef: ViewContainerRef): void {
        this.viewContainerRef = viewContainerRef;

        this.processorContainer = d3
            .select('#canvas')
            .append('g')
            .attr('pointer-events', 'all')
            .attr('class', 'processors');

        this.store
            .select(selectProcessors)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((processors) => {
                this.set(processors);
            });

        this.store
            .select(selectFlowLoadingStatus)
            .pipe(
                filter((status) => status === 'success'),
                switchMap(() => this.store.select(selectAnySelectedComponentIds)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((selected) => {
                this.processorContainer.selectAll('g.processor').classed('selected', function (d: any) {
                    return selected.includes(d.id);
                });
            });

        this.store
            .select(selectTransitionRequired)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((transitionRequired) => {
                this.transitionRequired = transitionRequired;
            });
    }

    private set(processors: any): void {
        // update the processors
        this.processors = processors.map((processor: any) => {
            return {
                ...processor,
                type: ComponentType.Processor,
                dimensions: this.dimensions
            };
        });

        // select
        const selection = this.select();

        // enter
        const entered = this.renderProcessors(selection.enter());

        // update
        const updated = selection.merge(entered);
        this.updateProcessors(updated);

        // position
        this.positionBehavior.position(updated, this.transitionRequired);

        // exit
        this.removeProcessors(selection.exit());
    }

    public selectAll(): any {
        return this.processorContainer.selectAll('g.processor');
    }

    public render(): void {
        this.updateProcessors(this.selectAll());
    }

    public pan(): void {
        this.updateProcessors(this.processorContainer.selectAll('g.processor.entering, g.processor.leaving'));
    }
}
