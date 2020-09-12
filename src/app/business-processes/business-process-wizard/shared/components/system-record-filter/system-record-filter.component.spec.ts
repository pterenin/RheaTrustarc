import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { SystemRecordFilterComponent } from './system-record-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SystemRecordFilterComponent', () => {
  let component: SystemRecordFilterComponent;
  let fixture: ComponentFixture<SystemRecordFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordFilterComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaSvgIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
