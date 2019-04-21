
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Configuration } from './../../../app.constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';




@Injectable()
export class FilesUploadModalService {

    private actionUrl: string;
    private headers: Headers;


    constructor(
        private _http: Http, 
        private _configuration: Configuration ) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json; charset=UTF-8');
    }
    
    getFiles = (idreferencia: number, proceso: string): Observable<any> =>  {
        this.actionUrl = `${this._configuration.imageServerWithApiUrl}images/${idreferencia}/${proceso}`;

        return this._http.get(this.actionUrl, { headers: this.headers }).pipe(
            map((response: Response) => <any>response.json()),
            catchError(this.handleError),);
    }

    deleteArchivo = (id: string): Observable<any> => {
        this.actionUrl = `${this._configuration.imageServerWithApiUrl}images/${id}`;
       
        return this._http.delete(this.actionUrl, { headers: this.headers }).pipe(
            map((response: Response) => <any[]>response.json()),
            catchError(this.handleError),);
    }

    private handleError(error: Response) {
        console.error(error);
        return observableThrowError(error.json().error || 'Server error');
    }

}
