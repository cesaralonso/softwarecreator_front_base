
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Configuration } from './../../../app.constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';




@Injectable()
export class UploadModalService {

    private actionUrl: string;
    private headers: Headers;


    constructor(
        private _http: Http, 
        private _configuration: Configuration ) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json; charset=UTF-8');
    }
    
    setFile = (archivo: any): Observable<any> =>  {
        this.actionUrl = `${this._configuration.imageServerWithApiUrl}images/`;
        const toAdd = JSON.stringify(archivo);

        return this._http.post(this.actionUrl, toAdd, { headers: this.headers }).pipe(
            map((response: Response) => <any>response.json()),
            catchError(this.handleError),);
    }

    private handleError(error: Response) {
        console.error(error);
        return observableThrowError(error.json().error || 'Server error');
    }

}


