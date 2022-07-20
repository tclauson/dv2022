import { Directive } from '@angular/core';
import { FlexDirective } from '@angular/flex-layout';

const selector = `
[fxFlex.lt-xs.custom],
[fxFlex.gt-xs.custom],
[fxFlex.xs.custom],
[fxFlex.lt-sm.custom],
[fxFlex.gt-sm.custom],
[fxFlex.sm.custom],
[fxFlex.lt-md.custom],
[fxFlex.gt-md.custom]
[fxFlex.md.custom],
[fxFlex.lt-lg.custom],
[fxFlex.gt-lg.custom]
[fxFlex.lg.custom]
`;

const inputs = [
  'fxFlex.lt-xs.custom',
  'fxFlex.gt-xs.custom',
  'fxFlex.xs.custom',
  'fxFlex.lt-sm.custom',
  'fxFlex.gt-sm.custom',
  'fxFlex.sm.custom',
  'fxFlex.lt-md.custom',
  'fxFlex.gt-md.custom',
  'fxFlex.md.custom',
  'fxFlex.lt-lg.custom',
  'fxFlex.gt-lg.custom',
  'fxFlex.lg.custom',
];


@Directive({ selector, inputs })
export class CustomFlexDirective extends FlexDirective {
  protected inputs = inputs
}
