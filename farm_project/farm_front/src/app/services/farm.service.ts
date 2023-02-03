import { Injectable } from '@angular/core'
import { Farm } from './../models/Farm'

import { HttpClient } from '@angular/common/http';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  options  : ToastrConfig;
  private lastInserted  : number[] = [];

  constructor(public http: HttpClient,
              public toastrService: ToastrService) {
                this.options = this.toastrService.toastrConfig;
                this.options.positionClass = 'toast-top-center';
                this.options.timeOut = 3000;
              }

  create(farm: Farm) {
    var url:string = "localhost:8000/api/v1/create";
    return this.http.post(url, farm);
  }

  read(id: number): Farm {
    return {} as any
  }

  list(): Farm[] {
    return []
  }

  showAlertToast(type, message) {
    const opt = JSON.parse(JSON.stringify(this.options));

    const inserted = this.toastrService[type](message, "", opt);
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }

}
