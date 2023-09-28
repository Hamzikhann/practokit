import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportProblemService {
  baseUrl: string = environment.reqBaseUrl + 'problems/';

  constructor(private http: HttpClient) {}

  getReportedProblem() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  reportProblem(payload: { subject: string; description: string }) {
    return this.http.post(this.baseUrl + 'report/', payload, {
      observe: 'response',
    });
  }
}
