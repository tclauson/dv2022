import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import {
  DateTimePickerModule,
  AssetUploaderModule,
  MapFieldModule,
  WeeklyTimePickerModule,
  ConfirmDialogModule
} from '@dv/components';

import { UsersService } from './users.service';
import { UserService } from './user/user.service';

import { UsersComponent } from './users.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: ':id',
    component: UserComponent,
    resolve: {
      data: UserService
    }
  },
  {
    path: '**',
    component: UsersComponent,
    resolve: {
      data: UsersService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    MapFieldModule,
    AssetUploaderModule,
    DateTimePickerModule,
    WeeklyTimePickerModule,
    ConfirmDialogModule
  ],
  declarations: [
    UserComponent,
    UsersComponent
  ],
  providers: [
    UsersService,
    UserService
  ]
})
export class UsersModule {
}
