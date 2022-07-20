import { Directive } from '@angular/core';
import { LayoutAlignDirective } from '@angular/flex-layout';

const selector = `
[fxLayoutAlign.lt-xs.custom],
[fxLayoutAlign.gt-xs.custom],
[fxLayoutAlign.xs.custom],
[fxLayoutAlign.lt-sm.custom],
[fxLayoutAlign.gt-sm.custom],
[fxLayoutAlign.sm.custom],
[fxLayoutAlign.lt-md.custom],
[fxLayoutAlign.gt-md.custom],
[fxLayoutAlign.md.custom],
[fxLayoutAlign.lt-lg.custom],
[fxLayoutAlign.gt-lg.custom]
[fxLayoutAlign.lg.custom]
`;

const inputs = [
  'fxLayoutAlign.lt-xs.custom',
  'fxLayoutAlign.gt-xs.custom',
  'fxLayoutAlign.xs.custom',
  'fxLayoutAlign.lt-sm.custom',
  'fxLayoutAlign.gt-sm.custom',
  'fxLayoutAlign.sm.custom',
  'fxLayoutAlign.lt-md.custom',
  'fxLayoutAlign.gt-md.custom',
  'fxLayoutAlign.md.custom',
  'fxLayoutAlign.lt-lg.custom',
  'fxLayoutAlign.gt-lg.custom',
  'fxLayoutAlign.lg.custom'
];


@Directive({ selector, inputs })
export class CustomLayoutAlignDirective extends LayoutAlignDirective {
  protected inputs = inputs
}
