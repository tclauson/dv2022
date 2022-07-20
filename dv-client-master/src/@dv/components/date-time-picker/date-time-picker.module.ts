import { NgModule } from '@angular/core';
import { DvSharedModule } from '../../shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


import { DateTimePickerComponent } from './date-time-picker.component';

@NgModule({
  imports: [
    DvSharedModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [
    DateTimePickerComponent
  ],
  exports: [
    DateTimePickerComponent
  ]
})

export class DateTimePickerModule { }
