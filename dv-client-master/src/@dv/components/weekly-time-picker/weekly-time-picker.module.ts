import { NgModule } from '@angular/core';
import { DvSharedModule } from '../../shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { WeeklyTimePickerComponent } from './weekly-time-picker.component';

@NgModule({
  imports: [
    DvSharedModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [
    TimePickerComponent,
    WeeklyTimePickerComponent
  ],
  exports: [
    TimePickerComponent,
    WeeklyTimePickerComponent
  ]
})

export class WeeklyTimePickerModule { }
