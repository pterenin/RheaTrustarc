import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CustomFilter,
  CustomFilterType,
  CustomFilterTypeBody,
  CustomFilterTypeMapped,
  CustomFilterTypesResponse,
  SaveFilterViewResponse
} from 'src/app/shared/models/filter-custom.model';

declare const _: any;
@Injectable({
  providedIn: 'root'
})
export class CustomFiltersService {
  private filterTypes = new BehaviorSubject<any>([]);
  private cachedFilters = new BehaviorSubject<any>([]);
  private recordType = '';

  constructor(private httpClient: HttpClient) {}

  getCachedFilters(): Observable<CustomFilterTypeBody> {
    return this.cachedFilters.asObservable();
  }

  cacheFilters(filterView: CustomFilterTypeBody) {
    this.cachedFilters.next(filterView);
  }

  getFilterTypes(): Observable<CustomFilterTypesResponse> {
    return this.httpClient.get<CustomFilterTypesResponse>(
      'api/search/filter/types/' + this.recordType
    );
  }

  public setRecordType(recordType: string) {
    this.recordType = recordType;
  }

  getFilterSubTypeOptions(
    subType: string
  ): Observable<CustomFilterTypesResponse> {
    return this.httpClient.get<CustomFilterTypesResponse>(
      `api/search/filter/types/${subType}`
    );
  }

  // TODO: this is temporary due to a bug in API, should be "api/search/filter/types/type/${subType}"
  getFilterSubTypeOptionsForSystem(
    subType: string
  ): Observable<CustomFilterTypesResponse> {
    return this.httpClient.get<CustomFilterTypesResponse>(
      `api/search/filter/types/${subType}`
    );
  }

  getFilterViewList(): Observable<CustomFilter[]> {
    return this.httpClient.get<CustomFilter[]>(`api/search/filter`);
  }

  saveFilterView(
    requestFilterObject: CustomFilterTypeBody
  ): Observable<SaveFilterViewResponse> {
    return this.httpClient.post<SaveFilterViewResponse>(
      `api/search/filter`,
      requestFilterObject
    );
  }

  deleteFilterView(id): Observable<any> {
    return this.httpClient.delete(`api/search/filter/${id}`);
  }

  updateFilterView(
    requestFilterObject: CustomFilterTypeBody
  ): Observable<SaveFilterViewResponse> {
    return this.httpClient.put<SaveFilterViewResponse>(
      `api/search/filter/${requestFilterObject.id}`,
      requestFilterObject
    );
  }

  getFullFilterView(id: string): Observable<CustomFilterTypeBody> {
    return this.httpClient.get<CustomFilterTypeBody>(`api/search/filter/${id}`);
  }

  public initFilterTypes() {
    this.getCachedFilterTypes().subscribe(filterTypes => {
      if (filterTypes.length === 0) {
        this.getFilterTypes().subscribe(response =>
          this.emitFilterTypesUpdated(response.filterOptions.content)
        );
      }
    });
  }

  emitFilterTypesUpdated(filterTypes: CustomFilterType[]) {
    const mappedFilter = filterTypes.map(filterType => {
      return { ...filterType, selected: false, filterOptions: [] };
    });
    this.filterTypes.next(mappedFilter);
    return this.getCachedFilterTypes();
  }

  getCachedFilterTypes(): Observable<CustomFilterTypeMapped[]> {
    return this.filterTypes.asObservable();
  }
}
