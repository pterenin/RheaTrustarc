import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { CustomFiltersService } from 'src/app/shared/services/custom-filters/custom-filters.service';
import { ToastService } from '@trustarc/ui-toolkit';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CustomFilterTypeBody } from 'src/app/shared/models/filter-custom.model';
import { catchError, flatMap, map } from 'rxjs/operators';
import { forkJoin, of, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

declare const _: any;

@AutoUnsubscribe([
  '_filtersTypes$',
  '_filtersViewSave$',
  '_filtersViewUpdate$',
  '_filtersViewList$',
  '_filtersViewListFull$',
  '_filtersTypeOptions$',
  '_customFilterTypes$'
])
@Component({
  selector: 'ta-custom-filters',
  templateUrl: './custom-filters.component.html',
  styleUrls: ['./custom-filters.component.scss']
})
export class CustomFiltersComponent implements OnInit, OnDestroy {
  @Output() applyFiltersEvent = new EventEmitter<any>();
  @Output() applyFilterName = new EventEmitter<any>();
  @Input() customFilters: CustomFilterTypeBody;
  @Input() defaultFilters: string[];
  @Input() licenses = {};
  @Input() recordType = '';

  private _filtersTypes$: Subscription;
  private _filtersTypeOptions$: Subscription;
  private _filtersViewSave$: Subscription;
  private _filtersViewUpdate$: Subscription;
  private _filtersViewList$: Subscription;
  private _filtersViewListFull$: Subscription;
  private _customFilterTypes$: Subscription;

  public filterTypes: any[] = [];
  public categorizedFilterTypes: any[] = [];
  public selectedFilterView: CustomFilterTypeBody;
  public filterViewList: any[] = [];
  public newFilterForm: FormGroup;
  public editFilterForm: FormGroup;
  public isSavingAsNew: boolean;
  public isFiltersDirty: boolean;
  public isLoading = false;
  public selectedFilterTypes: any[] = [];

  public filterName = new FormControl('', [
    Validators.required,
    Validators.maxLength(255),
    this.validateName.bind(this)
  ]);
  public editedFilterName = new FormControl('', [
    Validators.required,
    Validators.maxLength(255),
    this.validateName.bind(this)
  ]);

  constructor(
    private customFiltersService: CustomFiltersService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
    this.getFilterViewList();
    this.newFilterForm = this.formBuilder.group({
      filterName: this.filterName
    });
    this.editFilterForm = this.formBuilder.group({
      editedFilterName: this.editedFilterName
    });
    this.getFilterOptions = this.getFilterOptions.bind(this);
  }

  initCachedFilter() {
    if (this.customFilters && this.customFilters.filters) {
      this.isFiltersDirty = false;
      this.selectedFilterView = this.customFilters;
    }
  }

  ngOnInit() {
    this.initFilterTypes();
    this.initCachedFilter();
  }

  ngOnDestroy() {}

  public clearFilters() {
    this.filterTypes.forEach(filterType => {
      this.removeFilterType(filterType, false);
    });
    this.selectedFilterView = null;
    this.applyFilterName.emit('');
    this.isFiltersDirty = true;
  }

  public applyFilters() {
    const applyFiltersObject = this.prepareFilterRequestObject();
    this.applyFiltersEvent.emit(applyFiltersObject);
    this.customFiltersService.cacheFilters(applyFiltersObject);
    this.isFiltersDirty = false;
  }

  public updateFilter() {
    if (this._filtersViewUpdate$) {
      this._filtersViewUpdate$.unsubscribe();
    }
    const filterRequestObject = this.prepareFilterRequestObject();
    filterRequestObject.id = this.selectedFilterView.id;
    filterRequestObject.name = this.selectedFilterView.name;
    this._filtersViewUpdate$ = this.customFiltersService
      .updateFilterView(filterRequestObject)
      .subscribe(
        res => {},
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error updating filter view');
        }
      );
  }

  public saveAsNew($event) {
    $event.stopPropagation();
    this.isSavingAsNew = true;
    this.selectedFilterView = null;
  }

  public saveFilter() {
    if (this._filtersViewSave$) {
      this._filtersViewSave$.unsubscribe();
    }
    const filterRequestObject = this.prepareFilterRequestObject();
    filterRequestObject.name = this.newFilterForm.get('filterName').value;
    this._filtersViewSave$ = this.customFiltersService
      .saveFilterView(filterRequestObject)
      .subscribe(
        response => {
          filterRequestObject.id = response.id;
          this.selectedFilterView = filterRequestObject;
          this.isSavingAsNew = false;
          this.applyFilterName.emit(filterRequestObject.name);
          this.getFilterViewList();
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error saving filter');
        }
      );
  }

  public removeFilterViewFromList(filterView) {
    this.filterViewList = this.filterViewList.filter(
      _filterView => _filterView.id !== filterView.id
    );
  }

  public deleteFilter($event, filterView) {
    $event.preventDefault();
    $event.stopPropagation();
    this.customFiltersService.deleteFilterView(filterView.id).subscribe(
      res => {
        this.removeFilterViewFromList(filterView);
      },
      err => {
        // [i18n-tobeinternationalized]
        this.toastService.error('Error deleting filter');
      }
    );
  }

  public editFilterView($event, filterView) {
    $event.preventDefault();
    $event.stopPropagation();
    this.resetAllEditMods();
    this.editFilterForm.patchValue({
      editedFilterName: filterView.name
    });
    this.editFilterForm.get('editedFilterName').markAsUntouched();
    filterView.editMode = true;
  }

  public resetAllEditMods() {
    this.filterViewList.forEach(filterView => (filterView.editMode = false));
  }

  public cancelEdit(filterView) {
    filterView.editMode = false;
  }

  public updateFilterViewName(filterView) {
    this.editFilterForm.get('editedFilterName').markAsTouched();
    if (!this.editFilterForm.valid) {
      return;
    }
    const newName = this.editFilterForm.get('editedFilterName').value;
    this.customFiltersService
      .getFullFilterView(filterView.id)
      .pipe(
        flatMap(data => {
          const selectedFilter = data;
          selectedFilter.name = newName;
          return this.customFiltersService.updateFilterView(selectedFilter);
        })
      )
      .subscribe(
        success => {
          filterView.name = newName;
          if (
            this.selectedFilterView &&
            filterView.id === this.selectedFilterView.id
          ) {
            this.selectedFilterView.name = newName;
            this.applyFilterName.emit(newName);
          }
          filterView.editMode = false;
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error updating filter name');
        }
      );
  }

  public isAllSelected() {
    return this.filterTypes.every(filterType => filterType.selected);
  }

  public isIndeterminate() {
    return (
      !this.isAllSelected() &&
      this.filterTypes.some(filterType => filterType.selected)
    );
  }

  public onFilterTypeClick(filterType) {
    if (filterType.selected) {
      if (filterType.loading) {
        return;
      }
      filterType.loading = true;
      this.getFilterOptions([filterType]).subscribe(
        () => {
          this.addFilterType(filterType);
          filterType.loading = false;
        },
        () => {
          filterType.loading = false;
        }
      );
    } else {
      this.removeFilterType(filterType);
    }
  }

  public filterOptionChanged() {
    this.isFiltersDirty = true;
    this.prepareFilterRequestObject();
  }

  public addFilterType(filterType) {
    filterType.selected = true;
    this.selectedFilterTypes.push(filterType);
  }

  public getFilterTypeOptions(filterType) {
    const filterSubTypeName = filterType.subType;
    if (this._filtersTypeOptions$) {
      this._filtersTypeOptions$.unsubscribe();
    }
    return this.customFiltersService.getFilterSubTypeOptions(filterSubTypeName);
  }

  public isOptionSelected(option) {
    if (!this.selectedFilterView) {
      return false;
    }
    const { name, id } = option;
    const subTypeNames = _.keys(this.selectedFilterView.filters);
    const isSelected = subTypeNames.some(typeName =>
      this.isSelected(this.selectedFilterView.filters[typeName], name, id)
    );
    return isSelected;
  }

  public isSelected(filterType, optionName, id) {
    let isSelected =
      filterType.value.includes(optionName) || filterType.value.includes(id);
    if (filterType.nestedFilterValue && !isSelected) {
      const subTypeNames = _.keys(filterType.nestedFilterValue);
      isSelected = subTypeNames.some(typeName =>
        this.isSelected(filterType.nestedFilterValue[typeName], optionName, id)
      );
    }
    return isSelected;
  }

  public getFilterViewList() {
    if (this._filtersViewList$) {
      this._filtersViewList$.unsubscribe();
    }
    this._filtersViewList$ = this.customFiltersService
      .getFilterViewList()
      .subscribe(
        response => {
          this.filterViewList = response.map(filterView => ({
            ...filterView,
            editMode: false
          }));
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error getting filter view list');
        }
      );
  }

  private renderSelectedFilterView() {
    if (!this.selectedFilterView || !this.selectedFilterView.filters) {
      return;
    }
    const filterNames = _.keys(this.selectedFilterView.filters);
    const filterTypes = [];

    filterNames.forEach(filterName => {
      const filterType = this.filterTypes.find(
        _filterType => _filterType.subType === filterName
      );
      if (filterType) {
        this.addFilterType(filterType);
        filterTypes.push(filterType);
      }
    });
    this.renderFilterTypes(filterTypes);
    this.isFiltersDirty = true;
  }

  private renderFilterTypes(filterTypes) {
    this.getFilterOptions(filterTypes).subscribe(_filterTypes => {
      _filterTypes.forEach((_filterType: any) => {
        if (!_filterType || !_filterType.filterOptions) {
          return;
        }
        _filterType.filterOptions.forEach(filterOption => {
          if (filterOption.subType) {
            this.renderFilterTypes([filterOption]);
          }
        });
      });
      this.isLoading = false;
    });
  }

  public selectFilterView(filterView) {
    if (filterView.editMode) {
      return;
    }
    this.isLoading = true;
    this.deselectAllFilterTypes();
    this.getFullFilterView(filterView.id);
    this.applyFilterName.emit(filterView.name);
  }

  private getFullFilterView(filterViewId: string) {
    if (this._filtersViewListFull$) {
      this._filtersViewListFull$.unsubscribe();
    }
    this._filtersViewListFull$ = this.customFiltersService
      .getFullFilterView(filterViewId)
      .subscribe(
        response => {
          this.selectedFilterView = response;
          this.renderSelectedFilterView();
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error getting full filter view');
        }
      );
  }

  public deselectAllFilterTypes() {
    this.filterTypes.forEach(filterType => {
      this.removeFilterType(filterType);
    });
  }

  private isCategorizedOptionSelected(option) {
    if (!this.selectedFilterView || !this.selectedFilterView.filters) {
      return false;
    }
    const filters = Object.keys(this.selectedFilterView.filters);
    return filters.some(
      filter =>
        this.selectedFilterView.filters[filter].value.includes(option.name) ||
        this.selectedFilterView.filters[filter].value.includes(option.id)
    );
  }

  private mapCategorizedOptions(categorizedOptions, parentSubType) {
    categorizedOptions.forEach(option => {
      option.isCategorizedFilter = true;
      option.selected = this.isCategorizedOptionSelected(option);
    });
    const categories = _.uniqBy(
      categorizedOptions.map(option => ({
        name: option.category,
        isCategorizedFilter: true,
        isCategory: true,
        selectable: false
      })),
      'name'
    );

    categories.forEach(category => {
      category.filterOptions = categorizedOptions.filter(
        item =>
          item.category === category.name &&
          (!item.parentType || item.parentType === parentSubType)
      );
      category.filterOptions.forEach(filterOption => {
        this.buildCategoryTree(filterOption, category, categorizedOptions);
      });
    });
    return categories;
  }

  private buildCategoryTree(parentType, category, filterOptions) {
    parentType.filterOptions = filterOptions.filter(
      item =>
        item.category === category.name && item.parentType === parentType.name
    );
    parentType.filterOptions.forEach(option =>
      this.buildCategoryTree(option, category, filterOptions)
    );
  }

  public getFilterOptions(filterTypes) {
    const filterRequests = [];
    filterTypes.forEach(filterType => {
      filterRequests.push(
        this.getFilterTypeOptions(filterType).pipe(
          map(response => {
            if (!response.filterOptions.content.length) {
              return;
            }
            if (response.filterOptions.content[0].category) {
              filterType.filterOptions = this.mapCategorizedOptions(
                response.filterOptions.content,
                filterType.subType
              );
              filterType.isCategorizedFilter = true;
            } else {
              filterType.filterOptions = response.filterOptions.content.map(
                option => ({
                  ...option,
                  selected: this.isOptionSelected(option)
                })
              );
            }

            return filterType;
          }),
          catchError(() => {
            this.toastService.error(
              `Error getting filter options for
              ${filterType.name}`
            );
            return of(null);
          })
        )
      );
    });
    return forkJoin(filterRequests);
  }

  public selectFilterTypes(filterTypes) {
    this.isLoading = true;
    filterTypes.forEach(filter => {
      filter.selected = true;
      this.addFilterType(filter);
    });
    this.getFilterOptions(filterTypes).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  public allFiltersClick($event) {
    $event.preventDefault();
    if (this.selectedFilterTypes.length) {
      this.deselectAllFilterTypes();
    } else if (!this.isLoading) {
      this.selectFilterTypes(this.filterTypes);
    }
    this.isFiltersDirty = true;
  }

  public removeFilterType(filterType, unselect = true) {
    if (unselect) {
      filterType.selected = false;
      this.isFiltersDirty = true;
    }

    this.selectedFilterTypes = this.selectedFilterTypes.filter(
      _filterType => _filterType.selected
    );
    this.unselectFilterOptions(filterType.filterOptions);
    this.prepareFilterRequestObject();
  }

  public unselectFilterOptions(filterOptions) {
    if (!filterOptions || !filterOptions.length) {
      return;
    }
    filterOptions.forEach(option => {
      option.selected = false;
      option.hidden = false;
      this.unselectFilterOptions(option.filterOptions);
    });
  }
  public initFilterTypes() {
    this.customFiltersService.setRecordType(this.recordType);
    this._customFilterTypes$ = this.customFiltersService
      .getFilterTypes()
      .pipe(
        flatMap(res => {
          return this.customFiltersService.emitFilterTypesUpdated(
            res.filterOptions.content
          );
        }),
        flatMap(filterTypes => {
          if (
            this.licenses.hasOwnProperty('RISK_PROFILE_LICENSE') &&
            !this.licenses['RISK_PROFILE_LICENSE'] &&
            !this.licenses['RISK_PROFILE_THIRD_PARTY_LICENSE'] &&
            !this.licenses['RISK_SERVICE_V2']
          ) {
            filterTypes = filterTypes.filter(filter => {
              return filter.name !== 'Risk Indicator';
            });
          }
          return of(filterTypes);
        })
      )
      .subscribe(
        filterTypes => {
          this.filterTypes = filterTypes.filter(
            filterType => filterType.name !== 'Risk'
          );

          if (this.recordType === 'INV_ALL') {
            this.categorizedFilterTypes = _.values(
              _.groupBy(this.filterTypes, 'category')
            );
          }

          if (this.selectedFilterView) {
            this.renderSelectedFilterView();
          } else {
            this.initDefaultFilters();
          }
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error getting filters');
        }
      );
  }

  private initDefaultFilters() {
    if (!this.defaultFilters || !this.defaultFilters.length) {
      return;
    }
    const filterTypes = [];

    this.defaultFilters.forEach(filterTypenName => {
      const defaultFilterType = this.filterTypes.find(
        filterType => filterType.name === filterTypenName
      );
      if (defaultFilterType) {
        filterTypes.push(defaultFilterType);
      }
    });
    this.selectFilterTypes(filterTypes);
  }

  private buildCategorizedFilterRequestObject(filterType) {
    const value = [];
    filterType.filterOptions.forEach(category => {
      this.getSelectedCategorizedOptionNames(category, value);
    });
    return { [filterType.subType]: { value: value } };
  }

  private getSelectedCategorizedOptionNames(filterType, value) {
    if (filterType.selected && !filterType.isCategory) {
      value.push(filterType.id || filterType.name);
    }
    if (filterType.filterOptions) {
      filterType.filterOptions.forEach(option =>
        this.getSelectedCategorizedOptionNames(option, value)
      );
    }
  }

  public selectedFilterViewExists() {
    return (
      (this.selectedFilterView && this.selectedFilterView.id) ||
      this.isSavingAsNew
    );
  }

  private prepareFilterRequestObject() {
    const applyFiltersObject = { filters: {}, name: null, id: null };

    this.selectedFilterTypes.forEach(filterType => {
      const filters = filterType.isCategorizedFilter
        ? this.buildCategorizedFilterRequestObject(filterType)
        : this.addValueToRequestObject(filterType);
      applyFiltersObject.filters = Object.assign(
        applyFiltersObject.filters,
        filters
      );
    });
    if (this.selectedFilterView) {
      this.selectedFilterView.filters = applyFiltersObject.filters;
    } else {
      this.selectedFilterView = applyFiltersObject;
    }
    return applyFiltersObject;
  }

  private addValueToRequestObject(filterType) {
    if (!filterType.filterOptions) {
      return null;
    }
    const result = { value: [], nestedFilterValue: {} };
    filterType.filterOptions.forEach(option => {
      if (option.selected) {
        result.value.push(option.id || option.name);
      }
      result.nestedFilterValue = Object.assign(
        result.nestedFilterValue,
        this.addValueToRequestObject(option)
      );
    });
    if (_.isEmpty(result.nestedFilterValue)) {
      result.nestedFilterValue = null;
    }
    const subType = filterType.subType
      ? filterType.subType.split('~')[0]
      : filterType.name;
    return { [subType]: result };
  }

  validateName(control: AbstractControl) {
    const alreadyExists = this.filterViewList.some(
      filterView => filterView.name === control.value
    );
    if (alreadyExists) {
      return { alreadyExists: true };
    }
    return null;
  }
}
