import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  private RHEA_BP_SUMMARY = 'RHEA_BP_SUMMARY';
  private RHEA_ARTICLE_30 = 'RHEA_ARTICLE_30';
  private idRequestParamSeparator = ',';
  constructor(private httpClient: HttpClient) {}

  public downloadMultiBusinessProcessSummaryReport(selectedItems: any[]) {
    const listOfBpIds = this.getIdsFromBusinessProcessList(selectedItems);
    return this.requestReport(this.RHEA_BP_SUMMARY, listOfBpIds);
  }

  public downloadMultiArticle30Report(selectedItems: any[]) {
    const listOfBpIds = this.getIdsFromBusinessProcessList(selectedItems);
    return this.requestReport(this.RHEA_ARTICLE_30, listOfBpIds);
  }

  private requestReport(reportType, listOfBpIds) {
    return this.httpClient.get(
      `/api/reports/multiple-document-file?reportType=${reportType}&entityIds=${listOfBpIds}`,
      {
        responseType: 'blob'
      }
    );
  }

  private getIdsFromBusinessProcessList(bpList) {
    return bpList.map(item => item.id).join(this.idRequestParamSeparator);
  }
}
