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

import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CanvasState } from '../../state';
import { Position } from '../../state/shared';
import { Store } from '@ngrx/store';
import {
    centerSelectedComponent,
    deselectAllComponents,
    editComponent,
    editCurrentProcessGroup,
    loadProcessGroup,
    resetFlowState,
    selectComponents,
    setSkipTransform,
    startProcessGroupPolling,
    stopProcessGroupPolling
} from '../../state/flow/flow.actions';
import * as d3 from 'd3';
import { CanvasView } from '../../service/canvas-view.service';
import { INITIAL_SCALE, INITIAL_TRANSLATE } from '../../state/transform/transform.reducer';
import { selectTransform } from '../../state/transform/transform.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectedComponent } from '../../state/flow';
import {
    selectBulkSelectedComponentIds,
    selectConnection,
    selectCurrentProcessGroupId,
    selectEditedCurrentProcessGroup,
    selectFunnel,
    selectInputPort,
    selectLabel,
    selectOutputPort,
    selectProcessGroup,
    selectProcessGroupIdFromRoute,
    selectProcessGroupRoute,
    selectProcessor,
    selectRemoteProcessGroup,
    selectSingleEditedComponent,
    selectSingleSelectedComponent,
    selectSkipTransform,
    selectViewStatusHistoryComponent
} from '../../state/flow/flow.selectors';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs';
import { restoreViewport, zoomFit } from '../../state/transform/transform.actions';
import { ComponentType } from '../../../../state/shared';
import { initialState } from '../../state/flow/flow.reducer';
import { ContextMenuDefinitionProvider } from '../../../../ui/common/context-menu/context-menu.component';
import { CanvasContextMenu } from '../../service/canvas-context-menu.service';
import { getStatusHistoryAndOpenDialog } from '../../../../state/status-history/status-history.actions';
import { CanvasBase } from './canvas-base.component';

@Component({
    selector: 'fd-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class Canvas extends CanvasBase implements OnInit, OnDestroy {
    constructor(
        viewContainerRef: ViewContainerRef,
        store: Store<CanvasState>,
        canvasView: CanvasView,
        canvasContextMenu: CanvasContextMenu
    ) {
        super(viewContainerRef, store, canvasView, canvasContextMenu)
    }

    override ngOnInit(): void {
        super.ngOnInit();
    }

    override ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
