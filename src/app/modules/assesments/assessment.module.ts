import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ListingComponent } from './listing/listing.component';
import { BuilderComponent } from './builder/builder.component';
import { AttemptComponent } from './attempt/attempt.component';
import { ResultComponent } from './result/result.component';


const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'create', component: BuilderComponent },
  { path: 'attempt/:quizId', component: AttemptComponent },
  { path: 'attempt/:quizId/wrong/questions', component: AttemptComponent },
  { path: ':quizId/result', component: ResultComponent },
  {
    path: 'submissions',
    loadChildren: () => 
    import('./submissions/submissions.module').then(m=> m.SubmissionsModule)
  },
];

@NgModule({
  declarations: [ListingComponent, BuilderComponent, AttemptComponent, ResultComponent],
  imports: [
    CommonModule,
    FormsModule, 
    NgxPaginationModule,
    RouterModule.forChild(routes),
  ]
})
export class AssessmentModule { }
