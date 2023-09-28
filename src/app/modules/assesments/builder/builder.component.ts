import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DifficultyService } from 'src/app/services/difficulty/difficulty.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { TagService } from 'src/app/services/questionTag/tag.service';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css'],
})
export class BuilderComponent implements OnInit {
  step: number = 1;

  goToStep(number: number) {
    this.step = number;
  }

  loading: boolean = false;
  tagLoading: boolean = false;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;

  gradeList: any;
  filteredGradeList: any;
  courseId: string = ''; // remove
  selectedCourse: {
    id: string;
    title: string;
    grade: {
      id: string;
      title: string;
    };
  } = { id: '', title: '', grade: { id: '', title: '' } };

  difficultyList: any;
  difficulties: {
    difficultyId: string;
    count: number;
  }[] = [];

  tagList: any;
  filteredTagList: any;
  selectedTags: {
    id: string;
    title: string;
  }[] = [];
  topics: any = [];

  deleteButtonClicked: boolean = false;
  validQuiz: boolean = false;

  title: any;
  tagTitle: any;

  reviewClass: string = ''; // remove
  reviewCourse: string = ''; // remove
  reviewSelectedTags: string[] = []; // remove
  reviewDifficulties: {
    title: string;
    count: number;
  }[] = [];

  constructor(
    private gradeService: GradeService,
    private tagService: TagService,
    private diffService: DifficultyService,
    private quizService: QuizService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getClasses();
    this.getDifficulties();
    this.scrollToTop();
  }

  getClasses() {
    this.gradeService.getGradesWithCourses().subscribe((res) => {
      this.gradeList = res.body;
      this.filteredGradeList = this.gradeList;
      this.loading = false;
    });
  }

  getTags(courseId: any) {
    this.tagLoading = true;
    this.tagService.getTagsByCourseId(courseId).subscribe((res) => {
      this.tagList = res.body;
      this.filteredTagList = this.tagList;
      this.tagLoading = false;
    });
  }

  getDifficulties() {
    this.diffService.getAllDifficulties().subscribe((res) => {
      this.difficultyList = res.body;
      this.difficultyList.forEach((diff: { id: any }) => {
        this.difficulties.push({ difficultyId: diff.id, count: 0 });
      });
    });
  }

  setSelectedCourse(
    grade: { id: any; title: any },
    course: { id: any; title: any }
  ) {
    this.selectedCourse = {
      id: course.id,
      title: course.title,
      grade: {
        id: grade.id,
        title: grade.title,
      },
    };
  }

  selectTag(tag: { id: any; title: any }) {
    if (!this.deleteButtonClicked && this.topics.indexOf(tag.id) == -1) {
      this.selectedTags.push({
        id: tag.id,
        title: tag.title,
      });
      this.topics.push(tag.id);
    } else {
      this.deleteButtonClicked = false;
    }
  }

  deleteTag(tagId: string) {
    this.selectedTags.splice(
      this.selectedTags
        .map((e) => {
          return e.id;
        })
        .indexOf(tagId),
      1
    );
    this.topics.splice(this.topics.indexOf(tagId), 1);
  }

  validDifficulties() {
    this.validQuiz = false;
    this.difficulties.forEach((element) => {
      if (element.count == null) {
        element.count = 0;
      }
      if (element.count > 0) {
        this.validQuiz = true;
      }
    });

    if (!this.validQuiz) {
      this.toastr.error('All levels can not be 0');
    } else {
      this.goToStep(3);
    }
  }

  getReviewData() {
    this.reviewDifficulties = [];

    this.difficultyList.forEach((diff: { id: string; title: any }) => {
      const index = this.difficulties.findIndex(
        (x) => x.difficultyId === diff.id
      );
      if (index != -1 && this.difficulties[index].count) {
        this.reviewDifficulties.push({
          title: diff.title,
          count: this.difficulties[index].count,
        });
      }
    });
  }

  ActivateStep1() {
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
  }
  ActivateStep2() {
    this.step2 = true;
    this.step1 = false;
    this.step3 = false;
  }
  ActivateStep3() {
    this.step3 = true;
    this.step2 = false;
    this.step1 = false;
  }
  confirmStartQuiz() {
    if (!this.topics.length) {
      this.toastr.error('Please Select Some Tags.!');
    } else {
      var payload = {
        courseId: this.selectedCourse.id,
        tagsIdList: this.topics,
        questions: this.difficulties,
      };
      this.quizService.GenerateQuiz(payload).subscribe((res: any) => {
        this.toastr.success('Quiz Started!');
        this.router.navigate(['assessments/attempt/', res.body['quizId']]);
      });
    }
  }

  SearchClassCourse() {
    if (this.title) {
      this.filteredGradeList = [];
      this.gradeList.forEach(
        (grade: {
          title: string;
          id: any;
          courses: any[];
          isActive: any;
          createdBy: any;
        }) => {
          if (grade.title.toLowerCase().includes(this.title.toLowerCase())) {
            if (
              this.filteredGradeList.indexOf(
                (g: { id: any }) => g.id === grade.id
              ) == -1
            ) {
              this.filteredGradeList.push(grade);
            }
          } else {
            var courses: any[] = [];

            grade.courses.forEach((course) => {
              if (
                course.title.toLowerCase().includes(this.title.toLowerCase())
              ) {
                if (
                  this.filteredGradeList.indexOf(
                    (g: { id: any }) => g.id == grade.id
                  ) == -1
                ) {
                  courses.push(course);
                }
              }
            });

            if (courses.length) {
              this.filteredGradeList.push({
                id: grade.id,
                title: grade.title,
                isActive: grade.isActive,
                createdBy: grade.createdBy,
                courses: courses,
              });
            }
          }
        }
      );
    } else {
      this.filteredGradeList = this.gradeList;
    }
  }

  SearchTags() {
    if (this.tagTitle) {
      this.filteredTagList = [];
      this.tagList.forEach((tag: { id: any; title: string }) => {
        if (
          this.topics.includes(tag.id) ||
          tag.title.toLowerCase().includes(this.tagTitle.toLowerCase())
        ) {
          if (this.filteredTagList.indexOf(tag)) {
            this.filteredTagList.push(tag);
          }
        }
      });
    } else {
      this.filteredTagList = this.tagList;
    }
  }

  logOut() {
    this.authService.logOut();
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
}
