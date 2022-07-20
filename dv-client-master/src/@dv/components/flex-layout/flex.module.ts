import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BREAKPOINT, FlexLayoutModule } from '@angular/flex-layout';

import { CustomFlexDirective } from './directives/custom-flex.directive';
import { CustomLayoutDirective } from './directives/custom-layout.directive';
import { CustomFlexOrderDirective } from './directives/custom-flex-order.directive';
import { CustomClassDirective } from './directives/custom-class.directive';
import { CustomFlexOffsetDirective } from './directives/custom-flex-offset.directive';
import { CustomLayoutAlignDirective } from './directives/custom-layout-align.directive';

const CUSTOM_BREAKPOINTS = [
  {
    alias: 'lt-xs.custom',
    suffix: 'XsCustom',
    mediaQuery: 'screen and (max-width: 576px)',
    overlapping: false
  },
  {
    alias: 'gt-xs.custom',
    suffix: 'XsCustom',
    mediaQuery: 'screen and (min-width: 577px)',
    overlapping: false
  },
  {
    alias: 'xs.custom',
    suffix: 'XsCustom',
    mediaQuery: 'screen and (min-width: 577px) and (max-width: 767px)',
    overlapping: false
  },
  {
    alias: 'lt-sm.custom',
    suffix: 'SmCustom',
    mediaQuery: 'screen and (max-width: 767px)',
    overlapping: false
  },
  {
    alias: 'gt-sm.custom',
    suffix: 'SmCustom',
    mediaQuery: 'screen and (min-width: 768px)',
    overlapping: false
  },
  {
    alias: 'sm.custom',
    suffix: 'SmCustom',
    mediaQuery: 'screen and (min-width: 768px) and (max-width: 991px)',
    overlapping: false
  },
  {
    alias: 'lt-md.custom',
    suffix: 'MdCustom',
    mediaQuery: 'screen and (max-width: 991px)',
    overlapping: false

  },
  {
    alias: 'gt-md.custom',
    suffix: 'MdCustom',
    mediaQuery: 'screen and (min-width: 992px)',
    overlapping: false

  },
  {
    alias: 'md.custom',
    suffix: 'MdCustom',
    mediaQuery: 'screen and (min-width: 991px) and (max-width: 1139px)',
    overlapping: false
  },
  {
    alias: 'lt-lg.custom',
    suffix: 'LgCustom',
    mediaQuery: 'screen and (max-width: 1139px)',
    overlapping: false

  },
  {
    alias: 'gt-lg.custom',
    suffix: 'LgCustom',
    mediaQuery: 'screen and (min-width: 1140px)',
    overlapping: false

  },
  {
    alias: 'lg.custom',
    suffix: 'LgCustom',
    mediaQuery: 'screen and (min-width: 1139px)',
    overlapping: false
  },
];


@NgModule({

  imports: [
    CommonModule,

    FlexLayoutModule.withConfig({ }, CUSTOM_BREAKPOINTS),
  ],

  declarations: [
    CustomFlexDirective,
    CustomLayoutDirective,
    CustomFlexOrderDirective,
    CustomClassDirective,
    CustomFlexOffsetDirective,
    CustomLayoutAlignDirective
  ],

  exports : [
    CustomFlexDirective,
    CustomLayoutDirective,
    CustomFlexOrderDirective,
    CustomClassDirective,
    CustomFlexOffsetDirective,
    CustomLayoutAlignDirective,

    FlexLayoutModule
  ],

  providers: [
    {provide: BREAKPOINT, useValue: CUSTOM_BREAKPOINTS, multi: true}
  ]

})

export class FlexModule {}
