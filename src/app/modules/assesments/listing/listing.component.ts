import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import * as moment from 'moment';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  loading: boolean = true;
  assessments: any = [];
  filteredAssessments: any;
  perPagePagination: number = 10;
  search: string = '';
  p: number = 1;

  constructor(private assessmentService: QuizService) {}

  ngOnInit(): void {
    this.loading = true;

    this.assessmentService.getAssessments().subscribe((res) => {
      this.assessments = res.body;
      // console.log(this.assessments);
      this.assessments.forEach(
        (element: {
          createdAt: moment.MomentInput;
          questionsPool: string;
          title: any;
        }) => {
          element.createdAt = moment(element.createdAt).format(
            'MMMM Do, YYYY h:mm a'
          );
          element.questionsPool = JSON.parse(element.questionsPool);
          element.title = element.title ? element.title : 'Practice';
        }
      );

      this.filteredAssessments = this.assessments;
      this.loading = false;
    });
  }

  searchAssessment() {
    var list: any[] = [];
    if (this.search) {
      this.assessments.forEach((assessment: { title: string }) => {
        if (
          assessment?.title?.toLowerCase().includes(this.search.toLowerCase())
        ) {
          list.push(assessment);
        }
      });
      this.filteredAssessments = list;
    } else {
      this.filteredAssessments = this.assessments;
    }
  }
}
