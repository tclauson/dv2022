import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { dvAnimations } from '@dv/animations';

import { ProfileService } from 'app/main/pages/profile/profile.service';

@Component({
  selector: 'profile-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ProfileLiveStreamComponent implements OnInit, OnDestroy {
  streamId: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ProfileService} _profileService
   */
  constructor(
    private _profileService: ProfileService,
  ) {
    // Set the defaults
    this.streamId = ''

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.streamId = user.shop?.streamId || '';
      })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
