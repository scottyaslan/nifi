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

import { DestroyRef, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanvasState } from '../../state';
import { CanvasUtils } from '../canvas-utils.service';
import { PositionBehavior } from '../behavior/position-behavior.service';
import { SelectableBehavior } from '../behavior/selectable-behavior.service';
import { EditableBehavior } from '../behavior/editable-behavior.service';
import * as d3 from 'd3';
import {
    selectFlowLoadingStatus,
    selectLabels,
    selectAnySelectedComponentIds,
    selectTransitionRequired
} from '../../state/flow/flow.selectors';
import { Client } from '../../../../service/client.service';
import { updateComponent } from '../../state/flow/flow.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuickSelectBehavior } from '../behavior/quick-select-behavior.service';
import { ComponentType } from '../../../../state/shared';
import { UpdateComponentRequest } from '../../state/flow';
import { filter, switchMap } from 'rxjs';
import { NiFiCommon } from '../../../../service/nifi-common.service';

@Injectable({
    providedIn: 'root'
})
export class LabelManager {
    private destroyRef = inject(DestroyRef);

    public static readonly INITIAL_WIDTH: number = 148;
    public static readonly INITIAL_HEIGHT: number = 148;
    private static readonly MIN_HEIGHT: number = 24;
    private static readonly MIN_WIDTH: number = 64;
    private static readonly SNAP_ALIGNMENT_PIXELS: number = 8;

    private labels: [] = [];
    private labelContainer: any;
    private transitionRequired: boolean = false;

    private labelPointDrag: any;
    private snapEnabled: boolean = true;

    constructor(
        private store: Store<CanvasState>,
        private canvasUtils: CanvasUtils,
        private nifiCommon: NiFiCommon,
        private client: Client,
        private positionBehavior: PositionBehavior,
        private selectableBehavior: SelectableBehavior,
        private quickSelectBehavior: QuickSelectBehavior,
        private editableBehavior: EditableBehavior
    ) {}

    private select() {
        return this.labelContainer.selectAll('g.label').data(this.labels, function (d: any) {
            return d.id;
        });
    }

    private renderLabels(entered: any) {
        if (entered.empty()) {
            return entered;
        }

        const label = entered
            .append('g')
            .attr('id', function (d: any) {
                return 'id-' + d.id;
            })
            .attr('class', 'label component');

        // label border
        label.append('rect').attr('class', 'border').attr('fill', 'transparent').attr('stroke', 'transparent');

        // label
        label
            .append('rect')
            .attr('class', 'body')
            .attr('filter', 'url(#component-drop-shadow)')
            .attr('stroke-width', 0);

        // label value
        label
            .append('text')
            .attr('xml:space', 'preserve')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .attr('class', 'label-value');

        this.selectableBehavior.activate(label);
        this.quickSelectBehavior.activate(label);

        return label;
    }

    private updateLabels(updated: any) {
        if (updated.empty()) {
            return;
        }
        const self: LabelManager = this;

        // update the border using the configured color
        updated
            .select('rect.border')
            .attr('width', function (d: any) {
                return d.dimensions.width;
            })
            .attr('height', function (d: any) {
                return d.dimensions.height;
            })
            .classed('unauthorized', function (d: any) {
                return d.permissions.canRead === false;
            });

        // update the body fill using the configured color
        updated
            .select('rect.body')
            .attr('width', function (d: any) {
                return d.dimensions.width;
            })
            .attr('height', function (d: any) {
                return d.dimensions.height;
            })
            .style('fill', function (d: any) {
                if (!d.permissions.canRead) {
                    return null;
                }

                let color = self.defaultColor();

                // use the specified color if appropriate
                if (d.component.style['background-color']) {
                    color = d.component.style['background-color'];
                }

                return color;
            })
            .classed('unauthorized', function (d: any) {
                return d.permissions.canRead === false;
            });

        // go through each label being updated
        updated.each(function (this: any, d: any) {
            const label = d3.select(this);

            // update the component behavior as appropriate
            self.editableBehavior.editable(label);

            // update the label
            const labelText = label.select('text.label-value');
            const labelPoint = label.selectAll('rect.labelpoint');
            if (d.permissions.canRead) {
                // udpate the font size
                labelText.attr('font-size', function () {
                    let fontSize = '12px';

                    // use the specified color if appropriate
                    if (d.component.style['font-size']) {
                        fontSize = d.component.style['font-size'];
                    }

                    return fontSize;
                });

                // remove the previous label value
                labelText.selectAll('tspan').remove();

                // parse the lines in this label
                let lines = [];
                if (d.component.label) {
                    lines = d.component.label.split('\n');
                } else {
                    lines.push('');
                }

                let color = self.defaultColor();

                // use the specified color if appropriate
                if (d.component.style['background-color']) {
                    color = d.component.style['background-color'];
                }

                // add label value
                lines.forEach((line: string) => {
                    labelText
                        .append('tspan')
                        .attr('x', '0.4em')
                        .attr('dy', '1.2em')
                        .text(function () {
                            return line == '' ? ' ' : line;
                        })
                        .style('fill', function () {
                            return self.canvasUtils.determineContrastColor(
                                self.nifiCommon.substringAfterLast(color, '#')
                            );
                        });
                });

                // -----------
                // labelpoints
                // -----------

                if (d.permissions.canWrite) {
                    const pointData = [{ x: d.dimensions.width, y: d.dimensions.height }];
                    const points = labelPoint.data(pointData);

                    // create a point for the end
                    const pointsEntered: any = points
                        .enter()
                        .append('rect')
                        .attr('class', 'labelpoint')
                        .attr('width', 10)
                        .attr('height', 10)
                        .call(self.labelPointDrag);

                    // update the midpoints
                    points.merge(pointsEntered).attr('transform', function (p) {
                        return 'translate(' + (p.x - 10) + ', ' + (p.y - 10) + ')';
                    });

                    // remove old items
                    points.exit().remove();
                }
            } else {
                // remove the previous label value
                labelText.selectAll('tspan').remove();

                // remove the label points
                labelPoint.remove();
            }
        });
    }

