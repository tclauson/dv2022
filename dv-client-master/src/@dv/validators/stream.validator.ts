import { AbstractControl } from '@angular/forms';
import { DvUtils } from '../utils';

export class StreamValidator {
  /**
   * Stream validator
   *
   * @param {AbstractControl} control
   * @return {{invalidStream: boolean}}
   */
  static streamValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value && !DvUtils.youtubeIdExtractor(control.value) ? { invalidStream: true } : null;
  }
}
