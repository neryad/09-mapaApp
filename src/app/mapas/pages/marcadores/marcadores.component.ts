import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}
@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
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
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef;
  zoomLevel: number = 15;
  center: [number, number] = [-69.93750922045666, 18.470937424234418];
  marcadores: MarcadorColor[] = [];
  map!: mapboxgl.Map;
  constructor() {}
  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });
    this.leerLocalStorage();
    // const markerHtml: HTMLElement = document.createElement('div');
    // new mapboxgl.Marker().setLngLat(this.center).addTo(this.map);
  }
  irMarcador(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat(),
    });
  }

  agregarMarcador() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color,
    })
      .setLngLat(this.center)
      .addTo(this.map);

    this.marcadores.push({
      color,
      marker: nuevoMarcador,
    });
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );

    lngLatArr.forEach((m) => {
      const newMaker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.map);

      this.marcadores.push({
        marker: newMaker,
        color: m.color,
      });

      newMaker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
    });
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
