import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataElementListResponseRawInterface } from '../../../_interfaces/data-inventory/data-element/data-element.interface';

@Injectable({
  providedIn: 'root'
})
export class DataElementService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get data elements list
   * @description: Get data elements list
   * @controller: data-element-controller
   * @link: /GET /data-elements findCustomsAndNonCustomsByOrderByCategoryAscDataElementAsc
   */
  public getDataElementsList(): Observable<
    DataElementListResponseRawInterface
  > {
    return this.httpClient.get<DataElementListResponseRawInterface>(
      `/api/data-elements?size=1000`
    );
  }
}
