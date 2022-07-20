import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'expired' })
export class ExpiryPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {Date | string} date
   * @returns {boolean}
   */
  transform(date: Date | string): boolean {
    const d = moment(date);
    if (!d.isValid()) {
      throw new Error('Invalid date');
    }
    else {
      return d.isBefore(moment())
    }
  }

}