    private defaultColor(): string {
        return '#fff7d7';
    }

    private removeLabels(removed: any) {
        removed.remove();
    }

    public init(): void {
        this.labelContainer = d3.select('#canvas').append('g').attr('pointer-events', 'all').attr('class', 'labels');

        this.store
            .select(selectLabels)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((labels) => {
                this.set(labels);
            });

        this.store
            .select(selectFlowLoadingStatus)
            .pipe(
                filter((status) => status === 'success'),
                switchMap(() => this.store.select(selectAnySelectedComponentIds)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((selected) => {
                this.labelContainer.selectAll('g.label').classed('selected', function (d: any) {
                    return selected.includes(d.id);
                });
            });

        this.store
            .select(selectTransitionRequired)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((transitionRequired) => {
                this.transitionRequired = transitionRequired;
            });

        const self: LabelManager = this;

        // handle bend point drag events
        this.labelPointDrag = d3
            .drag()
            .on('start', function (event) {
                // stop further propagation
                event.sourceEvent.stopPropagation();
            })
            .on('drag', function (this: any, event) {
                const label = d3.select(this.parentNode);
                const labelData: any = label.datum();

                // update the dimensions and ensure they are still within bounds
                // snap between aligned sizes unless the user is holding shift
                self.snapEnabled = !event.sourceEvent.shiftKey;
                labelData.dimensions.width = Math.max(
                    LabelManager.MIN_WIDTH,
                    self.snapEnabled
                        ? Math.round(event.x / LabelManager.SNAP_ALIGNMENT_PIXELS) * LabelManager.SNAP_ALIGNMENT_PIXELS
                        : event.x
                );
                labelData.dimensions.height = Math.max(
                    LabelManager.MIN_HEIGHT,
                    self.snapEnabled
                        ? Math.round(event.y / LabelManager.SNAP_ALIGNMENT_PIXELS) * LabelManager.SNAP_ALIGNMENT_PIXELS
                        : event.y
                );

                // redraw this connection
                self.updateLabels(label);
            })
            .on('end', function (this: any, event) {
                const label = d3.select(this.parentNode);
                const labelData: any = label.datum();

                // determine if the width has changed
                let different: boolean = false;
                let widthSet: boolean = !!labelData.component.width;
                if (widthSet || labelData.dimensions.width !== labelData.component.width) {
                    different = true;
                }

                // determine if the height has changed
                let heightSet: boolean = !!labelData.component.height;
                if ((!different && heightSet) || labelData.dimensions.height !== labelData.component.height) {
                    different = true;
                }

                // only save the updated bends if necessary
                if (different) {
                    const updateLabel: UpdateComponentRequest = {
                        id: labelData.id,
                        type: ComponentType.Label,
                        uri: labelData.uri,
                        payload: {
                            revision: self.client.getRevision(labelData),
                            component: {
                                id: labelData.id,
                                width: labelData.dimensions.width,
                                height: labelData.dimensions.height
                            }
                        },
                        restoreOnFailure: {
                            dimensions: {
                                width: widthSet ? labelData.component.width : LabelManager.INITIAL_WIDTH,
                                height: heightSet ? labelData.component.height : LabelManager.INITIAL_HEIGHT
                            }
                        }
                    };

                    self.store.dispatch(
                        updateComponent({
                            request: updateLabel
                        })
                    );
                }

                // stop further propagation
                event.sourceEvent.stopPropagation();
            });
    }

    private set(labels: any): void {
        // update the labels
        this.labels = labels.map((label: any) => {
            return {
                ...label,
                type: ComponentType.Label,
                dimensions: {
                    ...label.dimensions
                }
            };
        });

        // select
        const selection = this.select();

        // enter
        const entered = this.renderLabels(selection.enter());

        // update
        const updated = selection.merge(entered);
        this.updateLabels(updated);

        // position
        this.positionBehavior.position(updated, this.transitionRequired);

        // exit
        this.removeLabels(selection.exit());
    }

    public selectAll(): any {
        return this.labelContainer.selectAll('g.label');
    }

    public render(): void {
        this.updateLabels(this.selectAll());
    }

    public pan(): void {
        this.updateLabels(this.labelContainer.selectAll('g.label.entering, g.label.leaving'));
    }
}
