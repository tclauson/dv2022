import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

import { dvAnimations } from '@dv/animations';

import { AnalyticsDashboardService } from './analytics.service';

@Component({
  selector: 'analytics-dashboard',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class AnalyticsDashboardComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow

  widgets: any;
  widget1SelectedYear = '2016';
  widget5SelectedDay = 'today';
  infoContent: string;
  mapOptions: google.maps.MapOptions;
  center: google.maps.LatLngLiteral | google.maps.LatLng;

  /**
   * Constructor
   *
   * @param {AnalyticsDashboardService} _analyticsDashboardService
   */
  constructor(
    private _analyticsDashboardService: AnalyticsDashboardService
  ) {
    // Register the custom chart.js plugin
    this._registerCustomChartJSPlugin();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the widgets from the service
    this.widgets = this._analyticsDashboardService.widgets;

    // Map Options
    this.center = this.widgets.widget6.markers
    this.mapOptions = {
      zoomControl: false,
      disableDoubleClickZoom: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      scaleControl: false,
      scrollwheel: false,
      maxZoom: 2,
      minZoom: 2,
      styles: this.widgets.widget6.styles
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register a custom plugin
   */
  private _registerCustomChartJSPlugin(): void {
    (window as any).Chart.plugins.register({
      afterDatasetsDraw: (chart, easing): any => {
        // Only activate the plugin if it's made available
        // in the options
        if (
          !chart.options.plugins.xLabelsOnTop ||
          (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
        ) {
          return;
        }

        // To only draw at the end of animation, check for easing === 1
        const ctx = chart.ctx;

        chart.data.datasets.forEach((dataset, i): any => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index): any => {

              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              const fontSize = 13;
              const fontStyle = 'normal';
              const fontFamily = 'Roboto, Helvetica Neue, Arial';
              ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

              // Just naively convert to string for now
              const dataString = dataset.data[index].toString() + 'k';

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const padding = 15;
              const startY = 24;
              const position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, startY);

              ctx.save();

              ctx.beginPath();
              ctx.setLineDash([5, 3]);
              ctx.moveTo(position.x, startY + padding);
              ctx.lineTo(position.x, position.y - padding);
              ctx.strokeStyle = 'rgba(255,255,255,0.12)';
              ctx.stroke();

              ctx.restore();
            });
          }
        });
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  /**
   * Open Info Window
   *
   * @param {MapMarker} marker
   * @param content
   */
  openInfo(marker: MapMarker, content): void {
    this.infoContent = content
    this.infoWindow.open(marker)
  }

}

