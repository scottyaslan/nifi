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

import { inject } from '@angular/core';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, NEVER } from 'rxjs';
import { NiFiState } from '../../state';
import { Store } from '@ngrx/store';
import { stopCurrentUserPolling } from '../../state/current-user/current-user.actions';
import { stopProcessGroupPolling } from '../../pages/flow-designer/state/flow/flow.actions';
import { stopClusterSummaryPolling } from '../../state/cluster-summary/cluster-summary.actions';
import { fullScreenError } from 'libs/shared/src';

export const pollingInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const store: Store<NiFiState> = inject(Store<NiFiState>);

    return next(request).pipe(
        catchError((errorResponse) => {
            if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 0) {
                store.dispatch(stopCurrentUserPolling());
                store.dispatch(stopProcessGroupPolling());
                store.dispatch(stopClusterSummaryPolling());

                store.dispatch(
                    fullScreenError({
                        errorDetail: {
                            title: 'Unable to communicate with NiFi',
                            message: 'Please ensure the application is running and check the logs for any errors.'
                        }
                    })
                );

                return NEVER;
            } else {
                throw errorResponse;
            }
        })
    );
};
