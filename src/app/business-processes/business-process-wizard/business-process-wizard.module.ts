import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  TaStepsModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaAccordionModule,
  TaTooltipModule,
  TaPopoverModule,
  TaTabsetModule,
  TaTableModule,
  TaDropdownModule,
  TaModalModule,
  TaCheckboxModule,
  TaBadgeModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../../shared/components/dropdown/dropdown-field.module';

import { BusinessProcessWizardRoutingModule } from './business-process-wizard-routing.module';
import { BusinessProcessWizardComponent } from './business-process-wizard.component';
import { SystemsSelectionComponent } from './systems-selection/systems-selection.component';

import {
  BusinessProcessWizardHeaderModule,
  BusinessProcessWizardFooterComponent,
  SystemRecordFilterComponent,
  SystemRecordTabProcessingPurposeComponent,
  SystemRecordTabDataElementComponent,
  SystemRecordTabDataSubjectComponent,
  SystemRecordTabHostingLocationsComponent,
  SystemRecordNoneComponent,
  SystemRecordInfoComponent,
  SelectedSystemRecordFilterComponent,
  AddEditOwningOrganizationContactsModalComponent,
  OwingOrganizationsContactsComponent
} from './shared';

import { RecordIconModule } from 'src/app/shared/_components/record-icon/record-icon.module';
import { LocationModalContentModule } from 'src/app/shared/components/location-modal-content/location-modal-content.module';
import { SearchFieldModule } from 'src/app/shared/_components/search-field/search-field.module';
import { RouterModule } from '@angular/router';
import { ModalsModule } from './shared/components/modals/modals.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { CollectionPipeModule } from '../../shared/pipes/collection/collection.module';
import { ArrayPipeModule } from '../../shared/pipes/array/array.module';
import { LocationPipeModule } from '../../shared/pipes/location/location.module';
import { DataSubjectPipeModule } from '../../shared/pipes/data-subject/data-subject.module';
import { DataElementPipeModule } from '../../shared/pipes/data-element/data-element.module';
import { ProcessingPurposePipeModule } from '../../shared/pipes/processing-purpose/processing-purpose.module';
import { SearchByPipeModule } from 'src/app/shared/_pipes/search-by/search-by.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
import { TabsetGuardedModule } from '../../shared/components/tabset-guarded/tabset-guarded.module';
import { DataInventoryModule } from '../../data-inventory/data-inventory.module';
import { RiskFieldIndicatorModule } from '../../shared/components/risk-field-indicator/risk-field-indicator.module';
import { CustomIconMaximizeComponent } from './shared/components/custom-icon-maximize/custom-icon-maximize.component';
import { CustomIconMinimizeComponent } from './shared/components/custom-icon-minimize/custom-icon-minimize.component';
import { AuthInterceptorService } from '../../shared/services/auth/auth-interceptor.service';
import { SystemRecordAddComponent } from './shared/components/system-record-add/system-record-add.component';
// tslint:disable-next-line:max-line-length
import { SystemRecordAddThirdPartyComponent } from './shared/components/system-record-add-third-party/system-record-add-third-party.component';
// tslint:disable-next-line:max-line-length
import { SystemRecordAddCompanyAffiliateComponent } from './shared/components/system-record-add-company-affiliate/system-record-add-company-affiliate.component';
import { DetailsComponent } from './details/details.component';
import { BusinessProcessDetailComponent } from './shared/components/business-process-detail/business-process-detail.component';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';

@NgModule({
  declarations: [
    BusinessProcessWizardComponent,
    SystemsSelectionComponent,
    BusinessProcessWizardFooterComponent,
    SystemRecordFilterComponent,
    SystemRecordNoneComponent,
    SystemRecordInfoComponent,
    SystemRecordAddComponent,
    SystemRecordAddThirdPartyComponent,
    SystemRecordAddCompanyAffiliateComponent,
    SystemRecordTabProcessingPurposeComponent,
    SystemRecordTabDataElementComponent,
    SystemRecordTabDataSubjectComponent,
    SystemRecordTabHostingLocationsComponent,
    SelectedSystemRecordFilterComponent,
    CustomIconMaximizeComponent,
    CustomIconMinimizeComponent,
    DetailsComponent,
    OwingOrganizationsContactsComponent,
    BusinessProcessDetailComponent,
    AddEditOwningOrganizationContactsModalComponent
  ],
  imports: [
    BusinessProcessWizardHeaderModule,
    HttpClientModule,
    CommonModule,
    TaStepsModule,
    TaButtonsModule,
    TaAccordionModule,
    TaTooltipModule,
    TaPopoverModule,
    TaSvgIconModule,
    TaTabsetModule,
    TaTableModule,
    TaDropdownModule,
    TaModalModule,
    TaCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    RecordIconModule,
    BusinessProcessWizardRoutingModule,
    SearchFieldModule,
    LocationModalContentModule,
    RouterModule,
    ModalsModule,
    ReplacePipeModule,
    CollectionPipeModule,
    ArrayPipeModule,
    LocationPipeModule,
    DataSubjectPipeModule,
    DataElementPipeModule,
    ProcessingPurposePipeModule,
    SearchByPipeModule,
    FilterByArrayPipeModule,
    TabsetGuardedModule,
    DataInventoryModule,
    RiskFieldIndicatorModule,
    DropdownFieldModule,
    NgxSkeletonLoaderModule,
    BaseRecordFileUploadModule,
    TaBadgeModule,
    TagsSelectorModule,
    TaTagsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class BusinessProcessWizardModule {}
