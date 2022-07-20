import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, skip } from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { ApiBody } from '../types';


@Injectable({ providedIn: 'root' })
export class ApiFactoryService {
  // Private
  private _apiUrl: string;
  private _apiNoPrefixUrl: string;
  private _headers: HttpHeaders;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   * @param {ErrorHandlerService} _errorHandlerService
   */
  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this._apiUrl = environment.apiUrl;
    this._apiNoPrefixUrl = environment.websiteUrl;
    this._headers = new HttpHeaders({ });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Error Handler Service
   *
   * @param {HttpErrorResponse} httpErrorResponse
   * @returns {Observable<never>}
   * @private
   */
  private _errorHandler(httpErrorResponse: HttpErrorResponse): Observable<never> {
    this._errorHandlerService.showError(httpErrorResponse.error || httpErrorResponse.message)
    return throwError(httpErrorResponse);
  }

  /**
   * Convert Params to Stringified Form
   *
   * @param {object | string} params
   * @returns {string}
   * @private
   */
  private _chainParams(params: object | string): string {
    let chain = '';
    if (params && typeof params === 'object')
      for (const key in params) {
        if (!params.hasOwnProperty(key)) {
          continue;
        }
        if (chain !== '') {
          chain += '&';
        }
        if (typeof params[key] === 'object') {
          chain += `${key}=${encodeURIComponent(JSON.stringify(params[key]))}`;
        } else {
          chain += `${key}=${encodeURIComponent(params[key])}`;
        }
      }
    else {
      chain = params as string;
    }

    return chain;
  }


  /**
   * Get From Server
   *
   * @param {string} path
   * @returns {Observable<any>}
   * @private
   */
  private _get(path: string): Observable<any> {
    return this._httpClient
      .get<any>(path, { headers: this._headers })
      .pipe(
        map(res => res.data),
        catchError(e => this._errorHandler(e))
      );
  }

  /**
   * Post On Server
   *
   * @param {string} path
   * @param {object} body
   * @returns {Observable<any>}
   * @private
   */
  private _post(path: string, body: object): Observable<any> {
    return this._httpClient
      .post<any>(path, body, { headers: this._headers })
      .pipe(
        map(res => res.data),
        catchError(e => this._errorHandler(e))
      );
  }

  /**
   * Update on Server
   *
   * @param {string} path
   * @param {object} body
   * @returns {Observable<any>}
   * @private
   */
  private _put(path, body): Observable<any> {
    return this._httpClient
      .put<any>(path, body, { headers: this._headers })
      .pipe(
        map(res => res.data),
        catchError(e => this._errorHandler(e))
      );
  }

  /**
   * Post Or Put to Server Form
   *
   * @param {string} path
   * @param {object} body
   * @param {string} formMethod
   * @param {boolean} [reportProgress]
   * @returns {Observable<any>}
   * @private
   */
  private _form(path, body, formMethod: string, reportProgress?: boolean): Observable<any> {
    const req = new HttpRequest(
      formMethod.toUpperCase(),
      path,
      body,
      { reportProgress: !!reportProgress }
    )
    const resHttpReq = this._httpClient.request(req)
    const pipeArray = [];

    if (!reportProgress) {
      pipeArray.push(
        skip(1)
      );
    }

    pipeArray.push(
      map((res: HttpEvent<any> | HttpResponse<any>) => {
        if (res.type === HttpEventType.UploadProgress) {
          return +Math.round((100 * res.loaded) / res.total);
        }
        return (res as any)?.body?.data || (res as any)?.data || res;
      }),
      catchError(e => this._errorHandler(e))
    );

    // @ts-ignore
    return resHttpReq.pipe(...pipeArray)
  }

  /**
   * Delete from Server
   *
   * @param {string} path
   * @param {object} body
   * @returns {Observable<any>}
   * @private
   */
  private _delete(path: string, body: object): Observable<any> {
    return this._httpClient
      .delete<any>(path, body)
      .pipe(
        catchError(e => this._errorHandler(e))
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Execute API
   *
   * @param {ApiBody} obj
   * @returns {Observable<any>}
   */
  exec(obj: ApiBody): Observable<any> {
    this._headers = new HttpHeaders(obj.headers || { });
    if (obj.params) {
      obj.params = this._chainParams(obj.params)
    }
    if (
      !obj.id
        && (
        obj.type === 'single'
      || obj.type === 'update'
      || obj.type === 'delete'
      || obj.formMethod === 'put'
      || obj.formMethod === 'delete'
      )
    ) {
      this._errorHandlerService.showError('id is required for the requested method and is missing');
      return;
    }
    let path = obj.noApi ? this._apiNoPrefixUrl : this._apiUrl;
    path += obj.model.toLowerCase();
    if (obj.type === 'create') {
      path += '/create';
    }
    if (obj.id) {
      path += `/${obj.id}`;
    }
    if (obj.params && !_.isEmpty(obj.params)) {
      path += `?${obj.params}`;
    }

    switch (obj.type) {
      case 'get':
      case 'single':
        return this._get(path);
      case 'create':
      case 'post':
        return this._post(path, obj.body);
      case 'update':
        return this._put(path, obj.body);
      case 'form':
        return this._form(path, obj.body, obj.formMethod || 'POST');
      case 'delete':
        return this._delete(path, obj.body);
    }
  }

}
