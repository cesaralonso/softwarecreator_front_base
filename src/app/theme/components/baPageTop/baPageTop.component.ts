import { Si_clientesService } from './../../../pages/si_clientes/components/si_clientes-table/si_clientes.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../../shared/services/auth.service';
import { Component } from '@angular/core';
import { GlobalState } from '../../../global.state';
import * as _ from 'lodash';


@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  _cliente: any[] = [];

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;
  isAuth: boolean;
  isCajaCondominio: boolean = false;
  user;

  changepasswordAcceso = false;
  
  _clienteFiltered: any[] = [];
  clienteFilter: string;
  cliente_idcliente: number;

  constructor(
    private _state: GlobalState, 
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private clientesService: Si_clientesService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    // SI ES CREADO UN RESIDENTE SE RECARGA LISTADO PARA INCLUIRLO
    this._state.subscribe('clienteNuevo', (recargar: boolean) => {
      if (recargar) {
        this.getCliente();
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
      this.getCliente();
  }

  buscarProyecto(event) {
    event.preventDefault();
    if (!this.cliente_idcliente) {
      this.toastrService.info('Debes primero elegir un cliente.');
      return false;
    }
    this.router.navigate([`/pages/si_clientes/${this.cliente_idcliente}`]);
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
  getCliente() {
      /* if (this.user.servicio && this.user.si_rol_idsi_rol === 2) {
        this.clientesService.findByIdServicio(this.user.servicio) // si se debe bloquear por servicio desde user info en back
        .subscribe(
            (data: any) => {
                this._clienteFiltered = _.filter(data.result, row => row.viviendas);
                this._cliente = this._clienteFiltered;
              }
        ); */
      /* } else { */
        this.clientesService.all()
        .subscribe(
            (data: any) => {
                this._clienteFiltered = _.filter(data.result, row => row.viviendas);
                this._cliente = this._clienteFiltered;
              }
        );
      /* } */
  }
    onKeydownEvent(key) {
        key = key.toLowerCase();
        this._clienteFiltered = this._cliente;
        this._clienteFiltered = _.filter(this._clienteFiltered, row => 
            row.persona_persona_idpersona.toLowerCase().indexOf(key) > -1 || row.servicios.toLowerCase().indexOf(key) > -1 // deben ser parte del objeto
        );
    }
}
