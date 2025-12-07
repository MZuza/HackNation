import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import {
  Circle,
  CircleMarker,
  CircleMarkerOptions,
  GeoJSON,
  GeoJSONOptions,
  Icon,
  IconOptions,
  LatLngBounds,
  LatLngBoundsExpression,
  LatLngExpression,
  Layer,
  LayerGroup,
  LayerOptions,
  Map,
  MapOptions,
  Marker,
  MarkerOptions,
  PolylineOptions,
  Rectangle,
  TileLayer,
  TileLayerOptions,
} from 'leaflet';

/**
 * Leaflet Service
 * Service expose Leaflet library features to other parts of application
 * Service is required by SSR
 */
@Injectable()
export class LeafletService {
  private L = null;

  /**
   * @ignore
   */
  constructor(private zone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.L = require('leaflet');
    }
  }

  /**
   * Creates leaflet icon
   * @param options
   * @returns {Icon}
   */
  icon(options: IconOptions): Icon {
    return this.L.icon(options);
  }

  /**
   * Creates leaflet circle
   * @param latlng
   * @param options
   * @returns {Circle}
   */
  circle(latlng: LatLngExpression, options?: CircleMarkerOptions): Circle {
    return this.L.circle(latlng, options);
  }

  /**
   * Creates leaflet rectangle
   * @param latLngBounds
   * @param options
   * @returns {Rectangle}
   */
  rectangle(latLngBounds: LatLngBoundsExpression, options?: PolylineOptions): Rectangle {
    return this.L.rectangle(latLngBounds, options);
  }

  /**
   * Creates leaflet latLngBounds
   * @param southWest
   * @param northEast
   * @returns {LatLngBounds}
   */
  latLngBounds(southWest: LatLngExpression, northEast: LatLngExpression): LatLngBounds {
    return this.L.latLngBounds(southWest, northEast);
  }

  /**
   * Creates leaflet circleMarker
   * @param latlng
   * @param options
   * @returns {CircleMarker}
   */
  circleMarker(latlng: LatLngExpression, options?: CircleMarkerOptions): CircleMarker {
    return this.L.circleMarker(latlng, options);
  }

  /**
   * Creates leaflet geoJSON
   * @param geojson
   * @param options
   * @returns {GeoJSON}
   */
  geoJSON(geojson?: any, options?: GeoJSONOptions): GeoJSON {
    return this.L.geoJSON(geojson, options);
  }

  /**
   * Creates leaflet marker
   * @param latlng
   * @param options
   * @returns {Marker}
   */
  marker(latlng: LatLngExpression, options?: MarkerOptions): Marker {
    return this.L.marker(latlng, options);
  }

  /**
   * Creates leaflet titleLayer
   * @param urlTemplate
   * @param options
   * @returns {TileLayer}
   */
  tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer {
    return this.L.tileLayer(urlTemplate, options);
  }

  /**
   * Creates leaflet layerGroup
   * @param layers
   * @param options
   * @returns {LayerGroup}
   */
  layerGroup(layers?: Layer[], options?: LayerOptions): LayerGroup {
    return this.L.layerGroup(layers, options);
  }

  /**
   * Creates leaflet Evented Include
   * @param props
   * @returns {any}
   */
  eventedInclude(props: any): any {
    return this.L.Evented.include(props);
  }

  /**
   * Add leaflet map to DOM
   * @param elementRef
   * @param options
   * @returns {Map}
   */
  createMap(elementRef: ElementRef, options: MapOptions): Map {
    let map: Map;
    this.zone.runOutsideAngular(() => {
      map = this.map(elementRef.nativeElement, options);
    });
    return map;
  }

  /**
   * Creates leaflet map object
   * @param element
   * @param options
   * @returns {Map}
   */
  private map(element: string | HTMLElement, options?: MapOptions): Map {
    return this.L.map(element, options);
  }
}
