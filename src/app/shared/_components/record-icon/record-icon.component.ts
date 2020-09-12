import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ThirdPartyType } from 'src/app/app.constants';

const CLASSNAMES = 'd-flex ta-record-icon-';

@Component({
  selector: 'ta-record-icon',
  templateUrl: './record-icon.component.html',
  styleUrls: ['./record-icon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordIconComponent implements OnInit {
  public readonly RECORD_TYPE = ThirdPartyType;

  @HostBinding('class') className: string;
  @HostBinding('style.backgroundColor') backgroundColor: string;
  @HostBinding('style.borderColor') borderColor: string;
  @HostBinding('style.color') color: string;

  @Input() type: string;
  @Input() small: boolean;
  @Input() class: string;

  public initial: string;

  constructor() {}

  ngOnInit() {
    this.className = CLASSNAMES + (this.type || '').toLowerCase();

    this.className =
      this.className +
      (this.small ? ' ta-record-icon-sm' : '') +
      (this.class ? ` ${this.class}` : '');

    this.getInitial(this.type);
  }

  public getInitial(type: string) {
    switch (type) {
      case ThirdPartyType.PRIMARY_ENTITY:
        this.setStyles('#f8fcf5', '#dff3d3', '#387515', 'P');
        break;
      case ThirdPartyType.COMPANY_AFFILIATE:
        this.setStyles('#e5edf9', '#ccdcf4', '#0052cc', 'C');
        break;
      case ThirdPartyType.VENDOR:
        this.setStyles('#fff6e5', '#ffeecc', '#995400', 'V');
        break;
      case ThirdPartyType.PARTNER:
        this.setStyles('#f8f7fc', '#efedf8', '#3c3273', 'P');
        break;
      case ThirdPartyType.CUSTOMER:
        this.setStyles('#fdf6ff', '#efdaf0', '#820b87', 'C');
        break;
      case ThirdPartyType.SERVICE_PROVIDER:
        this.setStyles('#e9f2fe', '#d4e6fe', '#1a4e97', 'S');
        break;
      case ThirdPartyType.BUSINESS_ASSOCIATE:
        this.setStyles('#fbeae8', '#f8d5d2', '#851b13', 'B');
        break;
      default:
        this.setStyles('#f1f1f1', '#dddddd', '#595959', 'O');
    }
  }

  private setStyles(
    backgroundColor: string,
    borderColor: string,
    color: string,
    initial: string
  ) {
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.color = color;
    this.initial = initial;
  }
}
