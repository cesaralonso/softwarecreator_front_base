import { LiquidacionsInterface } from './../liquidacions/components/liquidacions-table/liquidacions.interface';
/* import { LiquidacionsService } from './../liquidacions/components/liquidacions-table/liquidacions.service'; */
import { VehiculosAddModalComponent } from './../vehiculos/components/vehiculos-table/vehiculos-add-modal/vehiculos-add-modal.component';
import { VehiculosInterface } from './../vehiculos/components/vehiculos-table/vehiculos.interface';
import { AlumnosInterface } from './../alumnos-table/alumnos.interface';
import { AlumnosResponseInterface } from './../alumnos-table/alumnos-response.interface';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ToastrService } from 'ngx-toastr';
import { AlumnosService } from './../alumnos-table/alumnos.service';
import { FacturacionsInterface } from './../facturacions/components/facturacions-table/facturacions.interface';
import { FacturacionsAddModalComponent } from './../facturacions/components/facturacions-table/facturacions-add-modal/facturacions-add-modal.component';
import { SugerenciasInterface } from './../sugerencias/components/sugerencias-table/sugerencias.interface';
import { SugerenciasAddModalComponent } from './../sugerencias/components/sugerencias-table/sugerencias-add-modal/sugerencias-add-modal.component';
import { CommonService } from '../../shared/common.service';


@Component({
  selector: 'alumnos-profile',
  templateUrl: './alumnos-profile.component.html',
  styleUrls: ['./alumnos-profile.component.scss']
})
export class ProfileComponent implements OnInit {
    item: any;
    idalumno: number;

  _liquidacion: LiquidacionsInterface[] = [];
  _liquidacion_filtered: LiquidacionsInterface[] = [];

    // Permisos en vista
    updateable = false;
    deleteable = false;
    writeable = false;

    filterQuery1: string;
    filterQuery2: string;

    mesActual: string;

    constructor(
      private service: AlumnosService, 
      private toastrService: ToastrService, 
      private dialogService: DialogService, 
      private authService: AuthService, 
      private route: ActivatedRoute, 
      private router: Router,
      private commonService: CommonService) {

      // Buscar permisos del usuario en el módulo
      const user = this.authService.useJwtHelper();
      
      if (user.super) {
        this.updateable = true;
        this.deleteable = true;
        this.writeable = true;
      } else {
        const userModules = this.authService.getUserModules();
        if (userModules[0]) {
          for (const element in userModules) {
            if (userModules[element].path === '/pages/alumnos') {
              this.updateable = userModules[element].updateable;
              this.deleteable = userModules[element].deleteable;
              this.writeable = userModules[element].writeable;
            }
          }
        }
      }
    }
    ngOnInit() {
      this.refill();

      // Fecha actual para estado de cuenta
      this.mesActual = this.commonService.getDate();
    }
    refill() { 
      this.route.params.subscribe(params => {
        if (params['idalumno'] !== undefined) {
          this.idalumno = +params['idalumno'];
          this.findByIdResidente(this.idalumno);
        }
      });
    }
    private findByIdResidente(id: number): void {
      this.service
        .findById(id)
        .subscribe(
            (data: AlumnosResponseInterface) => {
                if (data.success) {
                  data.result.cursos.map(vivienda => vivienda.liquidaciones = data.result.liquidaciones.filter(liquidacion => liquidacion.numero === vivienda.numero));
                  this.item = data.result;
                  console.log(this.item);
                } else {
                  this.toastrService.error(data.message);
                }
            },
            error => console.log(error),
            () => console.log('Get all Items complete'))
    }
    
    viewPersona(alumnos: AlumnosInterface, contacto?: boolean) {
      if (contacto) {
        this.router.navigate([`/pages/personas/${alumnos.aval1}`]);
      } else {
        this.router.navigate([`/pages/personas/alumno/${alumnos.idalumno}`]);
      }
    }
    viewPagoliquidacion(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/pagoliquidacions/alumno/${alumnos.idalumno}`]);
    }
    viewInmuebleasignado(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/inmuebleasignados/alumno/${alumnos.idalumno}`]);
    }
    viewPago(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/pagos/alumno/${alumnos.idalumno}`]);
    }
    viewLiquidacion(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/liquidacions/alumno/${alumnos.idalumno}`]);
    }
    pagarFactura(item: any) {
      this.router.navigate([`/pages/pagos/producto/${item.idliquidacion}`]);
    }
    insertFacturacion(alumnos: AlumnosInterface) {
      const facturacion: FacturacionsInterface = {
        alumno_idalumno: alumnos.idalumno
      }
      const disposable = this.dialogService.addDialog(FacturacionsAddModalComponent, facturacion)
      .subscribe( data => {
          if (data) {
              this.facturacionShowToast(data);
          }
      });
    }
    facturacionShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewFacturacion(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/facturacions/alumno/${alumnos.idalumno}`]);
    }
    insertSugerencia(idcurso: number, curso: string) {
      const sugerencia: SugerenciasInterface = {
        alumno_idalumno: this.idalumno,
        curso_idcurso: idcurso,
        curso: curso
      }
      const disposable = this.dialogService.addDialog(SugerenciasAddModalComponent, sugerencia)
      .subscribe( data => {
          if (data) {
              this.sugerenciaShowToast(data);
          }
      });
    }
    sugerenciaShowToast(result) {
        if (result.success) {
            this.toastrService.success(result.message);
            this.refill();
        } else {
            this.toastrService.error(result.message);
        }
    }
    viewSugerencia(alumnos: AlumnosInterface) {
      this.router.navigate([`/pages/sugerencias/alumno/${alumnos.idalumno}`]);
    }

}