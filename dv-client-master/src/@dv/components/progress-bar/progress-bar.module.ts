import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DvProgressBarComponent } from './progress-bar.component';

@NgModule({
  declarations: [
    DvProgressBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatProgressBarModule
  ],
  exports: [
    DvProgressBarComponent
  ]
})
export class DvProgressBarModule {
}
