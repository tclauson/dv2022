import { Component, EventEmitter, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { PreviewLightboxRef } from './preview-lightbox.ref';
import { PREVIEW_LIGHTBOX_DATA } from './preview-lightbox.tokens';

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'preview-lightbox',
  templateUrl: './preview-lightbox.component.html',
  styleUrls: ['./preview-lightbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => fadeIn', animate(ANIMATION_TIMINGS))
    ]),
    trigger('slideContent', [
      state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate(ANIMATION_TIMINGS)),
    ])
  ]
})
export class PreviewLightboxComponent {
  isLoading: boolean;
  animationState: 'void' | 'enter' | 'leave';
  animationStateChanged: EventEmitter<AnimationEvent>;

  /**
   * Constructor
   *
   * @param {PreviewLightboxRef} previewLightboxRef
   * @param asset
   */
  constructor(
    public previewLightboxRef: PreviewLightboxRef,
    @Inject(PREVIEW_LIGHTBOX_DATA) public asset: File | string
  ) {
    this.isLoading = true;
    this.animationState = 'enter';
    this.animationStateChanged = new EventEmitter<AnimationEvent>();
  }

  @HostListener('document:keydown', ['$event'])
  private _handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.previewLightboxRef.close();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Image Load
   *
   * @param {Event} e
   */
  onLoad(e: Event): void {
    this.isLoading = false;
  }

  /**
   * When Animation Start
   *
   * @param {AnimationEvent} e
   */
  onAnimationStart(e: AnimationEvent): void {
    this.animationStateChanged.emit(e);
  }

  /**
   * When Animation is Done
   *
   * @param {AnimationEvent} e
   */
  onAnimationDone(e: AnimationEvent): void {
    this.animationStateChanged.emit(e);
  }

  /**
   * When Animation Start is Executed
   */
  startExitAnimation(): void {
    this.animationState = 'leave';
  }

}
