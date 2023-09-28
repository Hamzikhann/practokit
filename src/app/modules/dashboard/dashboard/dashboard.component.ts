import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from 'src/app/services/question/question.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

// Graph
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { AuthService } from 'src/app/services/auth/auth.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: any;

  loading: boolean = true;
  questionCount: any;
  percentage: number = 0;
  currentMonthAssessments: number = 0;
  currentUser: any;

  constructor(
    private questionService: QuestionService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.getUser().subscribe((res) => {
      this.currentUser = res;
    });
    this.getQuestionCount();
  }

  getQuestionCount() {
    this.questionService.getCourseQuestionsCount().subscribe((res) => {
      this.questionCount = res.body;
      this.getDashboard();
    });
  }

  getDashboard() {
    this.dashboardService.getDashboard().subscribe((res: any) => {
      var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var attempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var notAttempt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      var month = +res.body.yearLaterDate.split(' ')[0].split('-')[1];

      const previousMonth = new Date().getMonth();

      var lastMonthAssessments = 0;
      this.currentMonthAssessments = 0;

      res.body.quiz.forEach(
        (assessment: {
          createdAt: string;
          quizSubmissions: string | any[];
        }) => {
          var attemptMonth = +assessment.createdAt.split(' ')[0].split('-')[1];

          total[(+attemptMonth + (12 - month)) % 12] =
            total[(+attemptMonth + (12 - month)) % 12] + 1; // Show Graph of 12 months
          if (assessment.quizSubmissions.length == 0) {
            notAttempt[(+attemptMonth + (12 - month)) % 12] =
              notAttempt[(+attemptMonth + (12 - month)) % 12] + 1;
          } else {
            attempt[(+attemptMonth + (12 - month)) % 12] =
              attempt[(+attemptMonth + (12 - month)) % 12] + 1;

            if (previousMonth == attemptMonth) {
              lastMonthAssessments += 1;
            } else if (previousMonth + 1 == attemptMonth) {
              this.currentMonthAssessments += 1;
            }
          }
        }
      );

      const flag = lastMonthAssessments == 0 ? true : false;
      lastMonthAssessments =
        lastMonthAssessments == 0 ? 1 : lastMonthAssessments;
      this.percentage =
        (100 / lastMonthAssessments) *
        (this.currentMonthAssessments - lastMonthAssessments);

      if (flag) {
        this.percentage += 100 / lastMonthAssessments;
      }
      this.percentage = Math.floor(this.percentage);

      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      var xAxisLabel: string[] = [];
      months.forEach((element) => {
        xAxisLabel.push(months[(month - 1) % 12]);
        month++;
      });

      // Graph
      this.chartOptions = {
        chart: {
          height: 300,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['transparent'],
        },
        series: [
          {
            name: 'Total',
            data: total,
          },
          {
            name: 'Attempted',
            data: attempt,
          },
          {
            name: 'Not Attempted',
            data: notAttempt,
          },

          // dummy
          // {
          //   name: "Total",
          //   data: ['12', '15', '6', '10', '8', '7', '9', '10', '15', '3', '7', '14']
          // },
          // {
          //   name: "Attempted",
          //   data: ['8', '0', '3', '8', '3', '6', '4', '11', '1', '3', '7', '1']
          // },
          // {
          //   name: "Not Attempted",
          //   data: ['4', '15', '3', '2', '5', '1', '5', '4', '6', '0', '0', '12']
          // }
        ],
        xaxis: {
          categories: xAxisLabel,

          // dummy
          // categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        },
        yaxis: {
          title: {
            text: 'Assignments',
          },
        },
        fill: {
          opacity: 1,
          colors: ['#41bbd6', '#13e29d', '#fb9db2'],
        },
        grid: {
          borderColor: 'rgba(94, 96, 110, .5)',
          strokeDashArray: 4,
        },
        markers: {
          colors: ['#2a89c9', '#fb9db2', '#00e396'],
        },
        legend: {
          show: false,
        },
      };

      this.loading = false;
    });
  }
}
