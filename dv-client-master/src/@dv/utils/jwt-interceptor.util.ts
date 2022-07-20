import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '@dv/services/auth.service';

@Injectable()
export class JwtInterceptorUtil implements HttpInterceptor {
  /**
   * Constructor
   *
   * @param {AuthService} _accountService
   */
  constructor(
    private _accountService: AuthService
  ) {
  }

  intercept(httpRequest: HttpRequest<any>, httpHandle: HttpHandler): Observable<HttpEvent<any>> {
    const headersObj: any = {
      Type: 'browser'
    };
    const jwtToken = this._accountService.readSaveJWT('get');
    if (jwtToken) {
      headersObj.Authorization = `${jwtToken}`;
    }
    httpRequest = httpRequest.clone({ setHeaders: headersObj });
    return httpHandle.handle(httpRequest);
  }
}
