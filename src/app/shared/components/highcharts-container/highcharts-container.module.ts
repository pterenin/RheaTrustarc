import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsContainerComponent } from './highcharts-container.component';
import { FlowchartContainerComponent } from './flowchart-container/flowchart-container.component';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaToggleSwitchModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { HighchartsChartModule } from 'highcharts-angular';
import { MapContainerComponent } from './map-container/map-container.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HighchartsContainerComponent,
    FlowchartContainerComponent,
    MapContainerComponent
  ],
  imports: [
    CommonModule,
    TaTabsetModule,
    HighchartsChartModule,
    TaPopoverModule,
    TaSvgIconModule,
    TaTooltipModule,
    TaToggleSwitchModule,
    TaTabsetModule,
    TaToggleSwitchModule,
    TaAccordionModule,
    TaBadgeModule,
    FormsModule
  ],
  exports: [HighchartsContainerComponent]
})
export class HighchartsContainerModule {}
