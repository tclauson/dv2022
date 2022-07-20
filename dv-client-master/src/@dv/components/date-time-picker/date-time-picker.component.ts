import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';

type PickerType = 'date-time' | 'date' | 'time';
const CUSTOM_DATE_FORMAT = {
  display: {
    dateInput: 'LL HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatFormFieldControl, useExisting: DateTimePickerComponent },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT, deps: [DateTimePickerComponent] },
  ]
})

export class DateTimePickerComponent implements ControlValueAccessor, DoCheck, MatFormFieldControl<any>, OnInit, AfterViewInit, OnDestroy {
  static nextId = 0;

  @Input() get pickerType(): PickerType {
    return this._pickerType;
  }
  set pickerType(value: PickerType) {
    this._pickerType = value;
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

  @Input() get value(): Moment | Date | string  {
    return this._value;
  }
  set value(value: Moment | Date | string) {
    this._value = moment(value).toISOString();
    this.onChange(value);
    this.stateChanges.next();
  }

  @ViewChild('timePicker', { static: false })
  timePickerEl: NgxMaterialTimepickerComponent;

  @ViewChild('datePicker', { static: false })
  datePickerEl: MatDatepicker<any>;

  controlType: string;
  focused: boolean;
  errorState: boolean;
  touched: boolean;
  stateChanges: Subject<void>;

  // Private
  private _placeholder: string;
  private _disabled = false;
  private _required = false;
  private _value: Date | string;
  private _pickerType: PickerType;
  private _timePickerSubscription: Subscription;


  @HostBinding('class.date-time-picker-float')
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
   * @param {Document} _document
   * @param {NgControl} ngControl
   */
  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    @Inject(DOCUMENT) private _document: Document,
    @Optional() @Self() public ngControl: NgControl
  ) {
    // Set the defaults
    this.id = `date-time-picker-formfield-${DateTimePickerComponent.nextId++}`;
    this.controlType = 'date-time-picker';
    this.describedBy = '';
    this.focused = false;
    this.errorState = false;
    this.stateChanges = new Subject<void>();

    // Set the private defaults
    this._disabled = false;
    this._required = false;
    this._pickerType = 'date-time';
    this._timePickerSubscription = new Subscription();

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
    if (this.pickerType === 'date') {
      CUSTOM_DATE_FORMAT.display.dateInput = 'LL'
    }
    else {
      CUSTOM_DATE_FORMAT.display.dateInput = 'LL HH:mm'
    }
  }

  /**
   * After View Init
   */
  ngAfterViewInit(): void {
    if (this.pickerType === 'date-time') {
      this._timePickerSubscription = this.timePickerEl.timeSet.subscribe(res => {
        const time = res.split(':');
        this.value = moment(this.value).set({ h: time[0], m: time[1] });
      });
    }
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
    this._timePickerSubscription.unsubscribe();
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
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  /**
   * On Picker
   *
   * @param {date | time} picker
   */
  openPicker(picker: 'date' | 'time'): void {
    if (picker === 'date') {
      const docTimePickerEl = this._document.body.getElementsByTagName('ngx-material-timepicker-container');
      if (this.timePickerEl && docTimePickerEl.length > 0) {
        this.timePickerEl.close();
      }
      this.datePickerEl.open();
    }
    if (picker === 'time') {
      if (this.datePickerEl) {
        this.datePickerEl.close();
      }
      this.timePickerEl.open();
    }
  }

}