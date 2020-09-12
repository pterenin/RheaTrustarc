import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationThreeButtonComponent } from './modal-confirmation-three-button.component';
import {
  TaActiveModal,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('ModalConfirmationThreeButtonComponent', () => {
  let component: ModalConfirmationThreeButtonComponent;
  let fixture: ComponentFixture<ModalConfirmationThreeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationThreeButtonComponent],
      imports: [TaSvgIconModule, TaTableModule, TaTooltipModule],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationThreeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
