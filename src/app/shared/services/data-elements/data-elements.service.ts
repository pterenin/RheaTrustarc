import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomDataElement,
  CustomDataElementInterface,
  DataElementCategoryInterface,
  DataElementInterface,
  DataElementLevelInterface
} from '../../models/data-elements.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataInterface } from '../../components/categorical-view/categorical-view.component';
import { SearchResponseInterface } from '../../models/search.model';
import { defaultTo } from '../../utils/basic-utils';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { DataElementSettingsInterface } from 'src/app/settings/data-elements/custom-data-elements.model';

export interface DataElementCategoryListResponseInterface {
  dataElements: SearchResponseInterface<DataElementSettingsInterface>;
  categoryDetails: DataElementCategoryListDetailsInterface;
}

export interface DataElementCategoryListDetailsInterface {
  categoryName: string;
  categoryId: string;
  categoryVersion: number;
  isCustom: boolean;
  isHidden: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataElementsService {
  private static columnNameToSortNameMap = {
    name: 'dataElement',
    dataElementType: 'type',
    identifier: 'identifier',
    dataElements: 'dataElements',
    linkedRecords: 'linkedRecords'
  };

  constructor(private httpClient: HttpClient) {}

  public getAllDataElements(): Observable<DataInterface[]> {
    return this.httpClient
      .get<{ content: DataElementInterface[] }>(`/api/data-elements?size=1000`)
      .pipe(map(this.mapDataElementsToDataInterface));
  }

  public getAllCategories(
    page?: number,
    showAllHidden: boolean = true
  ): Observable<DataElementCategoryInterface[]> {
    let params = new HttpParams()
      .append('page', defaultTo('0', page))
      .append('size', '50');
    if (showAllHidden) {
      params = params.append('onlyCustom', 'false');
      params = params.append('onlyDefault', 'false');
      params = params.append('onlyHidden', 'false');
      params = params.append('onlyVisible', 'false');
    }

    return this.httpClient
      .get<{ content: DataElementCategoryInterface[] }>(
        `api/data-element-categories`,
        { params: params }
      )
      .pipe(map(this.mapCategoryToCategoryInterface));
  }

  public getAllClassificationLevel(): Observable<DataElementLevelInterface> {
    return this.httpClient.get<DataElementLevelInterface>(
      `api/data-elements/data-element-types`
    );
  }

  public createCustomDataElement(
    dataElement: CustomDataElement
  ): Observable<CustomDataElementInterface> {
    return this.httpClient.post<CustomDataElementInterface>(
      'api/data-elements',
      dataElement
    );
  }

  public updateCustomDataElement(
    dataElement: CustomDataElement
  ): Observable<CustomDataElementInterface> {
    return this.httpClient.put<CustomDataElementInterface>(
      `api/data-elements/${dataElement.dataElementId}`,
      dataElement
    );
  }

  private mapDataElementsToDataInterface(response: {
    content: DataElementInterface[];
  }): DataInterface[] {
    const dataElements = response.content;

    return dataElements.reduce((uiDataElements, dataElement) => {
      let uiDataElement = uiDataElements.find(
        uiDE =>
          uiDE.label + uiDE.categoryId ===
          dataElement.category + dataElement.categoryId
      );
      // Create a new parent if one is not found.
      if (!uiDataElement) {
        uiDataElement = {
          label: dataElement.category,
          categoryId: dataElement.categoryId,
          id: '',
          items: []
        };
        uiDataElements = uiDataElements.concat(uiDataElement);
      }
      // Add the new child.
      uiDataElement.items = uiDataElement.items.concat({
        label: dataElement.dataElement,
        id: dataElement.id,
        selected: false,
        isCustom: dataElement.isCustom,
        subItem: uiDataElement.label
      });
      return uiDataElements;
    }, [] as DataInterface[]);
  }

  private mapCategoryToCategoryInterface(
    response: SearchResponseInterface<DataElementCategoryInterface>
  ): DataElementCategoryInterface[] {
    return response.content;
  }

  /**
   * Admin function.  Gets all elements for a category with filters for visibility and creator.
   *
   * @param request specifies which page and how manyt records to retrieve.
   * @param visibility can be used to show hidden elements.
   * @param creation can be used to filter for system or custom elements.
   */
  public getDataElementsSettingsByCategory(
    request: TaTableRequest,
    categoryId: string,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<DataElementCategoryListResponseInterface> {
    //
    const viewCustomStr = creation !== 'system' ? 'true' : 'false';
    const viewDefaultStr = creation !== 'custom' ? 'true' : 'false';
    const viewHiddenStr = visibility !== 'visible' ? 'true' : 'false';
    const viewVisibleStr = visibility !== 'hidden' ? 'true' : 'false';

    let params = new HttpParams()
      .append('page', request.page.toString())
      .append('size', request.maxRows.toString())
      .append('viewCustom', viewCustomStr)
      .append('viewDefault', viewDefaultStr)
      .append('viewHidden', viewHiddenStr)
      .append('viewVisible', viewVisibleStr);

    const sortColumnName =
      DataElementsService.columnNameToSortNameMap[request.columnSort];
    if (sortColumnName) {
      const sortTypeExists = request.sortType && request.sortType.length > 0;

      const sortRequest = sortTypeExists
        ? `${sortColumnName},${request.sortType}`
        : sortColumnName;
      params = params.append('sort', sortRequest);
    }

    const url = `/api/data-element-categories/${categoryId}/details`;

    return this.httpClient.get<DataElementCategoryListResponseInterface>(url, {
      params: params
    });
  }

  public mapToCustomDataElement(
    response: any,
    dataElementId: string
  ): CustomDataElement {
    const customDataElement: CustomDataElement = {
      category: response.category.category,
      categoryId: response.category.id,
      dataElement: response.name,
      dataElementId: dataElementId,
      version: 0,
      type: response.level
    };
    return customDataElement;
  }

  public toggleDataElements(dataElementIds: string[]): Observable<any> {
    return this.httpClient.put(`/api/data-elements/toggleVisibility`, {
      dataElementIds
    });
  }

  public deleteDataElements(dataElementIds: string[]): Observable<any> {
    return this.httpClient.request('DELETE', `/api/data-elements`, {
      body: dataElementIds
    });
  }

  public unlinkDataElements(dataElementIds: string[]): Observable<any> {
    return this.httpClient.put<any>(
      '/api/data-elements/unlink',
      dataElementIds
    );
  }
}
