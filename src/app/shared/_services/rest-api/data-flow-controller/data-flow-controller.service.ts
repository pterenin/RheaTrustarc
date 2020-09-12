import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { GetItSystemEntityInterface } from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataFlowControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getItSystems(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .get(
        `/api/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public addNewItSystemEntityToItSystem(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .post(
        `/api/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`,
        ''
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public updateItSystemEntityFromDataFlow(
    businessProcessId: string,
    itSystemId: string,
    payload: GetItSystemEntityInterface
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .put(
        `/api/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`,
        payload
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public deleteItSystemEntityFromDataFlow(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .delete(
        `/api/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetItSystems(
    response: GetItSystemEntityInterface
  ): GetItSystemEntityInterface {
    return response;
  }
}
