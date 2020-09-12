import { Component, OnInit, ViewEncapsulation } from '@angular/core';

export interface EntityTypeElement {
  name: string;
  color: string;
}

export const Entity = {
  // [i18n-tobeinternationalized]
  DATA_SUBJECT: { name: 'Data\nSubject', color: '#214676' },
  // [i18n-tobeinternationalized]
  IT_SYSTEM_3RD_PARTY: { name: `System\n(3rd Party)`, color: '#4294B6' },
  // [i18n-tobeinternationalized]
  IT_SYSTEM_1ST_PARTY: { name: `System\n(1st Party)`, color: '#5FC322' },
  // [i18n-tobeinternationalized]
  DATA_RECIPIENT: { name: 'Data\nRecipient', color: '#D7006D' }
};

export const MultiEntity = {
  type: 'MULTI_ENTITY',
  value: 'Multiple\nEntities',
  color: '#FF7700'
};
@Component({
  selector: 'ta-highcharts-container',
  templateUrl: './highcharts-container.component.html',
  styleUrls: ['./highcharts-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HighchartsContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
