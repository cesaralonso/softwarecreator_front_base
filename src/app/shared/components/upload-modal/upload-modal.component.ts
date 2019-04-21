import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UploadModalService } from './upload-modal.service';
import { Response } from '@angular/http';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploaderOptions } from 'ngx-uploader';
import { Configuration } from './../../../app.constants';

export interface ArchivoInterface {
  idreferencia: number;
  proceso: string;
  tipoarchivo: string;
  urlarchivo: string;
}

@Component({
  selector: 'upload-service-modal',
  styleUrls: [('./upload-modal.component.scss')],
  templateUrl: './upload-modal.component.html'
})
export class UploadModalComponent implements OnInit {

  id: number;
  descripcion: string;
  referencia: string;
  modalHeader: string;

  defaultPicture = 'assets/img/theme/no-photo.png';

  profile: any = {
    picture: 'assets/img/theme/no-photo.png',
  };

  /*fileUploaderOptions: UploaderOptions = {
    url: `${this._configuration.imageServerWithApiUrl}images/`,
  };*/
  fileUploaderOptions: UploaderOptions = {
    concurrency: 0,
  };

  uploadCompled(event: any) {
    if (event.done) {
      const response = JSON.parse(event.response);
      if (response.status === 'success') {
        const archivo: ArchivoInterface = {
            idreferencia: this.id,
            proceso: this.referencia,
            tipoarchivo: response.type,
            urlarchivo: response.src,
        }
        this.service.setFile(archivo)
          .subscribe(
            (data: any) => this.showToast(data),
            error => console.log(error),
            () => this.activeModal.hide(1));
      }
    }
  }

  showToast(data) {
    if (data.status === 'success') {
      this.toastrService.success(data.message);
    } else {
      this.toastrService.error(data.message);
    }
  }

  constructor(private service: UploadModalService, 
              private activeModal: BsModalService,
              private toastrService: ToastrService, 
              private _configuration: Configuration ) {
  }

  closeModal() {
    this.activeModal.hide(1);
  }

  ngOnInit() {
  }
}
