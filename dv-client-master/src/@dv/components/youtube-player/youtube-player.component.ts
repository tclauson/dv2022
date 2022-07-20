import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YoutubePlayerComponent implements OnInit {
  @Input() streamId: string;

  /**
   * Constructor
   */
  constructor(
    private _errorHandlerService: ErrorHandlerService
  ) {
  }

  /**
   * After Content Init
   */
  ngOnInit(): void {
    if (!this.streamId) {
      this._errorHandlerService.showError('StreamId not provided');
    }
  }
}
