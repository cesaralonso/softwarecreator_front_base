import { AuthService } from './../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';


@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements AfterViewInit, OnInit {

  // Permisos en vista
  updateable: boolean = false;
  deleteable: boolean = false;
  writeable: boolean = false;

  _semana = [];
  semana: any;
  semanaGranaje = [];
  semanaFruta = [];

  user: any;

  constructor(
    private toastrService: ToastrService,
    private authService: AuthService) {
      
      // Buscar permisos del usuario en el módulo
      this.user = this.authService.useJwtHelper();
      
      if (this.user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/dashboard') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
            }
          }
        }
      }

      // crea semanas
      let _semanas = [];
      for(let i=1; i < 53; i++) {
        _semanas = [..._semanas, i];
      }
      this._semana = _semanas;
  }

  ngOnInit() {
    // Setea valores iniciales
    this.getSemanaActual();
    this.filtrar();
  }

  ngAfterViewInit() {
  }

  getSemanaActual() {
    this.semana = moment().week();
  }

  filtrar() {
    this.semanaGranaje = [];
    this.semanaFruta = [];
    this.getData();
  }

  getData = () => {
    const semanaGranaje = [];
    const semanaFruta = [];
  
    const semanas = [1,2,3];

    //// TONELADAS GRAMAJE/FRUTA, ARMAR PAQUETES POR CADA SEMANA, ASÍ VIENE DESDE API YA SEPARADO, 
    semanas.forEach((semana: number) => {
      
      const granaje = [
        {
          value: 123 * semana,
          label: '32s',
          order: 1,
        },
        {
          value: 234 * semana,
          label: '36s',
          order: 2,
        },
        {
          value: 345 * semana,
          label: '40s',
          order: 3,
        }, {
          value: 456 * semana,
          label: '48s',
          order: 4,
        }, {
          value: 456 * semana,
          label: '60s',
          order: 5,
        }, {
          value: 567 * semana,
          label: '70s',
          order: 6,
        }, {
          value: 678 * semana,
          label: '84s',
          order: 7,
        }, {
          value: 789 * semana,
          label: '4tas',
          order: 8,
        }, 
      ];

      semanaGranaje.push({
        semana: semana,
        totalToneladasSemana: 1234 * semana,
        data: granaje
      });
  
      const fruta = [
        {
          value: 987 * semana,
          label: 'Hass',
          order: 1,
        }, {
          value: 876 * semana,
          label: 'Flor de María',
          order: 2,
        }, {
          value: 765 * semana,
          label: 'Mendez',
          order: 3,
        }, {
          value: 654 * semana,
          label: 'Loca',
          order: 4,
        }, {
          value: 543 * semana,
          label: 'Marceña',
          order: 5,
        }, {
          value: 432 * semana,
          label: 'Criollo',
          order: 6,
        }, {
          value: 321 * semana,
          label: 'Aventajado',
          order: 7,
        }, {
          value: 210 * semana,
          label: 'Otro',
          order: 8,
        }, 
      ];

      semanaFruta.push({
        semana: semana,
        totalToneladasSemana: 9876 * semana,
        data: fruta
      });

    });

    this.semanaGranaje = semanaGranaje;
    this.semanaFruta = semanaFruta;
  }

}
