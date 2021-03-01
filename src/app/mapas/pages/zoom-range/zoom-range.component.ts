import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { element } from 'protractor';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }
      .row {
        width: 400px;
        background-color: white;
        position: fixed;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        z-index: 999;
        border-radius: 5px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef;
  zoomLevel: number = 10;
  map!: mapboxgl.Map;
  constructor() {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-69.93750922045666, 18.470937424234418],
      zoom: this.zoomLevel,
    });

    this.map.on('zoom', (ev) => {
      const zoomActual = this.map.getZoom();
      this.zoomLevel = zoomActual;
    });

    this.map.on('zoomend', (ev) => {
      if (this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    });
  }

  zoomIn() {
    this.map.zoomIn();
  }
  zoomOut() {
    this.map.zoomOut();
  }

  zoomCambio(valor: string) {
    this.map.zoomTo(Number(valor));
  }
}
