import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawAddon } from '@common/draw';
import GeoJSON from 'ol/format/GeoJSON';
import { MapService } from '../map.service';
import { BasemapComponent } from '../basemap/basemap.component';
import { GeoJsonFeatureAddon } from '@common/feature';
import { pointClickStyle, GeoJsonFeature } from '@common/geolib'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Farm } from '../models/Farm';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements OnInit {

  private _map!: BasemapComponent;
  private _geometries: GeoJsonFeature[] = [];
  farm!: Farm;
  form!: FormGroup;
  isBtnDisabled: boolean = false;
  modalReference: any;

  constructor(private fb: FormBuilder,
              private _mapService: MapService,
              private modalService: NgbModal,
              private farmService: FarmService) { }

  ngOnInit() {
    this._map = this._mapService.map;

    this.form = this.fb.group({
      name: [null],
      area: [null]
    });
  }

  draw(type: 'Circle') {
    if(!this._map) return
    this._map.includeAddon(new DrawAddon({
      identifier: 'geometry_map',
      drawType: type,
      callback: geometry => {
          const geo = new GeoJSON().writeGeometryObject(geometry) as any
          this.handleNewGeometry(geo)
        }
      }))
  }

  geometrySeed: number = 1
  handleNewGeometry(geometry: any) {
    const identifier = this.geometrySeed++
    this._map.includeAddon(
      new GeoJsonFeatureAddon({
        identifier: `geometry::${identifier}`,
        feature: geometry,
        styleFunction: () => {
          return pointClickStyle({
            hover: false,
            strokeColor: '#1962D1',
          })
        },
      })
    )
    this._map.fitToAddons(this._map.listByPrefix('geometry'))
    console.log('New geometry', geometry)
    this._geometries.push(geometry)
  }

  save() {
    if (this._geometries) {
      this.farm = {
        name: this.form.value.name,
        geomtry: this._geometries,
        area: this.form.value.area,
        centroid: [1],
        owner: {
          name: 'Patrick Machado',
          document: '38223409879',
          document_type: 'CPF'
        }
      }
      this.farmService.create(this.farm).subscribe(
        data => {
          const response = (data as any);
            this.isBtnDisabled = false;
            this.farmService.showAlertToast('success', 'Uhuuuuul, Seu Cadastro foi criado com sucesso!');
        },
        error => {  
          this.farmService.showAlertToast("error", error.message);
        }
      );
    } else {
      this.farmService.showAlertToast('error', 'Sinto muito, mas você precisa desenhar uma área no mapa para poder salvar.');
    }
  }

  ngOnDestroy() {
    this._map.removeByPrefix('geometry')
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.modalReference.result.then((result) => {
      if (result == 'new') {
        this.isBtnDisabled = true;
        (<HTMLInputElement>document.getElementById("btn-draw")).style.display = 'block';
        (<HTMLInputElement>document.getElementById("btn-save")).style.display = 'block';
      }
    });
  }

  validateForm() {
    let validate = true;
    let form = this.form.value;
    let message = '';

    if (!form.name) {
      validate = false;
      message = 'Informar o Nome é obrigatório';
    }
    else if (!form.area) {
      validate = false;
      message = 'Informar a Area é obrigatório';
    }

    if (validate) {
      this.modalReference.close('new');
    } else {
      this.farmService.showAlertToast('error', message);
    }
  }
}