import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInventoryService } from '../data-inventory.service';
import { MyInventoryService } from './my-inventory.service';
import { MyInventoryComponent } from './my-inventory.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaTableModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTooltipModule,
  TaPopoverModule,
  TaTagsModule,
  TaPaginationModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageWrapperModule } from '../../shared/components/page-wrapper/page-wrapper.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
import { ThirdPartyService } from 'src/app/shared/services/third-party/third-party.service';
import { ItSystemService } from 'src/app/shared/services/it-system/it-system.service';
import { DatagridService } from '@trustarc/ui-toolkit';
import { CompanyAffiliateService } from 'src/app/shared/services/company-affiliate/company-affiliate.service';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { RiskIndicatorModule } from 'src/app/shared/components/risk-indicator/risk-indicator.module';
// prettier-ignore
import {
  ViewRowsDropdownModule
} from '../../shared/components/record-datagrid/datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { TrafficSignalRiskIndicatorModule } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.module';

describe('MyInventoryComponent', () => {
  let component: MyInventoryComponent;
  let fixture: ComponentFixture<MyInventoryComponent>;
  let dataInventoryService: DataInventoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyInventoryComponent],
      imports: [
        CustomFiltersModule,
        HttpClientModule,
        HttpClientTestingModule,
        PageWrapperModule,
        RouterTestingModule,
        TaDropdownModule,
        TaPaginationModule,
        TaPopoverModule,
        TaSvgIconModule,
        TaTagsModule,
        TaTableModule,
        TaTooltipModule,
        InputLocationModule,
        RiskIndicatorModule,
        ViewRowsDropdownModule,
        TrafficSignalRiskIndicatorModule
      ],
      providers: [
        CompanyAffiliateService,
        DataInventoryService,
        MyInventoryService,
        DatagridService,
        ItSystemService,
        ThirdPartyService,
        ToastService
      ]
    }).compileComponents();

    dataInventoryService = TestBed.get(DataInventoryService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get type class on request', () => {
    expect(component.getTypeTheme('COMPANY_AFFILIATE')).toBe('inverted-green');
    expect(component.getTypeTheme('PRIMARY_ENTITY')).toBe('inverted-green');
    expect(component.getTypeTheme('IT_SYSTEM')).toBe('inverted-blue');
    expect(component.getTypeTheme('VENDOR')).toBe('inverted-orange');
    expect(component.getTypeTheme('PARTNER')).toBe('inverted-orange');
  });

  /* Not MVP
  it('should get rules icon based on request parameter', () => {
    expect(component.getIcon(true)).toBe('success-circle');
    expect(component.getIcon(false)).toBe('error-cirlce');
  });
  */

  it('should get tooltip based on request parameter', () => {
    expect(component.getTooltip(true)).toBe('Rules Fields Complete');
    expect(component.getTooltip(false)).toBe('Rules Fields Incomplete');
  });
});
