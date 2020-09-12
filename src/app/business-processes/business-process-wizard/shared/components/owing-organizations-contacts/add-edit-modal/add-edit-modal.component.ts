import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { CompanyEntitiesControllerService } from 'src/app/shared/_services/rest-api';
import {
  EntityContentInterface,
  BusinessProcessOwnerInterface
} from 'src/app/shared/_interfaces/rest-api';

import {
  emailPatternValidator,
  isNullOrUndefined
} from 'src/app/shared/utils/basic-utils';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';

@Component({
  selector: 'ta-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddEditOwningOrganizationContactsModalComponent implements OnInit {
  @Input() public isEditModal: boolean;
  @Input() public ownerData: BusinessProcessOwnerInterface;
  @Input() public showSpinner: Observable<boolean>;
  @Input() public ownersCount: Observable<number>;
  @Output() public closeModalEvent: EventEmitter<string>;
  @Output() public addOwnerEvent: EventEmitter<BusinessProcessOwnerInterface>;
  @Output() public iconRequiredColor: 'default' | 'red' = 'default';

  public bpAddEditOwner: FormGroup;
  public companySubsidiaryAffiliate: FormControl;
  public role: FormControl;
  public ownerName: FormControl;
  public ownerEmail: FormControl;
  public department: FormControl;
  public version: FormControl;
  public primary: FormControl;
  private _getDropDownData$: Subscription;
  public organizations: EntityContentInterface[];
  public selectedDepartment: string;
  public departments: EntityContentInterface[];
  public owningEntityRoles: String[];
  public currentOwner: BusinessProcessOwnerInterface;
  public isShowingSpinner: boolean;
  public totalOwners: number;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private companyEntitiesControllerService: CompanyEntitiesControllerService
  ) {
    this.closeModalEvent = new EventEmitter<string>();
    this.addOwnerEvent = new EventEmitter<BusinessProcessOwnerInterface>();
    this.initializeFormControls();
    this.bpAddEditOwner = this.formBuilder.group({
      companySubsidiaryAffiliate: this.companySubsidiaryAffiliate,
      role: this.role,
      ownerName: this.ownerName,
      ownerEmail: this.ownerEmail,
      department: this.department,
      version: 0,
      primary: this.primary
    });

    this.initListsValues();
  }

  public ngOnInit(): void {
    this.getDropDownData();
    this.loadOwnerData();
    this.showSpinner.subscribe(show => {
      this.isShowingSpinner = show;
    });

    this.ownersCount.subscribe(total => {
      this.totalOwners = total;
    });
  }

  public closeModal(reason: string): void {
    this.closeModalEvent.emit(reason);
  }

  public onSubmit(): void {
    const companyAffiliate = this.bpAddEditOwner.get(
      'companySubsidiaryAffiliate'
    ).value;
    const owner: BusinessProcessOwnerInterface = {
      id: !this.isEditModal ? null : this.ownerData.id,
      companyId:
        companyAffiliate && companyAffiliate.id ? companyAffiliate.id : null,
      companyName:
        companyAffiliate && companyAffiliate.name
          ? companyAffiliate.name
          : null,
      departmentName: this.bpAddEditOwner.get('department').value
        ? this.bpAddEditOwner.get('department').value.name
        : null,
      departmentId: this.bpAddEditOwner.get('department').value
        ? this.bpAddEditOwner.get('department').value.id
        : null,
      email: this.bpAddEditOwner.get('ownerEmail').value,
      fullName: this.bpAddEditOwner.get('ownerName').value.trim(),
      role: this.bpAddEditOwner.get('role').value,
      version: this.bpAddEditOwner.get('version').value,
      primaryOwner: this.bpAddEditOwner.get('primary').value
    };
    if (owner.id === null) {
      delete owner.id;
    }
    this.addOwnerEvent.emit(owner);
  }

  private initializeFormControls(): void {
    this.companySubsidiaryAffiliate = new FormControl('', {
      validators: [Validators.required]
    });

    this.role = new FormControl('');
    this.ownerName = new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(255),
        noWhitespaceValidator
      ]
    });

    this.ownerEmail = new FormControl('', {
      validators: [
        Validators.pattern(emailPatternValidator),
        Validators.maxLength(255)
      ],
      updateOn: 'blur'
    });

    this.department = new FormControl('');
    this.primary = new FormControl('');
  }

  private getDropDownData() {
    if (this._getDropDownData$) {
      this._getDropDownData$.unsubscribe();
    }
    this._getDropDownData$ = forkJoin([
      this.companyEntitiesControllerService.getCompanyEntities(),
      this.companyEntitiesControllerService.getDepartments(),
      this.companyEntitiesControllerService.getOwningEntityRoles()
    ]).subscribe(
      ([organizations, departments, owningEntityRoles]) => {
        this.organizations = organizations.content;
        this.departments = departments;
        this.owningEntityRoles = owningEntityRoles.sort();
      },
      err => console.log('Error: ', err)
    );
  }

  private initListsValues(): void {
    this.organizations = [];
    this.departments = [];
    this.owningEntityRoles = [];
  }

  private loadOwnerData(): void {
    if (this.isEditModal && !isNullOrUndefined(this.ownerData)) {
      const hasCompany = !isNullOrUndefined(this.ownerData.companyId);
      const hasDepartment = !isNullOrUndefined(this.ownerData.departmentId);
      this.bpAddEditOwner.patchValue({
        id: this.ownerData.id,
        companySubsidiaryAffiliate: hasCompany
          ? {
              name: this.ownerData.companyName,
              id: this.ownerData.companyId
            }
          : null,
        ownerName: this.ownerData.fullName,
        ownerEmail: this.ownerData.email,
        version: this.ownerData.version,
        department: hasDepartment
          ? {
              name: this.ownerData.departmentName,
              id: this.ownerData.departmentId
            }
          : null,
        role: this.ownerData.role,
        primary: this.ownerData.primaryOwner
      });
    }
  }
}
