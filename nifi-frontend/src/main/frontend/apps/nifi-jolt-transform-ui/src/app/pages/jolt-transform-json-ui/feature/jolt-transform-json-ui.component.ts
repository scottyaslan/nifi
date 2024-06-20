/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-ignore
import js_beautify from 'js-beautify';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NiFiJoltTransformJsonUiState } from '../../../state';
import { Editor } from 'codemirror';
import { TextTip } from 'libs/shared/src/components/tooltips/text-tip/text-tip.component';
import {
    selectClientIdFromRoute,
    selectDisconnectedNodeAcknowledgedFromRoute,
    selectJoltTransformJsonUiState,
    selectProcessorDetails,
    selectProcessorIdFromRoute,
    selectRevisionFromRoute
} from '../state/jolt-transform-json-ui/jolt-transform-json-ui.selectors';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    loadProcessorDetails,
    resetJoltTransformJsonUiState,
    saveProperties,
    transformJoltSpec,
    validateJoltSpec
} from '../state/jolt-transform-json-ui/jolt-transform-json-ui.actions';
import { SavePropertiesRequest, ValidateJoltSpecRequest } from '../state/jolt-transform-json-ui';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isDefinedAndNotNull } from 'libs/shared/src';

const JS_BEAUTIFY_OPTIONS = {
    indent_size: 1,
    indent_char: '\t'
};

@Component({
    selector: 'jolt-transform-json-ui',
    templateUrl: './jolt-transform-json-ui.component.html',
    styleUrls: ['./jolt-transform-json-ui.component.scss']
})
export class JoltTransformJsonUi implements OnDestroy {
    editJoltTransformJSONProcessorForm: FormGroup;
    editor!: Editor;
    disableCSS: string = '';
    step = 0;
    joltTransformJsonUiState$ = this.store.select(selectJoltTransformJsonUiState);
    processorDetails$ = this.store.select(selectProcessorDetails);

    protected readonly TextTip = TextTip;

