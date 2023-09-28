import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { HeaderComponent } from './../shared/header/header.component';
import { SidebarComponent } from './../shared/sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'assessments',
        loadChildren: () =>
          import('./assesments/assessment.module').then(
            (m) => m.AssessmentModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'report-a-problem',
        loadChildren: () =>
          import('./report-problem/report-problem.module').then(
            (m) => m.ReportProblemModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [MainComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class MainRoutingModule {}
