import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit, Optional, Self,
  ViewEncapsulation
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import * as CkEditor from 'ckeditor5-minimal-inline-build'

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TextEditorComponent
    }
  ]
})

export class TextEditorComponent implements ControlValueAccessor, DoCheck, MatFormFieldControl<any>, OnInit, AfterViewInit, OnDestroy {
  static nextId = 0;

  // Number of rows to pixels
  @Input() get rows(): string {
    return this._rows;
  }
  set rows(value: string) {
    this._rows = (+value * 20).toString();
  }

  @Input() get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input() get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input() get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input() get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.onChange(value);
    this.stateChanges.next();
  }

  controlType: string;
  focused: boolean;
  errorState: boolean;
  touched: boolean;
  stateChanges: Subject<void>;
  editor: any;

  // Private
  private _placeholder: string;
  private _disabled = false;
  private _required = false;
  private _value: string;
  private _rows: string;


  @HostBinding('class.text-editor-float')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.id')
  id: string;

  @HostBinding('attr.aria-describedby')
  describedBy: string;

  // Manual Focus Fix
  @HostListener('focusout') onFocusOut(): void {
    this.onTouched();
  }

  /**
   * Constructor
   *
   * @param {FocusMonitor}_focusMonitor
   * @param {ElementRef}_elementRef
   * @param {Injector}injector
   * @param {ngControl} ngControl
   */
  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    @Optional() @Self() public ngControl: NgControl
  ) {
    // Set the defaults
    this.id = `text-editor-formfield-${TextEditorComponent.nextId++}`;
    this.controlType = 'text-editor';
    this.describedBy = '';
    this.focused = false;
    this.errorState = false;
    this.stateChanges = new Subject<void>();
    this.editor = CkEditor;

    // Set the private defaults
    this._disabled = false;
    this._required = false;
    this._rows = '100';

    this._focusMonitor
      .monitor(_elementRef, true)
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

  }

  /**
   * On Do Check
   */
  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  /**
   * After View Init
   */
  ngAfterViewInit(): void {
    this._elementRef.nativeElement.parentElement.classList.add('text-editor-form-field');
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get empty(): boolean {
    return !!this._value;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Change
   *
   * @param _
   */
  onChange = (_: any) => {
  };

  /**
   * On Touched
   */
  onTouched = () => {
    this.touched = true;
  };

  /**
   * Register On Change
   *
   * @param fn
   */
  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Register On Touched
   *
   * @param fn
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Write Value
   *
   * @param value
   */
  writeValue(value: any): void {
    this._value = value;
  }

  /**
   * Set Described By Ids
   *
   * @param {string[]} ids
   */
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  /**
   * Set Described By Ids
   *
   * @param {boolean} isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * On Container Click
   *
   * @param {MouseEvent} event
   */
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'div') {
      this._elementRef.nativeElement.querySelector('div').focus();
    }
  }
}
