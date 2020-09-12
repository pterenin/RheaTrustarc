import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/utils.service';
import {
  BusinessProcessApprovalInterface,
  BusinessProcessApprovalUpdateInterface,
  BusinessProcessApprovalUpdateResponseInterface,
  BusinessProcessDetailsInterface,
  BusinessProcessOverviewInterface,
  BusinessProcessOwnerInterface,
  NotesInterface,
  StatusInterface
} from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class BusinessProcessControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  //#region  find Overview

  public findOverviewById(
    businessProcessId: string
  ): Observable<BusinessProcessOverviewInterface> {
    return this.httpClient
      .get(`/api/business-processes/overview/${businessProcessId}`)
      .pipe(
        map(this.mapFindOverviewById),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public updateOverview(
    payload: BusinessProcessOverviewInterface
  ): Observable<BusinessProcessOverviewInterface> {
    return this.httpClient
      .put(`/api/business-processes/overview`, payload)
      .pipe(
        map(this.mapFindOverviewById),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapFindOverviewById(
    response: BusinessProcessOverviewInterface
  ): BusinessProcessOverviewInterface {
    return response;
  }

  //#endregion

  //#region  Approvals

  public getApprovalById(
    businessProcessId: string
  ): Observable<BusinessProcessApprovalInterface> {
    return this.httpClient
      .get(`/api/business-processes/${businessProcessId}/approval`)
      .pipe(
        // tap(this.showData),
        map(this.mapApprovalById),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapApprovalById(
    response: BusinessProcessApprovalInterface
  ): BusinessProcessApprovalInterface {
    return response;
  }

  public updateApproval(
    data: BusinessProcessApprovalUpdateInterface,
    businessProcessId: string
  ): Observable<BusinessProcessApprovalUpdateResponseInterface> {
    return this.httpClient
      .put(`/api/business-processes/${businessProcessId}/approval`, data)
      .pipe(
        map(this.mapApprovalUpdateResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapApprovalUpdateResponse(
    response: BusinessProcessApprovalUpdateResponseInterface
  ): BusinessProcessApprovalUpdateResponseInterface {
    return response;
  }

  //#endregion

  //#region  Owners

  private mapGetOwners(
    response: BusinessProcessOwnerInterface[]
  ): BusinessProcessOwnerInterface[] {
    return response;
  }

  public getOwnersById(
    businessProcessId: string
  ): Observable<BusinessProcessOwnerInterface[]> {
    return this.httpClient
      .get(`/api/business-processes/${businessProcessId}/owners`)
      .pipe(
        map(this.mapGetOwners),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public postBusinessProcessOwner(
    id,
    businessProcessOwnerRequest
  ): Observable<any> {
    return this.httpClient
      .post(`/api/business-processes/${id}/owners`, businessProcessOwnerRequest)
      .pipe(
        map((response: string) => response),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public putBusinessProcessOwner(
    id,
    businessProcessOwnerRequest
  ): Observable<any> {
    return this.httpClient
      .put(`/api/business-processes/${id}/owners`, businessProcessOwnerRequest)
      .pipe(
        map((response: string) => response),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public deleteBusinessProcessOwner(id, ownerId): Observable<any> {
    return this.httpClient
      .delete(`/api/business-processes/${id}/owners/${ownerId}`)
      .pipe(
        map((response: string) => response),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public deleteBusinessProcessOwners(id, ownerIds): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: ownerIds
    };
    return this.httpClient
      .delete(`/api/business-processes/${id}/owners`, httpOptions)
      .pipe(
        map((response: string) => response),
        catchError(this.httpUtilsService.handleError)
      );
  }

  //#endregion

  //#region  getBusinessProcessDetails

  public getBusinessProcessDetails(
    businessProcessId: string
  ): Observable<BusinessProcessDetailsInterface> {
    return this.httpClient
      .get(`/api/business-processes/${businessProcessId}/details`)
      .pipe(
        map(this.mapBusinessProcessDetailsResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapBusinessProcessDetailsResponse(
    response: BusinessProcessDetailsInterface
  ): BusinessProcessDetailsInterface {
    return response;
  }

  public updateBusinessProcessDetails(
    data: BusinessProcessDetailsInterface,
    businessProcessId: string
  ): Observable<BusinessProcessDetailsInterface> {
    return this.httpClient
      .put(`/api/business-processes/${businessProcessId}/details`, data)
      .pipe(
        map(this.mapBusinessProcessDetailsResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  //#endregion

  //#region  getBusinessProcessDetails

  public getBusinessProcessNotes(
    businessProcessId: string
  ): Observable<NotesInterface> {
    return this.httpClient
      .get(`/api/business-processes/${businessProcessId}/notes`)
      .pipe(
        map(this.mapBusinessProcessNotesResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapBusinessProcessNotesResponse(
    response: NotesInterface
  ): NotesInterface {
    return response;
  }

  public updateBusinessProcessNotes(
    data: NotesInterface,

    businessProcessId: string
  ): Observable<NotesInterface> {
    return this.httpClient
      .put(`/api/business-processes/${businessProcessId}/notes`, data)
      .pipe(
        map(this.mapBusinessProcessNotesResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  //#endregion

  //#region bp status

  public putBusinessProcessStatus(
    businessProcessId: string,
    data: StatusInterface
  ): Observable<StatusInterface> {
    return this.httpClient
      .put(`/api/business-processes/${businessProcessId}/status`, data)
      .pipe(
        map(this.mapBusinessProcessStatusesResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public getBusinessProcessStatus(
    businessProcessId: string
  ): Observable<StatusInterface> {
    return this.httpClient
      .get(`/api/business-processes/${businessProcessId}/status`)
      .pipe(
        map(this.mapBusinessProcessStatusesResponse),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapBusinessProcessStatusesResponse(
    response: StatusInterface
  ): StatusInterface {
    return response;
  }
  //#endregion
}
