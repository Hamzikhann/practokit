import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ReportProblemService } from 'src/app/services/report-problem/report-problem.service';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.css'],
})
export class ReportProblemComponent implements OnInit {
  loading: boolean = false;
  subject: string = '';
  description: string = '';
  subjectList: any = ['Issue with Question', 'Technical issue', 'Other'];
  viewListing: boolean = false;
  reportedProblems: any;

  constructor(
    private reportProblemService: ReportProblemService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.getReportedProblems();
  }

  getReportedProblems() {
    this.loading = true;
    this.reportProblemService.getReportedProblem().subscribe((res) => {
      this.reportedProblems = res.body;
      this.reportedProblems.forEach(
        (element: {
          date: string;
          createdAt: moment.MomentInput;
          time: string;
          ago: string;
        }) => {
          element.date = moment(element.createdAt).format('MMM Do, YYYY');
          element.time = moment(element.createdAt).format('h:mm a');
          element.ago = moment(element.createdAt).startOf('minutes').fromNow();
        }
      );
      this.loading = false;
    });
  }

  reportProblem() {
    var error = '';
    if (!this.subject) {
      error = 'Please Select Subject.';
    } else if (!this.description) {
      error = 'Please Enter Description.';
    }
    if (error) {
      this.toastr.error(error);
    } else {
      var payload = {
        subject: this.subject,
        description: this.description,
      };

      this.reportProblemService.reportProblem(payload).subscribe((res) => {
        this.toastr.success('Problem Reported successfully');
        this.viewListing = true;
        this.getReportedProblems();
      });
    }
  }
}
