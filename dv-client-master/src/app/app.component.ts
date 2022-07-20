import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DvConfigService } from '@dv/services/config.service';
import { DvNavigationService } from '@dv/components/navigation/navigation.service';
import { DvSidebarService } from '@dv/components/sidebar/sidebar.service';
import { DvSplashScreenService } from '@dv/services/splash-screen.service';
import { DvTranslationLoaderService } from '@dv/services/translation-loader.service';
import { ProfileService } from 'app/main/pages/profile/profile.service';

import { navigation } from 'app/navigation/navigation';
import { navigationAdmin } from 'app/navigation/navigation-admin';
import { navigationShop } from 'app/navigation/navigation-shop';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  dvConfig: any;
  navigation: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DOCUMENT} _document
   * @param {DvConfigService} _dvConfigService
   * @param {DvNavigationService} _dvNavigationService
   * @param {DvSidebarService} _dvSidebarService
   * @param {DvSplashScreenService} _dvSplashScreenService
   * @param {DvTranslationLoaderService} _dvTranslationLoaderService
   * @param {Platform} _platform
   * @param {TranslateService} _translateService
   * @param {ProfileService} _profileService
   */
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _dvConfigService: DvConfigService,
    private _dvNavigationService: DvNavigationService,
    private _dvSidebarService: DvSidebarService,
    private _dvSplashScreenService: DvSplashScreenService,
    private _dvTranslationLoaderService: DvTranslationLoaderService,
    private _translateService: TranslateService,
    private _platform: Platform,
    private _profileService: ProfileService
  ) {
    // Get default navigation
    this.navigation = navigation;

    // Register the navigation to the service
    this._dvNavigationService.register('main', this.navigation);

    // Set the main navigation as our current navigation
    this._dvNavigationService.setCurrentNavigation('main');

    // Add languages
    this._translateService.addLangs(['en']);

    // Set the default language
    this._translateService.setDefaultLang('en');

    // Set the navigation translations
    this._dvTranslationLoaderService.loadTranslations(navigationEnglish);

    // Use a language
    this._translateService.use('en');

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix Start
     * ----------------------------------------------------------------------------------------------------
     */

    /**
     * If you are using a language other than the default one, i.e. Turkish in this case,
     * you may encounter an issue where some of the components are not actually being
     * translated when your app first initialized.
     *
     * This is related to ngxTranslate module and below there is a temporary fix while we
     * are moving the multi language implementation over to the Angular's core language
     * service.
     */

    // Set the default language to 'en' and then back to 'tr'.
    // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
    // been selected and there is no way to force it, so we overcome the issue by switching
    // the default language back and forth.
    /**
     * setTimeout(() => {
     *       this._translateService.setDefaultLang('en');
     *       this._translateService.setDefaultLang('tr');
     *    });
     */

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix End
     * ----------------------------------------------------------------------------------------------------
     */

    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this._document.body.classList.add('is-mobile');
    }

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
    // Subscribe to config changes
    this._dvConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {

        this.dvConfig = config;

        // Color theme - Use normal for loop for IE11 compatibility
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._document.body.classList.length; i++) {
          const className = this._document.body.classList[i];

          if (className.startsWith('theme-')) {
            this._document.body.classList.remove(className);
          }
        }

        this._document.body.classList.add(this.dvConfig.colorTheme);
      });

    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        switch (user?.role?.name) {
          case 'Admin':
            this.navigation = navigationAdmin;
            break;

          case 'Shop':
            this.navigation = navigationShop;
            break;

          default:
            this.navigation = navigation;
            break;
        }
        this._dvNavigationService.unregister('main');
        this._dvNavigationService.register('main', this.navigation);
        this._dvNavigationService.setCurrentNavigation('main');
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

}
