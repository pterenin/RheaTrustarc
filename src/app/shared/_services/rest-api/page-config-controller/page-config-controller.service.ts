import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { ColumnConfigControllerInterface } from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class PageConfigControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getColumnConfig(
    page: string
  ): Observable<ColumnConfigControllerInterface> {
    const params = new HttpParams();

    return this.httpClient
      .get(`/api/page/${page}/columns`, { params })
      .pipe(
        map(this.mapGetColumnConfig),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public updateColumnConfig(
    page: string,
    payload: ColumnConfigControllerInterface
  ): Observable<ColumnConfigControllerInterface> {
    return this.httpClient
      .post(`/api/page/${page}/columns`, payload)
      .pipe(
        map(this.mapPostColumnConfig),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public deleteColumnConfig(page: string): Observable<void> {
    return this.httpClient
      .delete(`/api/page/${page}/columns`)
      .pipe(
        map(this.mapDeleteColumnConfig),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetColumnConfig(
    response: ColumnConfigControllerInterface
  ): ColumnConfigControllerInterface {
    return response;
  }

  private mapPostColumnConfig(
    response: ColumnConfigControllerInterface
  ): ColumnConfigControllerInterface {
    return response;
  }

  private mapDeleteColumnConfig(
    response: ColumnConfigControllerInterface
  ): void {
    return undefined;
  }
}
