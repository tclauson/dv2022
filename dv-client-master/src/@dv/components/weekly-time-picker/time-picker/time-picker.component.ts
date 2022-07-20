import {
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, NgControl, Validators } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';

type TimeFieldType = [string, string]

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatFormFieldControl, useExisting: TimePickerComponent },
  ]
})

export class TimePickerComponent implements ControlValueAccessor, MatFormFieldControl<TimeFieldType>, OnInit, DoCheck, OnDestroy {
  static nextId = 0;

  @Input() get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input() get placeholderFirst(): string {
    return this._placeholderFirst;
  }

  set placeholderFirst(value: string) {
    this._placeholderFirst = value;
    this.stateChanges.next();
  }

  @Input() get placeholderSecond(): string {
    return this._placeholderSecond;
  }

  set placeholderSecond(value: string) {
    this._placeholderSecond = value;
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

  @Input() get value(): TimeFieldType {
    if (this.timeForm.valid) {
      return this.timeForm.getRawValue() as TimeFieldType;
    }
    return null;
  }

  set value(value: TimeFieldType) {
    this.timeForm.setValue(Array.isArray(value) && value.length === 2 ? value : ['', '']);
    this.onChange(this.value);
    this.stateChanges.next();
  }

  @ViewChild('timePickerOne', { static: false })
  timePickerOneEl: NgxMaterialTimepickerComponent;

  @ViewChild('timePickerTwo', { static: false })
  timePickerTwoEl: NgxMaterialTimepickerComponent;

  controlType: string;
  focused: boolean;
  errorState: boolean;
  touched: boolean;
  stateChanges: Subject<void>;
  timeForm: FormArray;

  // Private
  private _placeholder: string;
  private _disabled = false;
  private _required = false;
  private _placeholderFirst: string;
  private _placeholderSecond: string;
  private _timeFormSubscription: Subscription;


  @HostBinding('class.time-picker-float')
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
   * @param {FormBuilder} _formBuilder
   * @param {FocusMonitor}_focusMonitor
   * @param {ElementRef}_elementRef
   * @param {NgControl} ngControl
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    // Set the defaults
    this.id = `time-picker-formfield-${TimePickerComponent.nextId++}`;
    this.controlType = 'time-picker';
    this.describedBy = '';
    this.focused = false;
    this.errorState = false;
    this.stateChanges = new Subject<void>();

    // Set the private defaults
    this._disabled = false;
    this._required = false;

    this._focusMonitor
      .monitor(_elementRef, true)
      .subscribe(origin => {
        if (this.focused && !origin) {
          this.onTouched();
        }
        this.focused = !!origin;
        this.stateChanges.next();
      });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.timeForm = _formBuilder.array(
      [[''], ['']],
      this.required ? [Validators.required] : []
    );
    this._timeFormSubscription = new Subscription();
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    this._timeFormSubscription = this.timeForm
      .valueChanges
      .subscribe(() => {
        this.onChange(this.value);
      })
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
   * On Destroy
   */
  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._timeFormSubscription.unsubscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get empty(): boolean {
    const v = this.timeForm.getRawValue();
    return !(v[0] || v[1]);
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
    this.value = value;
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
    if (isDisabled) {
      this.timeForm.disable()
    }
    else {
      this.timeForm.enable();
    }
    this.disabled = isDisabled;
  }

  /**
   * On Container Click
   *
   * @param {MouseEvent} event
   */
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  /**
   * On Picker
   */
  openPicker(): void {
    this.timePickerOneEl.open();
    this.timePickerOneEl.closed.pipe(take(1)).subscribe(() => {
      this.timePickerTwoEl.open();
    })
  }

}