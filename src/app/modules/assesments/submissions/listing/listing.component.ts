import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SubmissionService } from 'src/app/services/submission/submission.service';

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

  constructor(
    private router: Router,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.submissionService.getAllSubmissions().subscribe((res) => {
      this.assessments = res.body;
      this.assessments.forEach(
        (element: {
          createdAt: moment.MomentInput;
          questionsPool: string;
          title: any;
        }) => {
          element.createdAt = moment(element.createdAt).format(
            'MMMM Do, YYYY, h:mm a'
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
    var list: any = [];
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
