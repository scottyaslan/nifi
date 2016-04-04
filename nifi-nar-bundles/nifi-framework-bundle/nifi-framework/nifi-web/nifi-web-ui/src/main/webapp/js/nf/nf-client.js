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
        'nf-client'],
    function(nfCommon,
             nfClient) {
        function Client() {
            this.version = -1;
            this.clientId = null;
        };

        /**
         * Gets the current revision.
         */
        Client.prototype.getRevision = function () {
            return {
                version: this.version,
                clientId: this.clientId
            };
        };

        /**
         * Sets the current revision.
         *
         * @argument {integer} revision     The revision
         */
        Client.prototype.setRevision = function (revision) {
            // ensure a value was returned
            if (nfCommon.isDefinedAndNotNull(revision.version)) {
                if (nfCommon.isDefinedAndNotNull(this.version)) {
                    // if the client version was already set, ensure
                    // the new value is greater
                    if (revision.version > this.version) {
                        this.version = revision.version;
                    }
                } else {
                    // otherwise just set the value
                    this.version = revision.version;
                }
            }

            // ensure a value was returned
            if (nfCommon.isDefinedAndNotNull(revision.clientId)) {
                this.clientId = revision.clientId;
            }
        };

        return new Client();
    }
);