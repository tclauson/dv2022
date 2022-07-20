import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { DvConfigService } from '@dv/services/config.service';
import { AuthService } from '@dv/services/auth.service';
import { DvSidebarService } from '@dv/components/sidebar/sidebar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ProfileService } from 'app/main/pages/profile/profile.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
  hiddenNavbar: boolean;
  languages: any;
  selectedLanguage: any;
  name: string;
  avatarUrl: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   * @param {DvSidebarService} _dvSidebarService
   * @param {TranslateService} _translateService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AuthService} _accountService
   * @param {ProfileService} _profileService
   */
  constructor(
    private _dvConfigService: DvConfigService,
    private _dvSidebarService: DvSidebarService,
    private _translateService: TranslateService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _accountService: AuthService,
    private _profileService: ProfileService
  ) {
    // Set the defaults
    this.languages = [
      {
        id: 'en',
        title: 'English',
        flag: 'us'
      }
    ];
    this.name = ''
    this.avatarUrl = '';

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
    // Subscribe to the config changes
    this._dvConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });

    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
    this._profileService.profile.subscribe((user) => {
      this.name = user?.name || ''
      this.avatarUrl = user?.avatar?.url || '';
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._dvSidebarService.getSidebar(key).toggleOpen();
  }


  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this._translateService.use(lang.id);
  }

  /**
   * Logout
   */
  logout(): void {
    this._dvProgressSpinnerService.show('Logging Out')
    this._accountService.logout();
  }
}
