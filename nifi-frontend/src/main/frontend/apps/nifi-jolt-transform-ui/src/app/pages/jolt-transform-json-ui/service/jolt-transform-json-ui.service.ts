/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SavePropertiesRequest, ValidateJoltSpecRequest } from '../state/jolt-transform-json-ui';

@Injectable({ providedIn: 'root' })
export class JoltTransformJsonUiService {
    private static readonly API: string = '../nifi-jolt-transform-json-ui-2.0.0-SNAPSHOT';

    constructor(private httpClient: HttpClient) {}

    getProcessorDetails(id: string): Observable<any> {
        return this.httpClient.get(
            `${JoltTransformJsonUiService.API}/api/standard/processor/details?processorId=${id}`
        );
    }

    saveProperties(request: SavePropertiesRequest): Observable<any> {
        return this.httpClient.put(
            `${JoltTransformJsonUiService.API}/api/standard/processor/properties?processorId=${request.processorId}&revisionId=${request.revision}&clientId=${request.clientId}&disconnectedNodeAcknowledged=${request.disconnectedNodeAcknowledged}`,
            {
                'Jolt Specification': request['Jolt Specification'],
                'Jolt Transform': request['Jolt Transform']
            }
        );
    }

    validateJoltSpec(payload: ValidateJoltSpecRequest): Observable<any> {
        return this.httpClient.post(`${JoltTransformJsonUiService.API}/api/standard/transformjson/validate`, payload);
    }

    transformJoltSpec(payload: ValidateJoltSpecRequest): Observable<any> {
        return this.httpClient.post(`${JoltTransformJsonUiService.API}/api/standard/transformjson/execute`, payload);
    }
}
