
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { LoginResponseInterface } from './../login/login-response.interface';
import { LoginInterface } from './../login/login.interface';
import { AuthService } from './../../shared/auth.service';
import { Configuration } from './../../app.constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';




@Injectable()
export class ChangePasswordService {

    private headers: Headers;
    private options: RequestOptions;
    private endPoint: string;

    constructor(private _http: Http,
        private _configuration: Configuration,
        private authService: AuthService) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json; charset=UTF-8');
        this.headers.append('Authorization', 'JWT ' + this.authService.token);
        this.options = new RequestOptions({ headers: this.headers });
        this.endPoint = `${this._configuration.ServerWithApiUrl}si_user/`;
    }

    changePassword = ( credenciales: LoginInterface ) : Observable<LoginResponseInterface> => {
        return this._http.patch(this.endPoint, credenciales, this.options).pipe(
            map((response: Response) => response.json()),
            catchError(this.handleError),);
    }

    private handleError(error: Response) {
        console.error(error);
        return observableThrowError(error.json().error || 'Server error');
    }

}