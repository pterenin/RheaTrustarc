import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';

import {
  ItSystemRecordsFilterInterface,
  ItSystemRecordsSearchFiltersRequestInterface
} from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public itSystemRecordsFilters(
    data: ItSystemRecordsSearchFiltersRequestInterface,
    businessProcessId: string
  ): Observable<ItSystemRecordsFilterInterface> {
    return this.httpClient
      .post(
        `/api/search/it-systems/business-process-id/${businessProcessId}`,
        data
      )
      .pipe(
        map(this.mapItSystemRecordsFilters),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapItSystemRecordsFilters(
    response: ItSystemRecordsFilterInterface
  ): ItSystemRecordsFilterInterface {
    return response;
  }
}
