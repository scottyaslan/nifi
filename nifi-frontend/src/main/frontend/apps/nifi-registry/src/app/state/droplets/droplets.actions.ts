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

import { createAction, props } from '@ngrx/store';
import {
    DeleteDropletRequest,
    Droplet,
    ImportDropletDialog,
    ImportDropletRequest,
    ImportFlowVersionRequest,
    LoadDropletsResponse
} from '.';
import { ErrorContext } from '../error';

export const loadDroplets = createAction('[Droplets] Load Droplets');

export const loadDropletsSuccess = createAction(
    '[Droplets] Load Droplets User Success',
    props<{ response: LoadDropletsResponse }>()
);

export const openDeleteDropletDialog = createAction(
    '[Droplets] Open Delete Droplet Dialog',
    props<{ request: DeleteDropletRequest }>()
);

export const deleteDroplet = createAction('[Droplets] Delete Droplet', props<{ request: DeleteDropletRequest }>());

export const deleteDropletSuccess = createAction('[Droplets] Delete Droplet Success', props<{ response: Droplet }>());

export const openImportNewFlowDialog = createAction(
    '[Droplets] Open Import New Resource Dialog',
    props<{ request: ImportDropletDialog }>()
);

export const createNewFlow = createAction('[Droplets] Create New Resource', props<{ request: ImportDropletRequest }>());

export const importNewFlowVersion = createAction(
    '[Droplets] Import New Resource Version',
    props<{ request: ImportFlowVersionRequest }>()
);

export const createNewFlowSuccess = createAction(
    `[Droplets] Create New Resource Success`,
    props<{ response: Droplet; request: ImportFlowVersionRequest }>()
);

export const importNewFlowVersionSuccess = createAction(
    '[Droplets] Import New Resource Version Success',
    props<{ response: any }>()
);

export const openImportNewFlowVersionDialog = createAction(
    '[Droplets] Open Import New Resource Version Dialog',
    props<{ request: { droplet: Droplet } }>()
);

export const openExportFlowVersionDialog = createAction(
    `[Droplets] Open Export Resource Version Dialog`,
    props<{ request: { droplet: Droplet } }>()
);

export const exportFlowVersion = createAction(
    `[Droplets] Export Resource Version`,
    props<{ request: { droplet: Droplet; version: number } }>()
);

export const exportFlowVersionSuccess = createAction(
    `[Droplets] Export Resource Version Success`,
    props<{ response: any }>()
);

export const openFlowVersionsDialog = createAction(
    `[Droplets] Open Resource Versions Dialog`,
    props<{ request: { droplet: Droplet } }>()
);

export const selectDroplet = createAction(`[Droplets] Select Droplet`, props<{ request: { id: string } }>());

export const dropletsBannerError = createAction(`[Droplets] Banner Error`, props<{ errorContext: ErrorContext }>());

// Utility no-op action for effects that need to emit a valid action on success. This allows dialogs to add global
// context errors when the dialog is unable to async GET the data it needs in order to open.
export const noOp = createAction('[Droplets] No Op');
