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

import { ComponentReferenceEntity, ComponentType } from '../../../../state/shared';

export const remotePortsFeatureKey = 'remotePortListing';

export interface PortSummary {
    batchSettings: {
        count?: number;
        size?: number;
        duration?: number;
    };
    comments: string;
    concurrentlySchedulableTaskCount: number;
    connected: boolean;
    exists: boolean;
    groupId: string;
    id: string;
    name: string;
    targetId: string;
    targetRunning: boolean;
    transmitting: boolean;
    useCompression: boolean;
    versionedComponentId: string;
    type?: ComponentType.InputPort | ComponentType.OutputPort;
}

export interface EditRemotePortDialogRequest {
    id: string;
    port: PortSummary;
    rpg: ComponentReferenceEntity;
}

export interface ToggleRemotePortTransmissionRequest {
    rpg: ComponentReferenceEntity;
    port: PortSummary;
}

export interface LoadRemotePortsRequest {
    rpgId: string;
}

export interface LoadRemotePortsResponse {
    ports: PortSummary[];
    loadedTimestamp: string;
    rpg: ComponentReferenceEntity;
}

export interface ConfigureRemotePortRequest {
    id: string;
    uri: string;
    payload: any;
    postUpdateNavigation?: string[];
}

export interface ConfigureRemotePortSuccess {
    id: string;
    port: any;
}

export interface SelectRemotePortRequest {
    rpgId: string;
    id: string;
}

export interface RemotePortsState {
    ports: PortSummary[];
    saving: boolean;
    rpg: ComponentReferenceEntity | null;
    loadedTimestamp: string;
    status: 'pending' | 'loading' | 'success';
}
