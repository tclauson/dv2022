import { Directive } from '@angular/core';
import { FlexOffsetDirective } from '@angular/flex-layout';

const selector = `
[fxFlexOffset.lt-xs.custom],
[fxFlexOffset.gt-xs.custom],
[fxFlexOffset.xs.custom],
[fxFlexOffset.lt-sm.custom],
[fxFlexOffset.gt-sm.custom],
[fxFlexOffset.sm.custom],
[fxFlexOffset.lt-md.custom],
[fxFlexOffset.gt-md.custom],
[fxFlexOffset.md.custom],
[fxFlexOffset.lt-lg.custom],
[fxFlexOffset.gt-lg.custom],
[fxFlexOffset.lg.custom]
`;

const inputs = [
  'fxFlexOffset.lt-xs.custom',
  'fxFlexOffset.gt-xs.custom',
  'fxFlexOffset.xs.custom',
  'fxFlexOffset.lt-sm.custom',
  'fxFlexOffset.gt-sm.custom',
  'fxFlexOffset.sm.custom',
  'fxFlexOffset.lt-md.custom',
  'fxFlexOffset.gt-md.custom',
  'fxFlexOffset.md.custom',
  'fxFlexOffset.lt-lg.custom',
  'fxFlexOffset.gt-lg.custom',
  'fxFlexOffset.lg.custom'
];


@Directive({ selector, inputs })
export class CustomFlexOffsetDirective extends FlexOffsetDirective {
  protected inputs = inputs
}
