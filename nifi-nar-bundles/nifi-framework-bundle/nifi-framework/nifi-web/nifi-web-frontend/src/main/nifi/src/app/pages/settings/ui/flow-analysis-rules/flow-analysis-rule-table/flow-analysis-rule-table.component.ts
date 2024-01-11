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

import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FlowAnalysisRuleEntity } from '../../../state/flow-analysis-rules';
import { TextTip } from '../../../../../ui/common/tooltips/text-tip/text-tip.component';
import { BulletinsTip } from '../../../../../ui/common/tooltips/bulletins-tip/bulletins-tip.component';
import { ValidationErrorsTip } from '../../../../../ui/common/tooltips/validation-errors-tip/validation-errors-tip.component';
import { NiFiCommon } from '../../../../../service/nifi-common.service';
import { BulletinsTipInput, TextTipInput, ValidationErrorsTipInput } from '../../../../../state/shared';
import { NifiTooltipDirective } from '../../../../../ui/common/tooltips/nifi-tooltip.directive';
import { ReportingTaskEntity } from '../../../state/reporting-tasks';

@Component({
    selector: 'flow-analysis-rule-table',
    standalone: true,
    templateUrl: './flow-analysis-rule-table.component.html',
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        NgIf,
        NgClass,
        NifiTooltipDirective,
        RouterLink
    ],
    styleUrls: ['./flow-analysis-rule-table.component.scss', '../../../../../../assets/styles/listing-table.scss']
})
export class FlowAnalysisRuleTable implements AfterViewInit {
    @Input() set flowAnalysisRules(FlowAnalysisRuleEntities: FlowAnalysisRuleEntity[]) {
        this.dataSource = new MatTableDataSource<FlowAnalysisRuleEntity>(FlowAnalysisRuleEntities);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (data: FlowAnalysisRuleEntity, displayColumn: string) => {
            if (displayColumn == 'name') {
                return this.formatType(data);
            } else if (displayColumn == 'type') {
                return this.formatType(data);
            } else if (displayColumn == 'bundle') {
                return this.formatBundle(data);
            } else if (displayColumn == 'state') {
                return this.formatState(data);
            }
            return '';
        };
    }
    @Input() selectedFlowAnalysisRuleId!: string;
    @Input() definedByCurrentGroup!: (entity: FlowAnalysisRuleEntity) => boolean;

    @Output() selectFlowAnalysisRule: EventEmitter<FlowAnalysisRuleEntity> = new EventEmitter<FlowAnalysisRuleEntity>();
    @Output() deleteFlowAnalysisRule: EventEmitter<FlowAnalysisRuleEntity> = new EventEmitter<FlowAnalysisRuleEntity>();
    @Output() configureFlowAnalysisRule: EventEmitter<FlowAnalysisRuleEntity> =
        new EventEmitter<FlowAnalysisRuleEntity>();
    @Output() enableFlowAnalysisRule: EventEmitter<FlowAnalysisRuleEntity> = new EventEmitter<FlowAnalysisRuleEntity>();
    @Output() disableFlowAnalysisRule: EventEmitter<FlowAnalysisRuleEntity> =
        new EventEmitter<FlowAnalysisRuleEntity>();

    protected readonly TextTip = TextTip;
    protected readonly BulletinsTip = BulletinsTip;
    protected readonly ValidationErrorsTip = ValidationErrorsTip;

    displayedColumns: string[] = ['moreDetails', 'name', 'type', 'bundle', 'state', 'actions'];
    dataSource: MatTableDataSource<FlowAnalysisRuleEntity> = new MatTableDataSource<FlowAnalysisRuleEntity>();

    @ViewChild(MatSort) sort!: MatSort;

    constructor(private nifiCommon: NiFiCommon) {}

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    canRead(entity: FlowAnalysisRuleEntity): boolean {
        return entity.permissions.canRead;
    }

    canWrite(entity: FlowAnalysisRuleEntity): boolean {
        return entity.permissions.canWrite;
    }

    canOperate(entity: FlowAnalysisRuleEntity): boolean {
        if (this.canWrite(entity)) {
            return true;
        }
        return !!entity.operatePermissions?.canWrite;
    }

    hasComments(entity: FlowAnalysisRuleEntity): boolean {
        return !this.nifiCommon.isBlank(entity.component.comments);
    }

    getCommentsTipData(entity: FlowAnalysisRuleEntity): TextTipInput {
        return {
            text: entity.component.comments
        };
    }

    hasErrors(entity: FlowAnalysisRuleEntity): boolean {
        return !this.nifiCommon.isEmpty(entity.component.validationErrors);
    }

    getValidationErrorsTipData(entity: FlowAnalysisRuleEntity): ValidationErrorsTipInput {
        return {
            isValidating: entity.status.validationStatus === 'VALIDATING',
            validationErrors: entity.component.validationErrors
        };
    }

