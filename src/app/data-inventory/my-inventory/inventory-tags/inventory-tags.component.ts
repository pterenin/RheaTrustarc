import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { Observable, Subscription, of } from 'rxjs';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { map } from 'rxjs/operators';
import { DataInventoryService } from '../../data-inventory.service';
import { CanDeactivateTabInterface } from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { TagGroupInterface } from '../../../shared/models/tags.model';

@Component({
  selector: 'ta-inventory-tags',
  templateUrl: './inventory-tags.component.html',
  styleUrls: ['./inventory-tags.component.scss']
})
export class InventoryTagsComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() baseDomainId;
  @Input() baseDomainType: BaseDomainTypeEnum;
  @Input() preselectedTags: TagGroupInterface[] = [];
  @ViewChild(TagsSelectorComponent) tagsSelector: TagsSelectorComponent;
  @Output() selectedTagsChange = new EventEmitter<TagGroupInterface[]>();

  public tagFormsGroup: FormGroup;
  private _onCancelSubscription$: Subscription;
  private cancelChanges: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataInventoryService: DataInventoryService
  ) {
    this.tagFormsGroup = this.formBuilder.group({ placeholder: '' });
  }

  ngOnInit() {
    this.onCancelChanges();
  }

  public handleSelectedTagsChange(event) {
    this.selectedTagsChange.emit(event);
  }

  public save(): Observable<any> {
    if (this.cancelChanges) {
      return of(true);
    }
    return this.tagsSelector.save();
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.cancelChanges = true;
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.onCancelChangesSubscriber();
  }

  canDeactivateTab(): Observable<boolean> {
    return this.save().pipe(map(() => true));
  }
}
