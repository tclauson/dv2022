import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DvProgressSpinnerService {
  // Private
  private _mode: BehaviorSubject<string>;
  private _value: BehaviorSubject<number>;
  private _visible: BehaviorSubject<boolean>;
  private _message: BehaviorSubject<string>;

  /**
   * Constructor
   */
  constructor() {
    // Set the private defaults
    this._mode = new BehaviorSubject('indeterminate');
    this._value = new BehaviorSubject(0);
    this._visible = new BehaviorSubject(false);
    this._message = new BehaviorSubject('');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Mode
   */
  get mode(): Observable<any> {
    return this._mode.asObservable();
  }
  setMode(value: 'determinate' | 'indeterminate' | 'buffer' | 'query'): void {
    this._mode.next(value);
  }

  /**
   * Value
   */
  get value(): Observable<any> {
    return this._value.asObservable();
  }
  setValue(value: number): void {
    this._value.next(value);
  }

  /**
   * Visible
   */
  get visible(): Observable<any> {
    return this._visible.asObservable();
  }

  /**
   * Message
   */
  get message(): Observable<any> {
    return this._message.asObservable();
  }
  setMessage(value: string): void  {
    this._message.next(value);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the progress bar
   */
  show(message?: string): void {
    this._visible.next(true);
    if (message) {
      this._message.next(message);
    }
  }

  /**
   * Hide the progress bar
   */
  hide(): void {
    this._visible.next(false);
    this._message.next('');
  }

}

