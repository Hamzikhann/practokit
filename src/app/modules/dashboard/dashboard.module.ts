import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Graph
import { NgApexchartsModule } from 'ng-apexcharts';
// FullCalendarModule.registerPlugins([
//   dayGridPlugin,
//   interactionPlugin
// ]);

// FullCalendarModule.registerPlugins([
//   dayGridPlugin,
//   interactionPlugin
// ]);

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    NgApexchartsModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}
