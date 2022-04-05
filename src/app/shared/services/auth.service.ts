import { throwError as observableThrowError, Observable, throwError, Subject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ToasterService } from './../../shared/services/toaster.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from './../../app.constants';
import { LoginInterface } from './../../pages/login/login.interface';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({ providedIn: 'root' })
export class AuthService {
    private internalAuthChanged = new Subject<boolean>();
    
    token: string;
    idproceso: number | null;
    idcliente: number | null;
    idacopio: number | null;
    user_modules: any[];
    isLoggedIn: boolean = false;
    recordarSesion: boolean = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    private actionUrl: string;
    private headers: HttpHeaders;

    constructor(
        private _http: HttpClient, 
        private _configuration: Configuration,
        private router: Router, 
        private toastrService: ToasterService,
        public jwtHelper: JwtHelperService) {

        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json; charset=UTF-8');

        // Recordar la sesión desde LocalStorage
        this.recordarSesion = (localStorage.getItem('recordarSesion') === 'true') ? true : false;
        
        if (this.recordarSesion) {
            this.isLoggedIn = (localStorage.getItem('isLoggedIn') === 'true') ? true : false;
            this.token = (localStorage.getItem('token')) ? localStorage.getItem('token') : '';
            this.idproceso = (localStorage.getItem('idproceso')) ? +localStorage.getItem('idproceso') : null;
            this.idcliente = (localStorage.getItem('idcliente')) ? +localStorage.getItem('idcliente') : null;
            this.idacopio = (localStorage.getItem('idacopio')) ? +localStorage.getItem('idacopio') : null;
            this.user_modules = (localStorage.getItem('user_modules')) ? JSON.parse(localStorage.getItem('user_modules').toString()) : [];
        }
    }

    get authChanged() {
        return this.internalAuthChanged.asObservable();
    }

    private updateAuthStatus(logged: boolean) {
        this.internalAuthChanged.next(logged);
    }

    loggedIn() {
        this.isLoggedIn = this.token !== null && !this.jwtHelper.isTokenExpired(this.token);
        return this.isLoggedIn;
    }

    toBoolean(object: any): boolean {
        return (object.toString() === 'true') ? true : false;
    }

    login(values: LoginInterface): Observable<any> {
        this.actionUrl = `${this._configuration.apiUrl}si_user/login`;
        // const toAdd = JSON.stringify(values);
        return this._http.post(this.actionUrl, values, { headers: this.headers }).pipe(
            map((response: HttpResponse<any>) => <any>response),
            catchError(this.handleError),
            tap(response => {

                if (response.success) {

                    this.isLoggedIn = true;
                    this.updateAuthStatus(true);

                    this.token = response.token;
                    this.idproceso = response.idproceso;
                    this.idcliente = response.user.idcliente;
                    this.idacopio = response.user.idacopio;
                    this.recordarSesion = values.recordarSesion;
                    localStorage.setItem('recordarSesion', values.recordarSesion.toString());
                    
                    // Módulos permitidos a usuario
                    response.modules.forEach(element => {
                        const _path = '/pages/' + element.nombre.toLowerCase() + 's';
                        element.path = _path;
                    });
                    this.user_modules = response.modules;
                    
                    // IMPLEMENTADO PARA CHANGE-PASSWORD
                    localStorage.setItem('iduser', response.iduser);
                    localStorage.setItem('email', response.email);
                    localStorage.setItem('idrol', response.idrol);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('idproceso', response.user.proceso_idproceso || null);
                    localStorage.setItem('idcliente', response.user.idcliente || null);
                    localStorage.setItem('idacopio', response.user.idacopio || null);

                    if (values.recordarSesion) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('user_modules', JSON.stringify(this.user_modules));
                    }
                    this.toastrService.success(response.message);
                    // Regresa a página anterior si viene de otra página o a dashboard
                    if (this.redirectUrl !== undefined) {
                        this.router.navigateByUrl(this.redirectUrl);
                    } else {
                        this.navigateToFirstModule();
                    }
                } else {
                    this.toastrService.error(response.message);
                }
            }));
    }

    navigateToFirstModule() {
        if (this.idcliente) {
            this.router.navigate(['pages/pedidos']);
        } else if (this.idacopio) {
            this.router.navigate(['pages/recepcionacopios']);
        } else {
            this.router.navigate(['pages/pedidos']);
        }
    }

    logout(): Observable<any> {

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'JWT ' + this.token
            })};

        return this._http.post(`${this._configuration.apiUrl}app/cerrar-sesion`, {}, options).pipe(
            map((response: HttpResponse<any>) => <any>response),
            catchError(this.handleError),
            tap((response: any) => { 
                if (response.success) {
                    this.toastrService.success('Has cerrado la sesión, por favor vuelva a logearse.');

                    this.token = '';
                    this.isLoggedIn = false;
                    this.idproceso = null;
                    this.idcliente = null;
                    this.idacopio = null;
                    this.user_modules = [];

                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('user_modules');
                    localStorage.removeItem('recordarSesion');
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('iduser');
                    localStorage.removeItem('idrol');
                    localStorage.removeItem('idproceso');
                    localStorage.removeItem('idcliente');
                    localStorage.removeItem('idacopio');
                    this.router.navigate(['/login']);
                } else {
                    this.toastrService.error('La sesión no se cerró correctamente.');
                }
             }));

    }

    useJwtHelper() {
        const token = this.token;
        if (token !== undefined) {
            return this.jwtHelper.decodeToken(token);
        } else {
            return false;
        }
    }
        
    getUserModules() {
        if (this.user_modules) {
            return this.user_modules;
        } else {
            return [];
        }
    }

    getUserModulesPaths() {
        if (this.user_modules !== undefined) {
            const user_modules = JSON.parse(JSON.stringify(this.user_modules));
            const modules: string[] = [];
            user_modules.forEach(element => {
                modules.push(element.path);
            });
            return modules;
        } else {
            return [];
        }
    }

    isAuthenticated() {
        if (this.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    }

    modulePermission(module_path: string) {
        // una url puede ser como /pages/cadenapruebaestados/cliente/9/proyecto/ABC y todas las paths de modulos son como /pages/cadenapruebaestados...
        // partir para comparar con dos primeras partes
        if (module_path.indexOf('/') !== -1) {
            const urlSplited = module_path.split('/');
            const pathToCompare = `/${urlSplited[1]}/${urlSplited[2]}`;
            const modules = this.getUserModulesPaths();
            if (modules.indexOf(pathToCompare) !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            // No es una url válida
            return false;
        }
    }

    forgotPassword(email: string): Observable<any> {

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'JWT ' + this.token
            })};

        return this._http.post(`${this._configuration.apiUrl}si_user/forgot`, {email: email}, options).pipe(
            map((response: HttpResponse<any>) => <any>response),
            catchError(this.handleError),
            tap((response: any) => { 
                if (response.success) {
                    this.toastrService.success('Revisa tu correo para continuar el proceso.');
                    this.router.navigate(['/login']);
                } else {
                    this.toastrService.error('Ocurrió algún problema con el procedimiento, vuelve a intentarlo por favor.');
                }
             }));
    }

    private handleError(error: any) {
        console.log(error);
        return throwError(error || 'Server error');
    }

}
