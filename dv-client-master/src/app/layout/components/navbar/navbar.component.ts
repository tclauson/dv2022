import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { DvConfigService } from '@dv/services/config.service';
import { DvNavigationService } from '@dv/components/navigation/navigation.service';
import { DvPerfectScrollbarDirective } from '@dv/directives/dv-perfect-scrollbar/dv-perfect-scrollbar.directive';
import { DvSidebarService } from '@dv/components/sidebar/sidebar.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy {
  dvConfig: any;
  navigation: any;

  // Private
  private _dvPerfectScrollbar: DvPerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   * @param {DvNavigationService} _dvNavigationService
   * @param {DvSidebarService} _dvSidebarService
   * @param {Router} _router
   */
  constructor(
    private _dvConfigService: DvConfigService,
    private _dvNavigationService: DvNavigationService,
    private _dvSidebarService: DvSidebarService,
    private _router: Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(DvPerfectScrollbarDirective, { static: true })
  set directive(theDirective: DvPerfectScrollbarDirective) {
    if (!theDirective) {
      return;
    }

    this._dvPerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this._dvNavigationService.onItemCollapseToggled
      .pipe(
        delay(500),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._dvPerfectScrollbar.update();
      });

    // Scroll to the active item position
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
          setTimeout(() => {
            this._dvPerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
          });
        }
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
          if (this._dvSidebarService.getSidebar('navbar')) {
            this._dvSidebarService.getSidebar('navbar').close();
          }
        }
      );

    // Get current navigation
    this._dvNavigationService.onNavigationChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.navigation = this._dvNavigationService.getCurrentNavigation();
      });

    // Subscribe to the config changes
    this._dvConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.dvConfig = config;
      });
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
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._dvSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._dvSidebarService.getSidebar('navbar').toggleFold();
  }
}
