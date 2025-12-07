import { DOCUMENT, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LatLngBounds, Map, Rectangle } from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, first, switchMap } from 'rxjs/operators';

import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { LeafletService } from '@app/services/leflet.service';
import { IAggregation, IAggregationArray } from '@app/services/models/map';

@Component({
  selector: 'app-regions-map',
  templateUrl: './regions-map.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    NgIf
  ]
})
export class RegionsMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  /**
   * Map instance
   */
  map: Map;

  /**
   * Clusters grid - aggregations
   */
  aggregationsGrid: IAggregation[];

  /**
   * Map properties and parameters
   */
  mapBounds: LatLngBounds;
  mapBoundsString: string;
  actualZoom = 2;
  clustersLayer = this.leafletService.layerGroup();
  aggregationClustersLayer = this.leafletService.layerGroup();
  mapOptions = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 3,
  };
  leafletOptions = {
    layers: [this.leafletService.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', this.mapOptions)],
    worldCopyJump: true,
  };

  /**
   * Default styles for map objects
   */
  circleAggregationStyle = {
    weight: 15,
    opacity: 0.4,
    className: 'clusterCircle',
    radius: undefined,
    fill: true,
    fillColor: '#0f2648',
    fillOpacity: 0.8,
  };

  rectangleStyle = {
    color: '#50a6ff',
    weight: 1,
  };

  /**
   * boundary box for first open map
   */
  rectangle: Rectangle;

  /**
   * Map Event
   */
  mapEvent: Subscription;

  /**
   * Rxjs Wrapper for Map Event
   */
  rxjsWrapperForMapEvent = {
    observable: function (types) {
      const subject = new Subject();
      this.on(types, event => subject.next(event));
      return subject;
    },
  };

  refreshMapButton = false;

  changeBbox: boolean;

  /**
   * dataset
   */
  @Input() item: any;

  /**
   * aggregation array
   */
  @Input() aggregations: IAggregationArray;

  /**
   * sort option to search request
   */
  @Input() sortOption: string;

  /**
   * param q from input to search request
   */
  @Input() paramQ: string;

  /**
   * refresh map after user chose a new location
   */
  @Input() refresh: any;

  /**
   * set default location to Poland when open map without choice location in filter
   */
  @Input() isDefaultLocation: boolean;

  /**
   * emit to hide map button click
   */
  @Output() hideMap = new EventEmitter<boolean>();

  /**
   * emit button click with new dataset from boundary box
   */
  @Output() datasetFromMap = new EventEmitter<any>();

  /**
   * emit remove active filters when click refresh map button
   */
  @Output() removeFilters = new EventEmitter<boolean>();

  /**
   * Map container reference
   */
  @ViewChild('mapRef') mapRef: ElementRef;

  constructor(
    private datasetService: DatasetService,
    @Optional() private leafletService: LeafletService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.setMapBounds();
  }

  ngOnDestroy(): void {
    this.mapEvent.unsubscribe();
  }

  ngOnChanges(): void {
    this.refresh.pipe(debounceTime(500), first()).subscribe(resp => {
      if (resp.ref) {
        this.changeBbox = resp.changeBbox;
        if (this.mapEvent) {
          this.mapEvent.unsubscribe();
        }
        this.clustersLayer.clearLayers();
        this.aggregationClustersLayer.clearLayers();
        this.setMapBounds();
        this.prepareDataForMap(this.aggregations);
        this.setMapEvent();
        this.map.fitBounds(this.mapBounds);
        this.setBBoxAndMarker();
      }
    });
  }

  /**
   * Add new map, set boundaries based on dataset
   */
  ngAfterViewInit(): void {
    this.map = this.leafletService.createMap(this.mapRef, this.leafletOptions);
    this.map.fitBounds(this.mapBounds);
    this.setBBoxAndMarker();
    this.map.addLayer(this.clustersLayer);
    this.actualZoom = this.map.getZoom();
    this.leafletService.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', this.mapOptions).addTo(this.map);
    this.prepareDataForMap(this.aggregations);
    this.leafletService.eventedInclude(this.rxjsWrapperForMapEvent);
    this.setMapEvent();
  }

  /**
   * set to map bbox, marker and add to layer group
   */
  setBBoxAndMarker(): void {
    this.rectangle = this.leafletService.rectangle(this.mapBounds, this.rectangleStyle).addTo(this.map);
    this.clustersLayer.addLayer(this.rectangle);
  }

  setMapEvent(): void {
    if (this.isDefaultLocation) {
      this.mapEvent = this.map['observable']('moveend')
        .pipe(
          debounceTime(500),
          switchMap(() => {
            this.changeBBoxIfNeeded();
            this.actualZoom = this.map.getZoom();
            const convert = Object.entries(this.item);
            const filters = convert.filter(([key, value]) => key !== 'regions' && value);

            if (filters.length > 0) {
              return this.datasetService.getDataFromBBox(this.mapBoundsString, this.sortOption, this.paramQ, filters);
            } else {
              return this.datasetService.getDataFromBBox(this.mapBoundsString, this.sortOption, this.paramQ);
            }
          }),
        )
        .subscribe(response => {
          this.setMapData(response, false);
        });
    } else {
      this.mapEvent = this.map['observable']('moveend').subscribe(() => {
        if (!this.refreshMapButton) {
          this.refreshMapButton = true;
        }
      });
    }
  }

  /**
   * button click to close map
   */
  onCloseMap(): void {
    this.hideMap.emit(true);
  }

  /**
   * button click to get data and refresh map
   */
  onRefreshMap(): void {
    this.actualZoom = this.map.getZoom();
    this.mapBounds = this.map.getBounds();
    this.mapBoundsString = this.setMapBoundsString();
    const convert = Object.entries(this.item);
    const filters = convert.filter(([key, value]) => key !== 'regions' && value);
    if (filters.length > 0) {
      this.datasetService.getDataFromBBox(this.mapBoundsString, this.sortOption, this.paramQ, filters).subscribe(resp => {
        this.setMapData(resp, false);
        this.setDataFromBBox();
      });
    } else {
      this.datasetService.getDataFromBBox(this.mapBoundsString, this.sortOption, this.paramQ).subscribe(resp => {
        this.setMapData(resp, true);
        this.setDataFromBBox();
      });
    }
  }

  setDataFromBBox(): void {
    this.refreshMapButton = false;
    this.isDefaultLocation = true;
    this.clustersLayer.clearLayers();
    this.mapEvent.unsubscribe();
    this.setMapEvent();
    this.removeFilters.emit(true);
  }

  setMapBounds(): void {
    const southWest = this.item.regions[Object.keys(this.item.regions)[0]].bbox[0];
    const northEast = this.item.regions[Object.keys(this.item.regions)[0]].bbox[1];
    this.mapBounds = this.leafletService.latLngBounds([southWest[1], southWest[0]], [northEast[1], northEast[0]]);
  }

  changeBBoxIfNeeded() {
    if (this.changeBbox) {
      this.mapBoundsString = '9.360087936473064,55.825973254619015,30.431865280223064,47.69497434186282,6';
      this.changeBbox = false;
    } else {
      this.mapBounds = this.map.getBounds();
      this.mapBoundsString = this.setMapBoundsString();
    }
  }

  /**
   * create string on boundary box to send to BE
   */
  private setMapBoundsString(): string {
    return `${this.mapBounds.getNorthWest().wrap().lng},${this.mapBounds.getNorthWest().wrap().lat},${
      this.mapBounds.getSouthEast().wrap().lng
    },${this.mapBounds.getSouthEast().wrap().lat},${this.actualZoom}`;
  }

  private setMapData(response: any, resetWithFilters: boolean): void {
    resetWithFilters
      ? this.datasetFromMap.emit({ resp: response, mapBounds: this.mapBoundsString })
      : this.datasetFromMap.emit({ resp: response, mapBounds: this.setMapBoundsString() });
    if (response.data && !this.aggregationsGrid) {
      this.prepareDataForMap(response.meta.aggregations);
    } else {
      this.clearMapView();
      this.prepareDataForMap(response.meta.aggregations);
    }
  }

  private prepareDataForMap(aggregations: IAggregationArray): void {
    this.aggregationsGrid = aggregations.map_by_regions;

    if (this.aggregationsGrid) {
      this.aggregationsGrid.map(aggregation => {
        this.displayAggregationCircles(aggregation);
      });
    }
  }

  private displayAggregationCircles(aggregation: IAggregation): void {
    this.circleAggregationStyle.radius = this.calculateCircleRadius(aggregation.doc_count);
    const aggregationCircle = this.leafletService.circleMarker(
      [aggregation.centroid[1], aggregation.centroid[0]],
      this.circleAggregationStyle,
    );
    const firstName = aggregation.region_name.indexOf(',');
    const restName = aggregation.region_name.indexOf(',') + 1;
    const template = `<div>${firstName !== -1 ? aggregation.region_name.slice(0, firstName) : aggregation.region_name},</div>
          <div class="map-region-name">${aggregation.region_name.slice(restName)}</div>
          <div class="map-icons-container">\
          <div><img src="assets/icomoon/SVG/zbior-danych.svg" /> ${aggregation.datasets_count} zbiory danych</div>\
          <div><img src="assets/icomoon/SVG/dane.svg" /> ${aggregation.resources_count} dane</div></div>`;
    aggregationCircle.bindTooltip(`${aggregation.doc_count}`, {
      permanent: true,
      direction: 'center',
      opacity: 1,
      // zoomAnimation: true,
      className: 'clusterText',
    });
    aggregationCircle.bindPopup(template, { closeButton: false, minWidth: 200, closeOnClick: false });
    aggregationCircle.addEventListener('mouseover', function () {
      aggregationCircle.openPopup();
    });
    aggregationCircle.addEventListener('mouseout', function () {
      aggregationCircle.closePopup();
    });
    this.aggregationClustersLayer.addLayer(aggregationCircle);
    this.aggregationClustersLayer.addTo(this.map);
  }

  private calculateCircleRadius(count: number): number {
    if (count < 10) {
      return 15;
    } else if (count >= 10 && count < 49) {
      return 20;
    } else if (count >= 50 && count < 99) {
      return 25;
    } else if (count >= 100 && count < 499) {
      return 27;
    } else if (count >= 500 && count < 999) {
      return 31;
    } else if (count >= 1000 && count < 4999) {
      return 33;
    } else if (count >= 5000 && count < 9999) {
      return 35;
    } else if (count >= 10000 && count < 14999) {
      return 37;
    } else if (count >= 15000 && count < 19999) {
      return 40;
    } else if (count >= 20000) {
      return 40;
    }
  }

  private clearMapView(): void {
    const allCircles = Array.from(this.document.querySelectorAll('.clusterCircle.leaflet-interactive'));
    allCircles.map(path => {
      path.parentNode.removeChild(path);
    });
    const allLabels = Array.from(this.document.querySelectorAll('.clusterText'));
    allLabels.map(path => {
      path.parentNode.removeChild(path);
    });
    /*const allMarkers = Array.from(this.document.querySelectorAll('.leaflet-marker-icon'));
    allMarkers.map(path => {
      path.parentNode.removeChild(path);
    });
    const allObjects = Array.from(this.document.querySelectorAll('.leaflet-interactive'));
    allObjects.filter(element => !element.classList.contains('distanceCircle')).map(element => element.parentNode.removeChild(element));*/
  }
}
