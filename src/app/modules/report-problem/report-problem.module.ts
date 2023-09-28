import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportProblemComponent } from './report-problem/report-problem.component';
import { FormsModule } from '@angular/forms';


const routes: Routes = [{ path: '', component: ReportProblemComponent }]


@NgModule({
  declarations: [ReportProblemComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportProblemModule { }
