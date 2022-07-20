import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  /**
   * Constructor
   *
   * @param {DomSanitizer} _domSanitizer
   */
  constructor(
    private _domSanitizer: DomSanitizer
  ) {
  }

  transform(url: string): SafeResourceUrl {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}