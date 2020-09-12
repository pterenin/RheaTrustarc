import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessProcessesRoutingModule } from './business-processes-routing.module';
import { BusinessProcessesComponent } from './business-processes.component';
import { AllBusinessProcessesComponent } from './all-bp/all-business-processes.component';
import { RecordDatagridModule } from '../shared/components/record-datagrid/record-datagrid.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPaginationModule,
  TaAccordionModule
} from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridHeaderModule } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { ViewBpComponent } from './view-bp/view-bp.component';
import { AuditTableModule } from '../shared/components/audit-table/audit-table.module';
import { AssessmentsModule } from '../shared/components/assessments/assessments.module';
import { DataInventoryService } from '../data-inventory/data-inventory.service';
import { AuditAccordionModule } from '../shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from '../shared/components/risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [
    BusinessProcessesComponent,
    AllBusinessProcessesComponent,
    ViewBpComponent
  ],
  imports: [
    AuditTableModule,
    AssessmentsModule,
    BusinessProcessesRoutingModule,
    CommonModule,
    PageWrapperModule,
    TaAccordionModule,
    TaButtonsModule,
    TaCheckboxModule,
    TranslateModule,
    RecordDatagridModule,
    TaDropdownModule,
    DatagridHeaderModule,
    TaPaginationModule,
    AuditAccordionModule,
    RiskFieldIndicatorModule
  ],
  providers: [DataInventoryService]
})
export class BusinessProcessesModule {}
