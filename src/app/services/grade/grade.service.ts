import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  baseUrl: string = environment.reqBaseUrl + "classes/";
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(
    private http: HttpClient,
  ) {}

  getGradesWithCourses() {
    return this.http.get(this.baseUrl + "courses" , {
      observe: "response",
    });
  }
}