    hasBulletins(entity: FlowAnalysisRuleEntity): boolean {
        return !this.nifiCommon.isEmpty(entity.bulletins);
    }

    getBulletinsTipData(entity: FlowAnalysisRuleEntity): BulletinsTipInput {
        return {
            bulletins: entity.bulletins
        };
    }

    getStateIcon(entity: FlowAnalysisRuleEntity): string {
        if (entity.status.validationStatus === 'VALIDATING') {
            return 'validating fa fa-spin fa-circle-o-notch';
        } else if (entity.status.validationStatus === 'INVALID') {
            return 'invalid fa fa-warning';
        } else {
            if (entity.status.runStatus === 'DISABLED') {
                return 'disabled icon icon-enable-false';
            } else if (entity.status.runStatus === 'DISABLING') {
                return 'disabled icon icon-enable-false';
            } else if (entity.status.runStatus === 'ENABLED') {
                return 'enabled fa fa-flash';
            } else if (entity.status.runStatus === 'ENABLING') {
                return 'enabled fa fa-flash';
            }
        }
        return '';
    }

    formatState(entity: FlowAnalysisRuleEntity): string {
        if (entity.status.validationStatus === 'VALIDATING') {
            return 'Validating';
        } else if (entity.status.validationStatus === 'INVALID') {
            return 'Invalid';
        } else {
            if (entity.status.runStatus === 'DISABLED') {
                return 'Disabled';
            } else if (entity.status.runStatus === 'DISABLING') {
                return 'Disabling';
            } else if (entity.status.runStatus === 'ENABLED') {
                return 'Enabled';
            } else if (entity.status.runStatus === 'ENABLING') {
                return 'Enabling';
            }
        }
        return '';
    }

    formatType(entity: FlowAnalysisRuleEntity): string {
        return this.nifiCommon.formatType(entity.component);
    }

    formatBundle(entity: FlowAnalysisRuleEntity): string {
        return this.nifiCommon.formatBundle(entity.component.bundle);
    }

    isDisabled(entity: FlowAnalysisRuleEntity): boolean {
        return entity.status.runStatus === 'DISABLED';
    }

    isEnabledOrEnabling(entity: FlowAnalysisRuleEntity): boolean {
        return entity.status.runStatus === 'ENABLED' || entity.status.runStatus === 'ENABLING';
    }

    hasActiveThreads(entity: ReportingTaskEntity): boolean {
        return entity.status?.activeThreadCount > 0;
    }

    canConfigure(entity: FlowAnalysisRuleEntity): boolean {
        return this.canRead(entity) && this.canWrite(entity);
    }

    configureClicked(entity: FlowAnalysisRuleEntity, event: MouseEvent): void {
        event.stopPropagation();
        this.configureFlowAnalysisRule.next(entity);
    }

    canEnable(entity: FlowAnalysisRuleEntity): boolean {
        const userAuthorized: boolean = this.canRead(entity) && this.canOperate(entity);
        return userAuthorized && this.isDisabled(entity) && entity.status.validationStatus === 'VALID';
    }

    enabledClicked(entity: FlowAnalysisRuleEntity, event: MouseEvent): void {
        this.enableFlowAnalysisRule.next(entity);
    }

    canDisable(entity: FlowAnalysisRuleEntity): boolean {
        const userAuthorized: boolean = this.canRead(entity) && this.canOperate(entity);
        return userAuthorized && this.isEnabledOrEnabling(entity);
    }

    disableClicked(entity: FlowAnalysisRuleEntity, event: MouseEvent): void {
        this.disableFlowAnalysisRule.next(entity);
    }

    canChangeVersion(entity: FlowAnalysisRuleEntity): boolean {
        return (
            this.isDisabled(entity) &&
            this.canRead(entity) &&
            this.canWrite(entity) &&
            entity.component.multipleVersionsAvailable === true
        );
    }

    canDelete(entity: FlowAnalysisRuleEntity): boolean {
        const canWriteParent: boolean = true; // TODO canWriteFlowAnalysisRuleParent(dataContext)
        return this.isDisabled(entity) && this.canRead(entity) && this.canWrite(entity) && canWriteParent;
    }

    deleteClicked(entity: FlowAnalysisRuleEntity): void {
        this.deleteFlowAnalysisRule.next(entity);
    }

    canViewState(entity: FlowAnalysisRuleEntity): boolean {
        return this.canRead(entity) && this.canWrite(entity) && entity.component.persistsState === true;
    }

    canManageAccessPolicies(): boolean {
        // TODO
        return false;
    }

    select(entity: FlowAnalysisRuleEntity): void {
        this.selectFlowAnalysisRule.next(entity);
    }

    isSelected(entity: FlowAnalysisRuleEntity): boolean {
        if (this.selectedFlowAnalysisRuleId) {
            return entity.id == this.selectedFlowAnalysisRuleId;
        }
        return false;
    }
}