    private processorId$ = this.store.selectSignal(selectProcessorIdFromRoute);
    private revision$ = this.store.selectSignal(selectRevisionFromRoute);
    private clientId$ = this.store.selectSignal(selectClientIdFromRoute);
    private disconnectedNodeAcknowledged$ = this.store.selectSignal(selectDisconnectedNodeAcknowledgedFromRoute);

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<NiFiJoltTransformJsonUiState>
    ) {
        this.store
            .select(selectProcessorIdFromRoute)
            .pipe(
                isDefinedAndNotNull(),
                tap((processorId: string) => {
                    this.store.dispatch(
                        loadProcessorDetails({
                            processorId
                        })
                    );
                }),
                takeUntilDestroyed()
            )
            .subscribe();

        this.processorDetails$.pipe(isDefinedAndNotNull(), takeUntilDestroyed()).subscribe({
            next: (processorDetails: any) => {
                this.editJoltTransformJSONProcessorForm.setValue({
                    input: '',
                    specification: processorDetails.properties['Jolt Specification'],
                    transform: processorDetails.properties['Jolt Transform'],
                    customClass: processorDetails.properties['Custom Transformation Class Name'],
                    expressionLanguageAttributes: {},
                    modules: processorDetails.properties['Custom Module Directory']
                });

                if (
                    processorDetails.properties['Jolt Specification'] &&
                    processorDetails.properties['Jolt Transform']
                ) {
                    this.validateJoltSpec();
                }
            }
        });

        // build the form
        this.editJoltTransformJSONProcessorForm = this.formBuilder.group({
            input: new FormControl('', Validators.required),
            specification: new FormControl('', Validators.required),
            transform: new FormControl('', Validators.required),
            customClass: new FormControl(''),
            expressionLanguageAttributes: new FormControl({}), // TODO: Attributes
            modules: new FormControl('')
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetJoltTransformJsonUiState());
    }

    getJoltSpecOptions(): any {
        return {
            lineNumbers: true,
            mode: 'application/json',
            lint: true,
            matchBrackets: true,
            readOnly: false,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
            autoCloseBrackets: true,
            theme: 'nifi',
            extraKeys: {
                'Shift-Ctrl-F': () => {
                    this.formatSpecification();
                }
            }
        };
    }

    getExampleDataOptions(): any {
        return {
            lineNumbers: true,
            mode: 'application/json',
            lint: true,
            matchBrackets: true,
            readOnly: false,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
            autoCloseBrackets: true,
            theme: 'nifi',
            extraKeys: {
                'Shift-Ctrl-F': () => {
                    this.formatInput();
                }
            }
        };
    }

    getOutputOptions(): any {
        return {
            readOnly: true,
            lineNumbers: true,
            theme: 'nifi',
            lint: true
        };
    }

    preventDrag(event: MouseEvent): void {
        event.stopPropagation();
    }

    codeMirrorLoaded(codeEditor: any): void {
        this.editor = codeEditor.codeMirror;
        this.editJoltTransformJSONProcessorForm.controls['specification'].valueChanges.subscribe(() => {
            this.toggleEditor();
        });
    }

    saveProperties() {
        const payload: SavePropertiesRequest = {
            'Jolt Specification': this.editJoltTransformJSONProcessorForm.get('specification')?.value,
            'Jolt Transform': this.editJoltTransformJSONProcessorForm.get('transform')?.value,
            processorId: this.processorId$(),
            clientId: this.clientId$(),
            revision: this.revision$(),
            disconnectedNodeAcknowledged: this.disconnectedNodeAcknowledged$()
        };

        this.store.dispatch(
            saveProperties({
                request: payload
            })
        );
    }

    validateJoltSpec() {
        const payload: ValidateJoltSpecRequest = {
            customClass: this.editJoltTransformJSONProcessorForm.get('customClass')?.value,
            expressionLanguageAttributes: {}, // TODO: Attributes
            input: this.editJoltTransformJSONProcessorForm.get('input')?.value,
            modules: this.editJoltTransformJSONProcessorForm.get('modules')?.value,
            specification: this.editJoltTransformJSONProcessorForm.get('specification')?.value,
            transform: this.editJoltTransformJSONProcessorForm.get('transform')?.value
        };

        this.store.dispatch(
            validateJoltSpec({
                request: payload
            })
        );
    }

    transformJoltSpec() {
        const payload: ValidateJoltSpecRequest = {
            customClass: this.editJoltTransformJSONProcessorForm.get('customClass')?.value,
            expressionLanguageAttributes: {}, // TODO: Attributes
            input: this.editJoltTransformJSONProcessorForm.get('input')?.value,
            modules: this.editJoltTransformJSONProcessorForm.get('modules')?.value,
            specification: this.editJoltTransformJSONProcessorForm.get('specification')?.value,
            transform: this.editJoltTransformJSONProcessorForm.get('transform')?.value
        };

        this.store.dispatch(
            transformJoltSpec({
                request: payload
            })
        );
    }

    formatInput() {
        if (this.editJoltTransformJSONProcessorForm.get('input')) {
            const jsonValue = js_beautify(
                this.editJoltTransformJSONProcessorForm.get('input')?.value,
                JS_BEAUTIFY_OPTIONS
            );
            this.editJoltTransformJSONProcessorForm.setValue({
                customClass: this.editJoltTransformJSONProcessorForm.get('customClass')?.value,
                expressionLanguageAttributes: {},
                input: jsonValue,
                modules: this.editJoltTransformJSONProcessorForm.get('modules')?.value,
                specification: this.editJoltTransformJSONProcessorForm.get('specification')?.value,
                transform: this.editJoltTransformJSONProcessorForm.get('transform')?.value
            });
        }
    }

    formatSpecification() {
        if (this.editJoltTransformJSONProcessorForm.get('specification')) {
            const jsonValue = js_beautify(
                this.editJoltTransformJSONProcessorForm.get('specification')?.value,
                JS_BEAUTIFY_OPTIONS
            );
            this.editJoltTransformJSONProcessorForm.setValue({
                customClass: this.editJoltTransformJSONProcessorForm.get('customClass')?.value,
                expressionLanguageAttributes: {},
                input: this.editJoltTransformJSONProcessorForm.get('input')?.value,
                modules: this.editJoltTransformJSONProcessorForm.get('modules')?.value,
                specification: jsonValue,
                transform: this.editJoltTransformJSONProcessorForm.get('transform')?.value
            });
        }
    }

    setStep(index: number) {
        this.step = index;
    }

    private toggleEditor() {
        const transform = this.editJoltTransformJSONProcessorForm.get('transform')?.value;

        if (transform == 'jolt-transform-sort') {
            this.editor.setOption('readOnly', 'nocursor');
            this.disableCSS = 'trans';
        } else {
            this.editor.setOption('readOnly', false);
            this.disableCSS = '';
        }
    }
}
