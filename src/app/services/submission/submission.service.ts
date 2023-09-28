import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  baseUrl: string = environment.reqBaseUrl + 'submissions/';

  constructor(private http: HttpClient) {}

  SubmitQuiz(payload: { quizId: any; response: string }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  getAllSubmissions() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getSubmissionDetail(quizId: string, userId: string) {
    return this.http.get(this.baseUrl + quizId + '/' + userId, {
      observe: 'response',
    });
  }
}
