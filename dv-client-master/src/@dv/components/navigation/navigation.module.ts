import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { DvNavigationComponent } from './navigation.component';
import { DvNavVerticalItemComponent } from './vertical/item/item.component';
import { DvNavVerticalCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { DvNavVerticalGroupComponent } from './vertical/group/group.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatRippleModule,

    TranslateModule.forChild()
  ],
  exports: [
    DvNavigationComponent
  ],
  declarations: [
    DvNavigationComponent,
    DvNavVerticalGroupComponent,
    DvNavVerticalItemComponent,
    DvNavVerticalCollapsableComponent,
  ]
})
export class DvNavigationModule {
}
