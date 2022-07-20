import { NgModule } from '@angular/core';

import { DvWidgetComponent } from './widget.component';
import { DvWidgetToggleDirective } from './widget-toggle.directive';

@NgModule({
  declarations: [
    DvWidgetComponent,
    DvWidgetToggleDirective
  ],
  exports: [
    DvWidgetComponent,
    DvWidgetToggleDirective
  ],
})
export class DvWidgetModule {
}
