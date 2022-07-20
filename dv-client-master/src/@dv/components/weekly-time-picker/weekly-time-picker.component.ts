import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { dvAnimations } from '@dv/animations';

@Component({
  selector: 'weekly-time-picker',
  templateUrl: './weekly-time-picker.component.html',
  styleUrls: ['./weekly-time-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class WeeklyTimePickerComponent implements OnInit, OnDestroy {
  @Input() get placeholderFirst(): string {
    return this._placeholderFirst;
  }
  set placeholderFirst(value: string) {
    this._placeholderFirst = value;
  }

  @Input() get placeholderSecond(): string {
    return this._placeholderSecond;
  }
  set placeholderSecond(value: string) {
    this._placeholderSecond = value;
  }

  @Input() get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value
  }

  @Input() get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  form: FormGroup;

  // Private
  private _disabled = false;
  private _required = false;
  private _placeholderFirst: string;
  private _placeholderSecond: string;

  /**
   * Constructor
   *
   * @param {ControlContainer} _controlContainer
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _controlContainer: ControlContainer,
    private _formBuilder: FormBuilder
  ) {
    // Set the private defaults
    this._disabled = false;
    this._required = false;
    this._placeholderFirst = 'Open Time';
    this._placeholderSecond = 'Close Time';
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    const defaultTime = ['00:00', '00:00']
    const controlForm = this._controlContainer.control as FormGroup;
    controlForm.setValue({
      monday: controlForm.get('monday').value?.length > 0 ? controlForm.get('monday').value : defaultTime,
      tuesday: controlForm.get('tuesday').value?.length > 0 ? controlForm.get('tuesday').value : defaultTime,
      wednesday: controlForm.get('wednesday').value?.length > 0 ? controlForm.get('wednesday').value : defaultTime,
      thursday: controlForm.get('thursday').value?.length > 0 ? controlForm.get('thursday').value : defaultTime,
      friday: controlForm.get('friday').value?.length > 0 ? controlForm.get('friday').value : defaultTime,
      saturday: controlForm.get('saturday').value?.length > 0 ? controlForm.get('saturday').value : defaultTime,
      sunday: controlForm.get('sunday').value?.length > 0 ? controlForm.get('sunday').value : defaultTime,
    })
    this.form = controlForm;
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
  }

}
