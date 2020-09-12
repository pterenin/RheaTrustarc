import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSystemRecordFilterComponent } from './selected-system-record-filter.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';

describe('SelectedSystemRecordFilterComponent', () => {
  let component: SelectedSystemRecordFilterComponent;
  let fixture: ComponentFixture<SelectedSystemRecordFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedSystemRecordFilterComponent],
      imports: [
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSystemRecordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
