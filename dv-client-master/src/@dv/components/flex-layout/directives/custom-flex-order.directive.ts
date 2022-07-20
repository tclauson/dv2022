import { Directive } from '@angular/core';
import { FlexOrderDirective } from '@angular/flex-layout';

const selector = `
[fxFlexOrder.lt-xs.custom],
[fxFlexOrder.gt-xs.custom],
[fxFlexOrder.xs.custom],
[fxFlexOrder.lt-sm.custom],
[fxFlexOrder.gt-sm.custom],
[fxFlexOrder.sm.custom],
[fxFlexOrder.lt-md.custom],
[fxFlexOrder.gt-md.custom],
[fxFlexOrder.md.custom],
[fxFlexOrder.lt-lg.custom],
[fxFlexOrder.gt-lg.custom],
[fxFlexOrder.lg.custom]
`;

const inputs = [
  'fxFlexOrder.lt-xs.custom',
  'fxFlexOrder.gt-xs.custom',
  'fxFlexOrder.xs.custom',
  'fxFlexOrder.lt-sm.custom',
  'fxFlexOrder.gt-sm.custom',
  'fxFlexOrder.sm.custom',
  'fxFlexOrder.lt-md.custom',
  'fxFlexOrder.gt-md.custom',
  'fxFlexOrder.md.custom',
  'fxFlexOrder.lt-lg.custom',
  'fxFlexOrder.gt-lg.custom',
  'fxFlexOrder.lg.custom',
];


@Directive({ selector, inputs })
export class CustomFlexOrderDirective extends FlexOrderDirective {
  protected inputs = inputs
}
