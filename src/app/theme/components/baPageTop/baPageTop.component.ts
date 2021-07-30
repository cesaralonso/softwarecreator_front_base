import { Router } from '@angular/router';
import { AuthService } from './../../../shared/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../../global.state';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;
  isAuth: boolean;
  user: any;

  changepasswordAcceso = false;

  constructor(
    private _state: GlobalState, 
    private authService: AuthService,
    private router: Router) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
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

  /* buscar(id: string, event) {
    event.preventDefault();
      this.router.navigate([`/pages/${id}`]);
  } */

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
      console.log('response logout', response);
    });
  }

}
