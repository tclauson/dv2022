import { AbstractControl } from '@angular/forms';

export class TelValidator {
  /**
   * Tel validator
   *
   * @param control
   * @return {{invalidNumber: boolean}}
   */
  static telValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value && !/^(?:00|\+)[0-9]{6,20}$/.test(control.value) ? { invalidNumber: true } : null;
  }
}
