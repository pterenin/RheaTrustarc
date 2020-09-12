import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from '../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { ToastService } from '@trustarc/ui-toolkit';
import { getRouteParamObservable } from '../shared/utils/route-utils';
import { BusinessProcessService } from '../shared/services/business-process/business-process.service';

@Component({
  selector: 'ta-business-processes',
  templateUrl: './business-processes.component.html',
  styleUrls: ['./business-processes.component.scss']
})
export class BusinessProcessesComponent {}
