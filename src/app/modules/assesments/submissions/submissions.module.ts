import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ListingComponent },
  { path: 'result/:assessmentId', component: DetailComponent }
]

@NgModule({
  declarations: [ListingComponent, DetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ]
})
export class SubmissionsModule { }
