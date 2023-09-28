import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  baseUrl: string = environment.reqBaseUrl + 'quizzes/';

  constructor(private http: HttpClient) {}

  GenerateQuiz(paylaod: {
    courseId: string;
    tagsIdList: any;
    questions: { difficultyId: string; count: number }[];
  }) {
    return this.http.post(this.baseUrl, paylaod, {
      observe: 'response',
    });
  }

  getQuizDetail(quizId: string) {
    return this.http.get(this.baseUrl + quizId, {
      observe: 'response',
    });
  }

  getQuizDetailForStudent(quizId: string | null) {
    return this.http.get(this.baseUrl + quizId + '/detail', {
      observe: 'response',
    });
  }

  reAttemptWrongQuestions(quizId: string) {
    return this.http.get(this.baseUrl + quizId + '/wrong/Questions', {
      observe: 'response',
    });
  }

  getQuizResult(quizId: string | null) {
    return this.http.get(this.baseUrl + quizId + '/result', {
      observe: 'response',
    });
  }

  getAssessments() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }
}
