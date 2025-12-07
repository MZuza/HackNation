import { LatLngExpression } from 'leaflet';

export interface IAggregation {
  region_name?: string;
  doc_count: number;
  resources_count: number;
  datasets_count: number;
  centroid: number[];
  shapes: IGeoShape[];
}

export interface ICoordinates {
  lat: number;
  lon?: number;
  lng?: number;
  count?: number;
}

export interface IGeoShape {
  shape: IGeometry;
  label?: string;
}

export interface IGeometry {
  coordinates: number[];
  type: string;
}

export interface IMapFilterParams {
  noData?: string;
  boundaryBox?: string;
  shapesCount?: string;
  distance?: string;
  coordinates?: LatLngExpression;
  q?: string;
}

export interface IDisplayedObjectInfo {
  id: string;
  layerId: number;
  label: string;
}

export interface INominatimGeocodeResponse {
  display_name: string;
  lat: string;
  lon: string;
}

export interface INominatimSearchResponse {
  features: INominatimFeatures[];
}

export interface INominatimFeatures {
  type: string;
  bbox: number[];
  geometry: IGeometry;
  properties: {
    display_name: string;
  };
}

export interface IAggregationArray {
  map_by_regions?: IAggregation[];
  counters: {};
}
