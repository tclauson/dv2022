import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { PreviewLightboxComponent } from './preview-lightbox.component';


export class PreviewLightboxRef {

  // Private
  private _beforeCLose: Subject<void>;
  private _afterClosed: Subject<void>;

  componentInstance: PreviewLightboxComponent;

  /**
   * Constructor
   *
   * @param {OverlayRef} _overlayRef
   */
  constructor(
    private _overlayRef: OverlayRef
  ) {
    // Set the private defaults
    this._beforeCLose = new Subject();
    this._afterClosed = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Close Overlay
   */
  close(): void {
    this.componentInstance.animationStateChanged
      .pipe(
        filter((event: any) => event.phaseName === 'start'),
        take(1)
      )
      .subscribe(() => {
        this._beforeCLose.next();
        this._beforeCLose.complete();
        this._overlayRef.detachBackdrop();
      });

    this.componentInstance.animationStateChanged
      .pipe(
        filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
        take(1)
      )
      .subscribe(() => {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();

        // tslint:disable-next-line:no-non-null-assertion
        this.componentInstance = null!;
      });

    this.componentInstance.startExitAnimation();
  }

  /**
   * Before Close Subscription
   */
  beforeClose(): Observable<void> {
    return this._beforeCLose.asObservable();
  }

  /**
   * After Close Subscription
   */
  afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }
}