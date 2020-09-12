import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { CategoricalViewComponent } from 'src/app/shared/components/categorical-view/categorical-view.component';
import { DetailsFormService } from './details-form.service';
import { tap, map, first, flatMap, catchError } from 'rxjs/operators';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';
import { Subscription, Observable, of } from 'rxjs';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  CompanyAffiliateDetailsGetResponse,
  CompanyAffiliateDetailsPutRequest,
  CountrySelectBoxInterface,
  SelectBoxInterface
} from './details-form.model';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { ContactComponent } from 'src/app/shared/components/contact/contact.component';
import { ContactService } from 'src/app/shared/components/contact/contact.service';
import {
  ContactInterface,
  ContactTypeInterface
} from 'src/app/shared/components/contact/contact.model';

import {
  DATA_CONTROLLER_PROCESSOR_OPTIONS,
  DATA_CONTROLLER_PROCESSOR_MAP
} from 'src/app/shared/models/controller-process.model';
import { exists } from 'src/app/shared/utils/basic-utils';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import {
  CanDeactivateTabInterface,
  DeactivationType
} from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import {
  CategoryItemInterface,
  CategoryLoaderInterface
} from '../../../../shared/components/async-categorical-dropdown/async-categorical-dropdown.model';
import { ItSystemDetailsFormService } from '../../it-system/it-system-details/it-system-details.service';

