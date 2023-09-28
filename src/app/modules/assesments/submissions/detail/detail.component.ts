import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { SubmissionService } from 'src/app/services/submission/submission.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  loading: boolean = true;
  currentUser: string | null = '';
  quiz: any;
  result: any;
  questionsType: Set<string> | undefined;
  totalMarks: number = 0;
  formatedTotalTime: string = '';
  badgeEarned: any = '';

  constructor(
    private assessmentService: QuizService,
    private submissionService: SubmissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
    this.getQuizDetail(
      this.activatedRoute.snapshot.paramMap.get('assessmentId')
    );
  }

  getQuizDetail(quizId: string | null) {
    this.assessmentService.getQuizDetailForStudent(quizId).subscribe((res) => {
      this.quiz = res.body;
      this.getSubmissionDetail(quizId);
    });
  }

  getSubmissionDetail(quizId: string | null) {
    console.log(quizId);
    this.assessmentService.getQuizResult(quizId).subscribe((res) => {
      this.result = res.body;
      console.log(this.result);
      this.result.timeSpend =
        Math.floor(this.result.timeSpend / 60) +
        ' min ' +
        Math.floor(this.result.timeSpend % 60) +
        ' sec';

      var percentage = (this.result.result / this.quiz.totalMarks) * 100;
      if (percentage >= 90) {
        this.badgeEarned = 'Gold';
      } else if (percentage >= 70) {
        this.badgeEarned = 'Silver';
      } else if (percentage >= 50) {
        this.badgeEarned = 'Bronze';
      } else {
        this.badgeEarned = 'No';
      }

      this.loading = false;
    });
  }

  attemptWrongQuestions() {
    this.router.navigate([
      'assessments/attempt/',
      this.quiz.id,
      'wrong',
      'questions',
    ]);
  }
}
