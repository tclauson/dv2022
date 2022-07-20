import { Subject } from 'rxjs';

export class BootControl {

  private static instance: BootControl;

  private _reboot: Subject<boolean>;

  constructor() {
    this._reboot = new Subject<boolean>();
  }

  static getbootControl() {
    if (!BootControl.instance) BootControl.instance = new BootControl();
    return BootControl.instance;
  }

  get reboot(): any { return this._reboot.asObservable(); }
  set reboot(value: any) { if (typeof value === 'boolean') this._reboot.next(value); }


}
