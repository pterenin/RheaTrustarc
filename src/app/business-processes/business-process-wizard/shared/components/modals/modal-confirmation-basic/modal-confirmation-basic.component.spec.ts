import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationBasicComponent } from './modal-confirmation-basic.component';
import {
  TaActiveModal,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('ModalConfirmationBasicComponent', () => {
  let component: ModalConfirmationBasicComponent;
  let fixture: ComponentFixture<ModalConfirmationBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationBasicComponent],
      imports: [TaSvgIconModule, TaTableModule, TaTooltipModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
