import { ResidentesService } from './../../../pages/residentes/components/residentes-table/residentes.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../../shared/auth.service';
import { Component } from '@angular/core';
import { GlobalState } from '../../../global.state';
import * as _ from 'lodash';


@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  _residente: any[] = [];

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;
  isAuth: boolean;
  isCajaCondominio: boolean = false;
  user;

  changepasswordAcceso = false;
  
  _residenteFiltered: any[] = [];
  residenteFilter: string;
  residente_idresidente: number;

  constructor(
    private _state: GlobalState, 
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private residentesService: ResidentesService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    // SI ES CREADO UN RESIDENTE SE RECARGA LISTADO PARA INCLUIRLO
    this._state.subscribe('residenteNuevo', (recargar: boolean) => {
      if (recargar) {
        this.getResidente();
      }
    });


    // VALIDAR ÁREA DE EMPLEADO/USUARIO
    this.isAuth = this.authService.isLoggedIn;
    if (this.isAuth) {
      this.user = this.authService.useJwtHelper();
      
      if (this.user.super) {
          this.changepasswordAcceso = true;
      } else {
          const userModules = this.authService.getUserModules();
          if (userModules[0]) {
              for (const element in userModules) {
                  if (userModules.hasOwnProperty(element)) {
                      if (userModules[element].path === '/pages/change-passwords') {
                          this.changepasswordAcceso = userModules[element].acceso;
                      }
                  } 
              }
          }
      }    
    }
  }

  ngOnInit() {
      this.getResidente();
  }

  buscarProyecto(event) {
    event.preventDefault();
    if (!this.residente_idresidente) {
      this.toastrService.info('Debes primero elegir un residente.');
      return false;
    }
    this.router.navigate([`/pages/residentes/${this.residente_idresidente}`]);
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  logout() {
    this.authService.logout().toPromise().then(response => {
    });
  }

  showToast(result) {
    if (result.success) {
      this.toastrService.success(result.message);
    } else {
      this.toastrService.error(result.message);
    }
  }
  getResidente(idresidente?: number) {
      if (this.user.fraccionamiento && this.user.si_rol_idsi_rol === 2) {
        this.residentesService.findByIdCondominio(this.user.fraccionamiento) // deberia ser allAsignados pero por algo no jala bien..
        .subscribe(
            (data: any) => {
                this._residenteFiltered = _.filter(data.result, row => row.viviendas);
                this._residente = this._residenteFiltered;
              }
        );
      } else {
        this.residentesService.all() // deberia ser allAsignados pero por algo no jala bien..
        .subscribe(
            (data: any) => {
                this._residenteFiltered = _.filter(data.result, row => row.viviendas);
                this._residente = this._residenteFiltered;
              }
        );
      }
  }
    onKeydownEvent(key) {
        key = key.toLowerCase();
        this._residenteFiltered = this._residente;
        this._residenteFiltered = _.filter(this._residenteFiltered, row => 
            row.persona_residente.toLowerCase().indexOf(key) > -1 || row.viviendas.toLowerCase().indexOf(key) > -1
        );
    }
}
