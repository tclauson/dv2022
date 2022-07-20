import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './modules/material-components/material.module';
import { FontAwesomeCustomModule } from './modules/font-awesome/font-awesome.module';
import { FlexLayoutCustomModule } from './modules/flex-layout/flex.module';

import { DvDirectivesModule } from '@dv/directives/directives';
import { DvPipesModule } from '@dv/pipes/pipes.module';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbilityModule,

    FlexLayoutCustomModule,
    MaterialModule,
    FontAwesomeCustomModule,

    DvDirectivesModule,
    DvPipesModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbilityModule,

    FlexLayoutCustomModule,
    MaterialModule,
    FontAwesomeCustomModule,

    DvDirectivesModule,
    DvPipesModule,
  ]
})

export class DvSharedModule {
  // static forRoot(): ModuleWithProviders<DvSharedModule> {
  //   return {
  //     ngModule: DvSharedModule,
  //     providers: [
  //       { provide: Ability, useValue: new Ability() },
  //       { provide: PureAbility, useExisting: Ability },
  //     ]
  //   };
  // }
}
