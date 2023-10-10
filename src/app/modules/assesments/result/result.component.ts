import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz/quiz.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  loading: boolean = false;
  quizId: string | null = '';
  quiz: any;
  timeSpend: string = '';
  formatedSpendTime: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    console.log(this.quizId);
    this.getQuizResult();
  }

  getQuizResult() {
    this.quizService.getQuizResult(this.quizId).subscribe((result) => {
      if (!result.body) {
        this.router.navigate(['assessments/builder']);
      } else {
        this.quiz = result.body;
        this.timeSpend = this.quiz['timeSpend'];
        this.formatTime(+this.timeSpend);
        this.loading = false;
      }
    });
  }

  formatTime(time: number) {
    this.formatedSpendTime =
      parseInt((time / 60).toString()) +
      ' min ' +
      parseInt((time % 60).toString()) +
      ' sec';
  }

  attemptWrongQuestions() {
    this.router.navigate([
      'assessments/attempt/',
      this.quizId,
      'wrong',
      'questions',
    ]);
  }
}