@AutoUnsubscribe([
  '_validitySubscription$',
  '_contactDetails$',
  '_contactTypes$'
])
@Component({
  selector: 'ta-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.scss']
})
export class DetailsFormComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() public mode: 'create';
  @Input() public showRiskFields: boolean;
  @Input() public iconRequiredColor: 'default' | 'red' = 'default';
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';

  @Output() updatedFormValue = new EventEmitter();
  @Output() updatedContactValue = new EventEmitter<ContactInterface>();

  public categoryLoadersFull: CategoryLoaderInterface[] = [
    {
      categoryId: 'PRIMARY_ENTITY',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'PRIMARY_ENTITY',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'COMPANY_AFFILIATE',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'COMPANY_AFFILIATE',
          searchRequest
        ),
      sort: 'name,ASC'
    }
  ];

  public categoryLoadersNoCycleRef: CategoryLoaderInterface[] = [
    {
      categoryId: 'PRIMARY_ENTITY',
      requestFunction: searchRequest =>
        this.itSystemDetailsFormService.searchLegalEntities(
          'PRIMARY_ENTITY',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'COMPANY_AFFILIATE',
      requestFunction: searchRequest =>
        this.detailsFormService
          .legalEntitiesFindAll(this.companyAffiliateId)
          .pipe(
            map(res => {
              const filtered = res.filter(item => {
                if (searchRequest.searchTerm) {
                  const r = new RegExp(searchRequest.searchTerm, 'ig');
                  return (
                    item.id !== this.companyAffiliateId && r.test(item.name)
                  );
                } else {
                  return item.id !== this.companyAffiliateId;
                }
              });
              return {
                content: filtered
              };
            })
          ),
      sort: 'name,ASC'
    }
  ];

  public contactInfoAdded = false;

  public formIsValid = false;
  public isNextButtonDisabled = false;

  public contact: ContactInterface;

  private defaultSelectBoxValue = undefined;

  public companyAffiliateDetailsForm: FormGroup;
  public legalEntity = new FormControl(null);
  public entityType = new FormControl(
    this.defaultSelectBoxValue,
    this.selectBoxSelectedValidator
  );
  public notes = new FormControl('', Validators.maxLength(1024));
  public companyName = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      noWhitespaceValidator,
      Validators.maxLength(255)
    ])
  );
  public locationForms = new FormControl(null, [
    Validators.required,
    Validators.minLength(1)
  ]);
  public industrySectorForms = new FormControl([]);

  @Output() isDetailsFormValid = new EventEmitter<boolean>(false);

  @ViewChild('industrySectorSelectBox')
  industrySectorSelectBox: CategoricalViewComponent;

  public selectedLegalEntity;
  public dataControllerOrProcessors = DATA_CONTROLLER_PROCESSOR_OPTIONS;
  public entityTypes: SelectBoxInterface[];
  public industrySectors: SelectBoxInterface[];
  public allCountries: CountrySelectBoxInterface[];
  public stateOrProvinces: SelectBoxInterface[];
  public selectableCountries;

  public industrySectorOptions;

  // These must be set here and in the
  public industrySectorOpenByDefault = false;
  public industrySectorStyleClass =
    'company-affiliate-details-categorical-view-component';

  public ownedByDropdownData = [];

  private _formChangeSubscription$: Subscription[] = [];
  private _validitySubscription$: Subscription;
  private _addContactData$: Subscription;
  private _getContactData$: Subscription;
  private _updateContactData$: Subscription;
  private _contactDetails$: Subscription;
  private _contactTypes$: Subscription;
  private _onCancelSubscription$: Subscription;

  private contactRoles: ContactTypeInterface[];

  public companyAffiliateDetailsGetResponse: CompanyAffiliateDetailsGetResponse;
  private companyAffiliateId: string;
  private version: number;
  private cancelChanges: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private detailsFormService: DetailsFormService,
    private itSystemDetailsFormService: ItSystemDetailsFormService,
    private modalService: TaModal,
    private contactService: ContactService,
    private dataInventoryService: DataInventoryService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.populateForm();
  }

  ngOnInit() {
    this._contactDetails$ = this.contactService.contactSubject.subscribe(
      response => {
        this.contact = response;
      }
    );

    this._contactTypes$ = this.contactService
      .getContactTypes()
      .subscribe(result => {
        this.contactRoles = result;
      });

    this.onCancelChanges();

    this.companyAffiliateDetailsForm.valueChanges.subscribe(value => {
      this.updatedFormValue.emit({
        dirty: this.companyAffiliateDetailsForm.dirty,
        valid: this.companyAffiliateDetailsForm.valid,
        value
      });
    });
  }

  ngOnDestroy() {
    if (
      this._formChangeSubscription$ &&
      this._formChangeSubscription$.length > 0
    ) {
      this._formChangeSubscription$.forEach(sub => sub.unsubscribe);
    }

    this.onCancelChangesSubscriber();
  }

  public getCategoryLoaders() {
    const companyAffiliateId = this.route.snapshot.params.id;
    if (companyAffiliateId === 'new' || this.mode === 'create') {
      return this.categoryLoadersFull;
    }
    return this.categoryLoadersNoCycleRef;
  }

  private createValidityUpdates() {
    if (this._validitySubscription$) {
      this._validitySubscription$.unsubscribe();
    }
    this._validitySubscription$ = this.companyAffiliateDetailsForm.statusChanges.subscribe(
      status => {
        const isValid =
          this.companyAffiliateDetailsForm.valid && !this.isNextButtonDisabled;
        this.formIsValid = isValid;
        this.isDetailsFormValid.emit(isValid);
      }
    );
  }

  public selectLegalEntity($event: CategoryItemInterface) {
    const newValue = { name: $event.name, id: $event.id };
    this.selectedLegalEntity = this.mapContentItem($event);
    this.companyAffiliateDetailsForm.get('legalEntity').patchValue(newValue);
    this.companyAffiliateDetailsForm.markAsDirty();
  }

  private populateForm() {
    this.companyAffiliateDetailsForm = this.formBuilder.group({
      id: '',
      version: -1,
      companyName: this.companyName,
      entityType: this.entityType,
      dataControllerOrProcessor: undefined,
      industrySectors: this.industrySectorForms,
      legalEntity: this.legalEntity,
      locationForms: this.locationForms,
      notes: this.notes,
      contactRole: ''
    });

    this.companyAffiliateId = this.route.snapshot.params.id;

    this.detailsFormService.clearCompanyAffiliateDetails();

    this.detailsFormService.updateCompanyAffiliateDetails(
      this.companyAffiliateId
    );

    this.createValidityUpdates();

    this.detailsFormService._companyAffiliateData$.subscribe(data => {
      if (data) {
        this.industrySectorOptions = data.industrySectorOptions;
        this.companyAffiliateDetailsGetResponse = data;
        this.allCountries = data.locationsForDropdown;

        this.getSelectBoxData(data);

        this.version = data.version;

        this.setDynamicDataFromServer(this.companyAffiliateDetailsGetResponse);

        if (data.contactType) {
          this.companyAffiliateDetailsForm
            .get('contactRole')
            .patchValue(data.contactType);
        }
      }
    });
  }

  private selectBoxSelectedValidator(selected: FormControl) {
    return !selected.value || selected.value.name === 'Select'
      ? {
          invalidSelectBox: {
            valid: false,
            invalid: true,
            value: selected.value
          }
        }
      : null;
  }

  private setLegalEntity(legalEntity): void {
    this.selectLegalEntity(legalEntity);
  }

  /**
   * Gets select box data
   * Temporary function. Will be replaced in the future by a request(s) to the server and possibly some data mapping.
   */
  private getSelectBoxData(data) {
    this.entityTypes = data.businessStructureOptions;
    this.industrySectors = data.industrySectorOptions;
  }

  private setDynamicDataFromServer(data: CompanyAffiliateDetailsGetResponse) {
    const companyAffiliateId = this.route.snapshot.params.id;
    const companyNameControl = this.companyAffiliateDetailsForm.get(
      'companyName'
    );

    if (companyAffiliateId === 'new' || this.mode === 'create') {
      // When "new" or "create" mode we set to form whatever is already entered by User
      companyNameControl.setValue(companyNameControl.value || data.name);
    } else {
      // Otherwise set to form what is being returned by server
      companyNameControl.setValue(data.name);
    }

    if (data.industrySectors && data.industrySectorOptions) {
      const patchValue = data.industrySectors.map(industrySector => ({
        id: industrySector.id,
        label: industrySector.name
      }));

      this.companyAffiliateDetailsForm
        .get('industrySectors')
        .patchValue(patchValue);

      // Needed to allow values to correcly map to form
      patchValue.forEach(value => {
        this.industrySectorForms.value.push(value);
      });
    }

    if (data.businessStructure) {
      this.addDataToSelectBoxFromServer(
        'entityType',
        data.businessStructure.businessStructure,
        this.entityTypes
      );
    }
    // Entity Role = data controler or processor field.
    if (data.entityRole) {
      this.addDataToSelectBoxFromServer(
        'dataControllerOrProcessor',
        DATA_CONTROLLER_PROCESSOR_MAP[data.entityRole].name,
        DATA_CONTROLLER_PROCESSOR_OPTIONS
      );
    }

    if (data.locations) {
      this.companyAffiliateDetailsForm
        .get('locationForms')
        .setValue(data.locations);
    }

    if (data.contact) {
      this.contactService.setLocationValues(data.contact);
    }

    if (data.legalEntity) {
      const value = { name: data.legalEntity.name, id: data.legalEntity.id };
      this.companyAffiliateDetailsForm.get('legalEntity').patchValue(value);
      this.setLegalEntity(data.legalEntity);
    }

    if (data.notes) {
      this.companyAffiliateDetailsForm.get('notes').setValue(data.notes);
    }
  }

  private addDataToSelectBoxFromServer(
    fieldName: string,
    serverData: string,
    formField: SelectBoxInterface[]
  ) {
    if (serverData) {
      formField.forEach(selectBoxItem => {
        if (selectBoxItem.name === serverData) {
          this.companyAffiliateDetailsForm
            .get(fieldName)
            .setValue(selectBoxItem);
        }
      });
    }
  }

  public createNewContact() {
    const modalRef = this.modalService.open(ContactComponent, {
      windowClass: 'ta-modal-custom-width'
    });

    modalRef.componentInstance.mode = 'Adding';
    modalRef.componentInstance.useRoles = true;

    modalRef.result.then(
      success => {
        if (exists(success.role)) {
          this.companyAffiliateDetailsForm
            .get('contactRole')
            .patchValue(success.role);

          this.companyAffiliateDetailsForm.get('contactRole').markAsDirty();
          this.companyAffiliateDetailsForm.get('contactRole').markAsTouched();
        }

        this.companyAffiliateDetailsForm.markAsDirty();
        this.companyAffiliateDetailsForm.markAsTouched();
        this.updatedContactValue.emit(this.contact);
      },
      error => {
        this.toastService.warn('Contact could not be saved');
      }
    );
  }

  public editContact() {
    this.contactService
      .getContactById(this.contact.id)
      .subscribe(contactResponse => {
        const modalRef = this.modalService.open(ContactComponent, {
          windowClass: 'ta-modal-custom-width'
        });

        if (exists(this.companyAffiliateDetailsForm.get('contactRole').value)) {
          // Temporary fix until RHEA-1504 addresses larger issue
          const typeValue = this.companyAffiliateDetailsForm.get('contactRole')
            .value.type;
          contactResponse.role = typeValue
            ? typeValue
            : this.companyAffiliateDetailsForm.get('contactRole').value;
        }

        modalRef.componentInstance.contact = contactResponse;
        modalRef.componentInstance.mode = 'Editing';
        modalRef.componentInstance.useRoles = true;

        modalRef.result.then(
          success => {
            if (exists(success.role)) {
              this.companyAffiliateDetailsForm
                .get('contactRole')
                .patchValue(success.role);

              this.companyAffiliateDetailsForm
                .get('contactRole')
                .markAsTouched();

              this.companyAffiliateDetailsForm.get('contactRole').markAsDirty();
            }

            this.companyAffiliateDetailsForm.markAsDirty();
            this.companyAffiliateDetailsForm.markAsTouched();
            this.updatedContactValue.emit(this.contact);
          },
          error => {
            this.toastService.warn('Contact could not be saved');
          }
        );
      });
  }

  public onSubmit() {}

  public save(): Observable<BaseDomainInterface> {
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }
    if (!this.companyAffiliateDetailsForm.dirty) {
      return of({ id: this.companyAffiliateId, version: this.version });
    }
    return this.detailsFormService
      .saveCompanyAffiliate(
        this.companyAffiliateId,
        this.createPutRequestDataObject()
      )
      .pipe(tap(result => (this.version = result.version)));
  }

  /**
   * Creates put request data object
   * @returns put request data object
   */
  private createPutRequestDataObject(): CompanyAffiliateDetailsPutRequest {
    let dataObject = { version: this.version };
    const form = this.companyAffiliateDetailsForm;

    if (this.contact && this.contact.id) {
      dataObject['contactId'] = this.contact.id;
    }

    dataObject = this.updatePutRequestWithSelectBoxValue(
      form,
      'dataControllerOrProcessor',
      'entityRole',
      dataObject
    );

    dataObject = this.updatePutRequestWithSelectBoxValue(
      form,
      'entityType',
      'businessStructureId',
      dataObject
    );

    dataObject['industrySectorIds'] = form
      .get('industrySectors')
      .value.map(item => item.id);

    dataObject['locations'] = form.get('locationForms').value;

    if (form.get('companyName')) {
      dataObject['name'] = form.get('companyName').value.trim();
    }

    if (form.get('notes')) {
      dataObject['note'] = form.get('notes').value;
    }

    if (exists(form.get('contactRole'))) {
      dataObject['contactTypeId'] = form.get('contactRole').value.id;
    }

    if (exists(form.get('legalEntity'))) {
      dataObject['legalEntityId'] = form.get('legalEntity').value
        ? form.get('legalEntity').value.id
        : null;
    }

    return dataObject;
  }

  private updatePutRequestWithSelectBoxValue(
    form: FormGroup,
    selectField: string,
    putRequestField: string,
    putRequestBody: CompanyAffiliateDetailsPutRequest
  ) {
    const newDataObject = putRequestBody;

    if (this.isSelectBoxSet(form, selectField)) {
      newDataObject[putRequestField] = form.get(selectField).value.id;
    }

    return newDataObject;
  }

  private isSelectBoxSet(form: FormGroup, field: string) {
    return (
      form.get(field) &&
      form.get(field).value &&
      form.get(field).value.name !== 'Select'
    );
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

  canDeactivateTab(deactivationType: DeactivationType): Observable<boolean> {
    return this.save().pipe(
      flatMap(result => {
        if (
          this.companyAffiliateId === 'new' &&
          result.id &&
          result.id !== 'new' &&
          deactivationType === 'tabChange'
        ) {
          this.router.navigateByUrl(this.router.url.replace('new', result.id));
        }
        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  public locationChanges(resp) {
    this.companyAffiliateDetailsForm
      .get('locationForms')
      .patchValue(resp.locations);
    this.companyAffiliateDetailsForm.markAsDirty();
  }

  public mapContentItem(item: any): CategoryItemInterface {
    return { ...item, categoryId: item.type };
  }

  public onDropdownTouched(dropdownOpen, name) {
    if (dropdownOpen === false) {
      this.companyAffiliateDetailsForm.get(name).markAsTouched();
    }
  }
}
