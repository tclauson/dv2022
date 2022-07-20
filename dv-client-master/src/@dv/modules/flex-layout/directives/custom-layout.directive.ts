import { Directive } from '@angular/core';
import { LayoutDirective } from '@angular/flex-layout';

const selector = `
[fxLayout.lt-xs.custom],
[fxLayout.gt-xs.custom],
[fxLayout.xs.custom],
[fxLayout.lt-sm.custom],
[fxLayout.gt-sm.custom],
[fxLayout.sm.custom],
[fxLayout.lt-md.custom],
[fxLayout.gt-md.custom],
[fxLayout.md.custom],
[fxLayout.lt-lg.custom],
[fxLayout.gt-lg.custom]
[fxLayout.lg.custom]
`;

const inputs = [
  'fxLayout.lt-xs.custom',
  'fxLayout.gt-xs.custom',
  'fxLayout.xs.custom',
  'fxLayout.lt-sm.custom',
  'fxLayout.gt-sm.custom',
  'fxLayout.sm.custom',
  'fxLayout.lt-md.custom',
  'fxLayout.gt-md.custom',
  'fxLayout.md.custom',
  'fxLayout.lt-lg.custom',
  'fxLayout.gt-lg.custom',
  'fxLayout.lg.custom'
];


@Directive({ selector, inputs })
export class CustomLayoutDirective extends LayoutDirective {
  protected inputs = inputs
}
