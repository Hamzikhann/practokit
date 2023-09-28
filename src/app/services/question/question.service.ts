import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  baseUrl: string = environment.reqBaseUrl + 'questions/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  getCourseQuestionsCount(courseId?: string | undefined) {
    if (courseId) {
      return this.http.get(this.baseUrl + 'course/' + courseId + '/count', {
        observe: 'response',
      });
    } else {
      return this.http.get(this.baseUrl + 'all/count', {
        observe: 'response',
      });
    }
  }
}
