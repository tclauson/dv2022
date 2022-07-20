import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DvProgressSpinnerComponent } from './progress-spinner.component';

@NgModule({
  declarations: [
    DvProgressSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatProgressSpinnerModule
  ],
  exports: [
    DvProgressSpinnerComponent
  ]
})
export class DvProgressSpinnerModule {
}
