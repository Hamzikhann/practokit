import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { SubmissionService } from 'src/app/services/submission/submission.service';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { HelperService } from 'src/app/services/helper/helper.service';

// import { Dropbox } from 'dropbox';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.css'],
})
export class AttemptComponent implements OnInit {
  imgUrl: string = environment.imgBaseUrl;
  quizId: any;
  quiz: any;
  grade: string = '';
  course: string = '';
  questions: {
    id: string;
    statement: string;
    duration: any;
    remainingDuration: any;
    points: string;
    selectedOption: string | null;
    questionType: any;
    questionDifficulty: {
      id: string;
      title: string | undefined;
    };
    questionsAttribute: {
      hint: any;
      hintFile: any;
      hintFileSource: any;
      solutionFile: string;
      solutionFileSource: string;
      statementImage: any;
      statementImageSource: any;
    };
    questionsOptions: {
      id: string;
      title: string;
      image: any;
      imageSource: any;
    }[];
  }[] = [];

  timeHighlight: boolean = false;
  blank: string = '';
  setEndTime: any;
  endTS: any;
  currentQuestionIndex!: number;
  loading = true;
  remainingTime: any;
  progress: number = 0;
  totalQuestions!: number;
  formatedTime: string = '';
  safeUrl: any;
  hintSafeUrl: any;
  optionsSafeUrl: any = ['', '', '', '', '', '', '', ''];
  timeleft: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private quizService: QuizService,
    private submissionService: SubmissionService,
    private helperService: HelperService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    console.log(this.quizId);
    this.getQuizDetail();
  }

  ngOnDestroy(): void {
    clearInterval(this.remainingTime);
  }

  getQuizDetail() {
    if (this.router.url.indexOf('/wrong/questions') > -1) {
      this.quizService
        .reAttemptWrongQuestions(this.quizId)
        .subscribe((quiz) => {
          this.setQuizDetail(quiz.body);
        });
    } else {
      this.quizService.getQuizDetail(this.quizId).subscribe((quiz) => {
        console.log(quiz);
        if (!quiz) {
          this.router.navigate(['/builder']);
        } else {
          this.setQuizDetail(quiz.body);
        }
      });
    }
  }

  setQuizDetail(response: Object | null) {
    this.quiz = response;
    this.course = this.quiz['courseTitle'];
    this.grade = this.quiz['classTitle'];
    this.attemptQuiz(this.quiz['questionsPool']);
  }

  attemptQuiz(questionsPool: any) {
    this.scrollToTop();
    this.resetAllVariables();
    this.setQuestions(questionsPool);
  }

  async setQuestions(questionsPool: any[]) {
    console.log(this.questions.length);
    await questionsPool.forEach((element) => {
      this.questions.push({
        id: element.id,
        statement: element.statement,
        duration: element.duration,
        remainingDuration: element.duration,
        questionType: element.questionType,
        points: element.points,
        selectedOption: null,
        questionsAttribute: element.questionsAttribute,
        questionDifficulty: element.questionDifficulty,
        questionsOptions: element.questionsOptions,
      });
    });
    this.totalQuestions = this.questions.length;

    if (this.totalQuestions != 0) {
      this.loadImage();
      this.formatTime(
        this.questions[this.currentQuestionIndex]['remainingDuration']
      );
      this.startTime();
    }

    this.loading = false;
  }

  loadImage() {
    // var dbx = new Dropbox({ accessToken: environment.dropBoxToken });

    if (
      this.questions[this.currentQuestionIndex].questionsAttribute
        ?.statementImage
    ) {
      this.helperService
        .getFileSafeUrl({
          file: this.questions[this.currentQuestionIndex].questionsAttribute
            .statementImage,
        })
        .subscribe((res: any) => {
          const response = res.body;

          this.safeUrl = response.safeUrl;
        });
      // dbx
      //   .filesDownload({
      //     path: this.questions[this.currentQuestionIndex].questionsAttribute
      //       .statementImage,
      //   })
      //   .then((res: any) => {
      //     this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     console.log('got error:', error);
      //     this.safeUrl = '';
      //   });
    }

    var options = this.questions[this.currentQuestionIndex].questionsOptions;
    if (options[0]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[0]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[0] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[0].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[0] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[0] = '';
      //     console.log('0 got error:', error);
      //   });
    }
    if (options[1]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[1]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[1] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[1].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[1] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[1] = '';
      //     console.log('1 got error:', error);
      //   });
    }
    if (options[2]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[2]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[2] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[2].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[2] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[2] = '';
      //     console.log('2 got error:', error);
      //   });
    }
    if (options[3]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[3]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[3] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[3].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[3] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[3] = '';
      //     console.log('3 got error:', error);
      //   });
    }
    if (options[4]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[4]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[4] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[4].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[4] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[4] = '';
      //     console.log('4 got error:', error);
      //   });
    }
    if (options[5]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[5]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[5] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[5].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[5] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[5] = '';
      //     console.log('5 got error:', error);
      //   });
    }
    if (options[6]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[6]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[6] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[6].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[6] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[6] = '';
      //     console.log('6 got error:', error);
      //   });
    }
    if (options[7]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[7]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[7] = response.safeUrl;
        });
      // dbx
      //   .filesDownload({ path: options[7].image })
      //   .then((res: any) => {
      //     this.optionsSafeUrl[7] = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     this.optionsSafeUrl[7] = '';
      //     console.log('7 got error:', error);
      //   });
    }

    if (
      this.questions[this.currentQuestionIndex].questionsAttribute?.hintFile
    ) {
      this.helperService
        .getFileSafeUrl({
          file: this.questions[this.currentQuestionIndex].questionsAttribute
            .hintFile,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.hintSafeUrl = response.safeUrl;
        });
      // dbx
      //   .filesDownload({
      //     path: this.questions[this.currentQuestionIndex].questionsAttribute
      //       .hintFile,
      //   })
      //   .then((res: any) => {
      //     this.hintSafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      //       window.URL.createObjectURL(res.result.fileBlob)
      //     );
      //   })
      //   .catch((error) => {
      //     console.log('got error:', error);
      //     this.hintSafeUrl = null;
      //   });
    }
  }

  startTime() {
    var currentQuestion = this.questions[this.currentQuestionIndex];
    if (
      currentQuestion.questionsAttribute?.statementImage ||
      currentQuestion.questionsOptions[0]?.image ||
      currentQuestion.questionsOptions[1]?.image ||
      currentQuestion.questionsOptions[2]?.image ||
      currentQuestion.questionsOptions[3]?.image ||
      currentQuestion.questionsOptions[4]?.image ||
      currentQuestion.questionsOptions[5]?.image ||
      currentQuestion.questionsOptions[6]?.image ||
      currentQuestion.questionsOptions[7]?.image
    ) {
      setTimeout(() => {
        this.remainingTime = setInterval(() => {
          if (this.remainingTime != 0) {
            this.UpdateRemainingTime();
          }
        }, 1000);
      }, 1500);
    } else {
      this.remainingTime = setInterval(() => {
        if (this.remainingTime != 0) {
          this.UpdateRemainingTime();
        }
      }, 500);
    }
  }

  calculateProgress() {
    this.progress = 0;
    this.questions.forEach((element) => {
      if (element.selectedOption != null) {
        // check Not Usefull Because student cannot return back to attempt question
        this.progress += 100 / this.totalQuestions;
      }
    });
  }

  nextQuestion() {
    this.scrollToTop();
    this.resetLinks();
    this.setEndTime = false;
    clearInterval(this.remainingTime);

    this.currentQuestionIndex = this.currentQuestionIndex + 1;
    this.formatTime(
      this.questions[this.currentQuestionIndex]['remainingDuration']
    );
    this.loadImage();
    this.startTime();
  }

  formatTime(time: number) {
    this.formatedTime =
      parseInt((time / 60).toString()) +
      ' Min ' +
      parseInt((time % 60).toString()) +
      ' Sec';
  }

  UpdateRemainingTime() {
    var currentTime = moment().format('h:mm:ss');
    var endTime = moment()
      .add(this.questions[this.currentQuestionIndex].duration, 'seconds')
      .format('h:mm:ss');

    var currentTS =
      +currentTime.split(':')[0] * 3600 +
      +currentTime.split(':')[1] * 60 +
      +currentTime.split(':')[2];
    if (!this.setEndTime) {
      this.endTS =
        +endTime.split(':')[0] * 3600 +
        +endTime.split(':')[1] * 60 +
        +endTime.split(':')[2];
    }
    this.setEndTime = true;

    var n = this.endTS - currentTS;

    this.formatTime(n);
    if (n <= 10) {
      this.timeHighlight = true;
    }
    this.questions[this.currentQuestionIndex].remainingDuration = n;
    this.timeleft = (n / 10) * 100;

    if (n <= 0) {
      this.scrollToBottom();
      clearInterval(this.remainingTime);

      if (this.currentQuestionIndex + 1 == this.questions.length) {
        this.toastr.error('Quiz Timeout.');
        this.submitQuiz();
      } else {
        this.autoNext(this.currentQuestionIndex);
      }
    }
  }

  autoNext(index: number) {
    if (this.currentQuestionIndex + 1 != this.questions.length) {
      setTimeout(() => {
        if (index == this.currentQuestionIndex) {
          this.nextQuestion();
        }
      }, 3000);
    }
  }

  submitQuiz() {
    clearInterval(this.remainingTime);
    if (document.getElementsByClassName('closeModal').length !== 0) {
      let click = document.getElementById('closeModal');

      click?.click();
    }

    var payload = {
      quizId: this.quiz['id'],
      response: JSON.stringify(this.questions),
    };

    this.submissionService.SubmitQuiz(payload).subscribe((res) => {
      this.toastr.success('Quiz Submitted Successfully');
      this.router.navigate(['assessments/submissions/result', this.quiz['id']]);
    });
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 5);
      }
    })();
  }

  scrollToBottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  resetAllVariables() {
    this.setEndTime = false;
    this.progress = 0;
    this.currentQuestionIndex = 0;
    this.resetLinks();
    clearInterval(this.remainingTime);
  }

  resetLinks() {
    this.timeHighlight = false;
    this.safeUrl = '';
    this.optionsSafeUrl.forEach((element: any, index: string | number) => {
      this.optionsSafeUrl[index] = '';
    });
    this.hintSafeUrl = '';
  }
}
