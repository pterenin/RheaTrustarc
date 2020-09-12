import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  ProcessingPurposeCategoryInterface,
  ProcessingPurposeInterface,
  ProcessingPurposeRequestInterface,
  ProcessingPurposeUpsertResponseInterface
} from '../../models/processing-purposes.model';
import {
  BaseCategoryInterface,
  categorize
} from '../../components/categorical-view/base-category.model';
import { SearchResponseInterface } from '../../models/search.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { DataInterface } from '../../components/categorical-view/categorical-view.component';

@Injectable({
  providedIn: 'root'
})
export class ProcessingPurposesService {
  constructor(private httpClient: HttpClient) {}

  public getAllProcessingPurposes(): Observable<
    BaseCategoryInterface<ProcessingPurposeInterface>[]
  > {
    return this.httpClient
      .get<{ content: ProcessingPurposeInterface[] }>(
        `/api/processing-purposes?size=300`
      )
      .pipe(map(this.mapProcessingPurposesToDataInterface));
  }

  public getProcessingPurposes(): Observable<
    SearchResponseInterface<ProcessingPurposeInterface>
  > {
    return this.httpClient.get<
      SearchResponseInterface<ProcessingPurposeInterface>
    >(`/api/processing-purposes`);
  }

  private mapProcessingPurposesToDataInterface(response: {
    content: ProcessingPurposeInterface[];
  }): BaseCategoryInterface<ProcessingPurposeInterface>[] {
    const processingPurposes = response.content;

    const categorized = categorize<ProcessingPurposeInterface>(
      processingPurposes,
      'processingPurpose'
    );

    categorized.map(category => ({
      ...category,
      items: category.items.map(item => ({
        ...item,
        subItem: category.label
      }))
    }));

    // remove element hidden from the list
    const processingPurposesGroups = [];
    categorized.map(categories => {
      const isHiddenCate = categories.items.find(
        item => item.categoryHidden === true
      );
      const items = categories.items.filter(item => !item.hidden);
      if (!isHiddenCate && items.length > 0) {
        categories.items = items;
        processingPurposesGroups.push(categories);
      }
    });

    return processingPurposesGroups;
  }

  public getAllProcessingPurposesForBusinessProcess(id) {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    const response = this.httpClient.get(
      `/api/business-processes/${id}/approval`
    );
    return response;
  }

  public addOtherElementToTheEndOfProcessingPurposeCategories(
    dataArray: (
      | BaseCategoryInterface<ProcessingPurposeInterface>
      | DataInterface
    )[]
  ) {
    const otherIndex = dataArray
      .map((element: any) => element.label)
      .indexOf('Other');
    if (otherIndex !== -1) {
      const otherElement = dataArray.splice(otherIndex, 1);
      dataArray.push(otherElement[0]);
    }
  }

  public createCustomProcessingPurpose(
    body: ProcessingPurposeRequestInterface
  ): Observable<ProcessingPurposeUpsertResponseInterface> {
    return this.httpClient.request<ProcessingPurposeUpsertResponseInterface>(
      'POST',
      '/api/processing-purposes',
      { body }
    );
  }

  public updateCustomProcessingPurposeById(
    id: string,
    body: ProcessingPurposeRequestInterface
  ): Observable<ProcessingPurposeUpsertResponseInterface> {
    return this.httpClient.request<ProcessingPurposeUpsertResponseInterface>(
      'PUT',
      `/api/processing-purposes/${id}`,
      { body }
    );
  }

  public deleteProcessingPurposes(ids: string[]): Observable<any> {
    return this.httpClient.request('DELETE', '/api/processing-purposes', {
      body: ids
    });
  }

  public putToggleVisibility(ppItems): Observable<any> {
    return this.httpClient.put(`api/processing-purposes/toggleVisibility`, {
      processingPurposeIds: ppItems.map(item => item.id)
    });
  }

  public unlinkProcessingPurposes(
    processingPurposeIds: string[]
  ): Observable<any> {
    return this.httpClient.put<any>(
      '/api/processing-purposes/unlink',
      processingPurposeIds
    );
  }

  public unlinkProcessingPurposesCategories(
    categories: ProcessingPurposeCategoryInterface[]
  ): Observable<any> {
    return this.httpClient.put(`/api/processing-purpose-categories/unlink`, {
      processingPurposeCategoryIds: categories.map(category => category.id)
    });
  }
}
