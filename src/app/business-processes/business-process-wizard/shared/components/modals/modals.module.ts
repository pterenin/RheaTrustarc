import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmationBasicComponent } from './modal-confirmation-basic/modal-confirmation-basic.component';
import { ModalConfirmationThreeButtonComponent } from './modal-confirmation-three-button/modal-confirmation-three-button.component';
import {
  TaSvgIconModule,
  TaButtonsModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent
  ],
  imports: [
    CommonModule,
    TaSvgIconModule,
    TaButtonsModule,
    TaTableModule,
    TaTooltipModule
  ],
  exports: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent
  ],
  entryComponents: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent
  ]
})
export class ModalsModule {}
