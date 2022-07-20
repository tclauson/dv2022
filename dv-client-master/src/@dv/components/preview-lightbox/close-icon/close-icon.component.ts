import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PreviewLightboxRef } from '../preview-lightbox.ref';

@Component({
  selector: 'close-icon',
  templateUrl: './close-icon.component.html',
  styleUrls: ['./close-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideDown', [
      state('void', style({ transform: 'translateY(-100%)' })),
      state('enter', style({ transform: 'translateY(0)' })),
      state('leave', style({ transform: 'translateY(-100%)' })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
  ]
})
export class CloseIconComponent implements OnInit {
  @HostBinding('@slideDown') slideDown = 'enter';

  /**
   * Constructor
   *
   * @param {PreviewLightboxRef} previewLightboxRef
   */
  constructor(
    public previewLightboxRef: PreviewLightboxRef
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.previewLightboxRef.beforeClose().subscribe(() => this.slideDown = 'leave');
  }
}