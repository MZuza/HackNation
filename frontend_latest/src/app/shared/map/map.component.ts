import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LatLngBounds, Layer, LayerGroup, Map, Marker } from 'leaflet';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRouteHelper } from '../helpers/activated-route.helper';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { MapOptionsComponent as MapOptionsComponent_1 } from './map-options/map-options.component';

import { DatasetService } from '@app/services/dataset.service';
import { LeafletService } from '@app/services/leflet.service';
import { IAggregation, IDisplayedObjectInfo, IGeoShape, IMapFilterParams } from '@app/services/models/map';
import { UserLocationData } from '@app/services/models/user-location-data';
import { MapOptionsComponent } from '@app/shared/map/map-options/map-options.component';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    standalone: true,
    imports: [
        TooltipDirective,
        MapOptionsComponent_1,
        TranslatePipe,
    ],
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Incoming resource ID
   */
  @Input() resourceId: string;

  /**
   * Map options component reference
   */
  @ViewChild(MapOptionsComponent) mapOptionsComponent: MapOptionsComponent;

  /**
   * Map container reference
   */
  @ViewChild('mapRef') mapRef: ElementRef;

  /**
   * Aggregation threshold. If aggregation doc_count falls below this value, instead of it, map displays markers.
   */
  aggregationThreshold = 9;

  /**
   * Describes how many geo shapes (lines, polygons) should be returned by API
   */
  shapesCount = '100';

  /**
   * Clusters grid - aggregations
   */
  aggregationsGrid: IAggregation[];
  /**
   * Lines and polygons shapes
   */
  linesAndPolygonsShapes: any;

  /**
   * Map instance
   */
  map: Map;

  /**
   * User location data.
   */
  userLocation: UserLocationData;

  /**
   * User location Marker
   */
  userLocationMarker: Marker;

  /**
   * User settings
   */
  userSettings: {};

  /**
   * Map properties and parameters
   */
  mapBounds: LatLngBounds;
  mapBoundsString: string;
  actualZoom = 2;
  clustersLayer = this.leafletService.layerGroup();
  mapOptions = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 3,
  };
  leafletOptions = {
    layers: [this.leafletService.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', this.mapOptions)],
    worldCopyJump: true,
  };

  /**
   * Default styles for map objects
   */
  circleStyle = {
    weight: 15,
    opacity: 0.4,
    className: 'clusterCircle',
    radius: undefined,
    fill: true,
    fillColor: '#0f2648',
    fillOpacity: 0.8,
  };

  /**
   * Marker properties
   */
  markerProperties = {
    icon: this.leafletService.icon({
      iconUrl: 'assets/icomoon/SVG/pin-pop.svg',
      className: 'smallPin',
    }),
    keyboard: false,
  };

  /**
   * Details about Objects on Map
   */
  detailsAboutObjectsOnMap: IDisplayedObjectInfo[];

  /**
   * Labels
   */
  labels = new BehaviorSubject<any>(null);

  /**
   * Map Options visibility flag
   */
  isMapOptionsVisible = false;

  /**
   * Click event enable flag
   */
  isClickEventEnable = false;

  /**
   * Map Event
   */
  mapEvent: Subscription;

  /**
   * Geo Jsons Layers Ids
   */
  geoJsonsLayersIds: any;

  /**
   * Geo Jsons Layer Group
   */
  geoJsonsLayerGroup: LayerGroup;

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

  /**
   * Resource search query and filters subscription
   */
  resourceFilterSubscription: Subscription;

  /**
   * Resource search query and filters (table, chart, map)
   */
  filter$: Observable<string>;

  /**
   * Emergency Poland bounds in case of api failures
   */
  polandBounds = {
    bottom_right: [24, 49],
    top_left: [14, 55],
  };

  /**
   * @ignore
   */
  constructor(
    private datasetService: DatasetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    @Optional() private leafletService: LeafletService,
  ) {}

  /**
   * Initializes map boundaries.
   * Initializes and updates map data on every queryParam and resource filter change.
   */
  ngOnInit() {
    if (!this.resourceId) {
      this.resourceId = ActivatedRouteHelper.getParamFromCurrentOrParentRoute(this.activatedRoute, 'resourceId');
    }

    this.filter$ = this.datasetService.resourceFilterChanged$.pipe(distinctUntilChanged());

    this.resourceFilterSubscription = this.filter$.subscribe(filterQuery => {
      this.router.navigate([], { queryParams: { q: filterQuery }, replaceUrl: true });
    });

    this.activatedRoute.queryParamMap
      .pipe(switchMap(() => this.datasetService.getGeoData(this.resourceId, { noData: 'true' })))
      .subscribe(response => {
        const bounds =
          response.meta.aggregations && response.meta.aggregations.bounds ? response.meta.aggregations.bounds : this.polandBounds;

        this.mapBounds = this.leafletService.latLngBounds(
          [bounds['bottom_right'][1], bounds['top_left'][0]],
          [bounds['top_left'][1], bounds['bottom_right'][0]],
        );
        this.mapBoundsString = this.setMapBoundsString();
        this.map.fitBounds(this.mapBounds);
      });
  }

  /**
   * Add event stream wrapper for map events and subscribe to it.
   * Reloads data on the map including search query and filters.
   */
  ngAfterViewInit() {
    this.map = this.leafletService.createMap(this.mapRef, this.leafletOptions);
    this.leafletService.eventedInclude(this.rxjsWrapperForMapEvent);
    this.mapEvent = this.map['observable']('moveend')
      .pipe(
        debounceTime(500),
        withLatestFrom(this.filter$),
        switchMap(([event, filterQuery]) => {
          this.actualZoom = event.sourceTarget.getZoom();
          this.mapBounds = event.sourceTarget.getBounds();
          this.mapBoundsString = this.setMapBoundsString();
          this.clustersLayer = this.leafletService.layerGroup();

          return this.datasetService.getGeoData(this.resourceId, {
            ...this.buildParamsObject(),
            q: filterQuery,
          });
        }),
      )
      .subscribe(response => {
        this.prepareNewDataAndMap(response);
      });
  }

  /**
   * Prepare incoming data to display on map
   */
  prepareNewDataAndMap(data: any) {
    if (!data) {
      return;
    }
    this.aggregationsGrid = data.meta.aggregations.tiles;
    this.linesAndPolygonsShapes = data.data.filter(element => element.attributes.shape.type !== 'Point').map(element => element.attributes);
    this.clearMapView();
    this.markPointUserLocation();
    this.displayData();
  }

  /**
   * Toggle mapOptionsComponent visibility
   */
  toggleMapOptions() {
    this.isMapOptionsVisible = !this.isMapOptionsVisible;
    if (this.isMapOptionsVisible === false) {
      this.isClickEventEnable = false;
      this.map.off('click');
    } else {
      this.toggleClickEventOnMap(true);
    }
  }

  /**
   * Handling user's location settings
   */
  displayUserPreferences(event) {
    if (this.userLocation) {
      this.map.removeLayer(this.userLocation.getCircleMarker());
      this.clearMapView();
    }
    if (!event && this.userSettings) {
      this.datasetService.getGeoData(this.resourceId, this.buildParamsObject()).subscribe(response => this.prepareNewDataAndMap(response));
      this.userSettings = null;
      this.toggleMapOptions();
      return;
    }
    if (event && event.distance) {
      this.userLocation = new UserLocationData(event, this.leafletService);
      this.userLocation.circle().addTo(this.map);
      this.map.fitBounds(this.userLocation.getBounds());
    }
  }

  /**
   * Enable / disable 'click' event on map
   */
  toggleClickEventOnMap(state: boolean) {
    this.isClickEventEnable = state;
    if (this.mapOptionsComponent && this.isClickEventEnable && this.mapOptionsComponent.isAddressFormVisible) {
      this.map.on('click', (event: any) => {
        this.displayUserPreferences({
          center: [event.latlng.lng, event.latlng.lat],
          distance: this.mapOptionsComponent.getActualDistance(),
        });
        this.mapOptionsComponent.onUserLocationClick(event.latlng);
      });
    } else {
      this.map.off('click');

      if (this.userLocationMarker && this.userLocation) {
        this.map.removeLayer(this.userLocation.getCircleMarker());
        this.map.removeLayer(this.userLocationMarker);
        this.userLocation = null;
      }
    }
  }

  /**
   * Unsubscribe from map events stream
   */
  ngOnDestroy() {
    this.mapEvent.unsubscribe();
  }

  /**
   * Save user location preferences
   */
  saveUserSettings(settings) {
    this.userSettings = settings;
    this.toggleMapOptions();
  }

  /**
   * Resets map view after clear input text field
   */
  clearForm() {
    if (!this.userLocation) {
      return;
    }
    this.map.removeLayer(this.userLocation.getCircleMarker());
    this.userLocation = null;
    this.datasetService.getGeoData(this.resourceId, this.buildParamsObject()).subscribe(response => this.prepareNewDataAndMap(response));
    this.toggleClickEventOnMap(true);
  }

  /**
   * Highlights Object On Map
   */
  highlightObjectOnMap(highlightIds) {
    const prevLayers = highlightIds.prevLayerId ? this.getLayersObject(highlightIds.prevLayerId) : null;
    const newLayers = highlightIds.newLayerId ? this.getLayersObject(highlightIds.newLayerId) : null;

    this.removeSelectedClass();

    if (newLayers) {
      this.addLayerClass(newLayers);
    }

    if (highlightIds.onListTriggered && prevLayers) {
      this.closeLayerPopupIfExist(prevLayers.leafletObjectLayer);
    }

    if (highlightIds.onListTriggered && newLayers) {
      this.openLayerPopupIfExist(newLayers.leafletObjectLayer);
    }
  }

  private displayData() {
    this.detailsAboutObjectsOnMap = [];
    this.geoJsonsLayersIds = {};
    this.geoJsonsLayerGroup = this.leafletService.layerGroup();

    if (!this.aggregationsGrid) {
      this.displayGeoJson(this.linesAndPolygonsShapes);
      this.labels.next(this.detailsAboutObjectsOnMap);
      this.markSelectedListItem();
      return;
    }

    this.aggregationsGrid.map(aggreration => {
      if (aggreration.shapes.length < this.aggregationThreshold) {
        this.displayGeoJson(aggreration.shapes);
      } else {
        this.displayAggregationCircles(aggreration);
      }
    });
    this.labels.next(this.detailsAboutObjectsOnMap);
    this.markSelectedListItem();
  }

  private displayGeoJson(shapes: IGeoShape[]) {
    if (shapes.length > 0) {
      shapes.forEach((element: any) => {
        const geoJsonLayer = this.leafletService.geoJSON(element.shape, {
          pointToLayer: (feature, coordinates) => this.leafletService.marker(coordinates, this.markerProperties),
        });

        this.geoJsonsLayerGroup.addLayer(geoJsonLayer);
        const displayedObjectInfo = this.setObjectInfoForShape(element, this.geoJsonsLayerGroup.getLayerId(geoJsonLayer));

        this.bindEventsToDisplayedObject(geoJsonLayer, displayedObjectInfo);

        this.detailsAboutObjectsOnMap.push(displayedObjectInfo);
      });
      this.geoJsonsLayerGroup.addTo(this.map);
    }
  }

  private displayAggregationCircles(aggregation: IAggregation) {
    this.circleStyle.radius = this.calculateCircleRadius(aggregation.doc_count);
    const aggregationCircle = this.leafletService.circleMarker([aggregation.centroid[1], aggregation.centroid[0]], this.circleStyle);
    aggregationCircle.bindTooltip(`${aggregation.doc_count}`, {
      permanent: true,
      direction: 'center',
      opacity: 1,
      // zoomAnimation: true,
      className: 'clusterText',
    });
    this.clustersLayer.addLayer(aggregationCircle);
    this.clustersLayer.addTo(this.map);
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

  private clearMapView() {
    const allCircles = Array.from(this.document.querySelectorAll('.clusterCircle.leaflet-interactive'));
    allCircles.map(path => {
      path.parentNode.removeChild(path);
    });
    const allLabels = Array.from(this.document.querySelectorAll('.clusterText'));
    allLabels.map(path => {
      path.parentNode.removeChild(path);
    });
    const allMarkers = Array.from(this.document.querySelectorAll('.leaflet-marker-icon'));
    allMarkers.map(path => {
      path.parentNode.removeChild(path);
    });
    const allObjects = Array.from(this.document.querySelectorAll('.leaflet-interactive'));
    allObjects.filter(element => !element.classList.contains('distanceCircle')).map(element => element.parentNode.removeChild(element));
  }

  private setMapBoundsString(): string {
    const density = this.zoomToDensity();
    return `${this.mapBounds.getNorthWest().wrap().lng},${this.mapBounds.getNorthWest().wrap().lat},${
      this.mapBounds.getSouthEast().wrap().lng
    },${this.mapBounds.getSouthEast().wrap().lat},${density},${this.aggregationThreshold}`;
  }

  private zoomToDensity(): number {
    let density;
    switch (this.actualZoom) {
      case 3:
      case 4:
      case 5:
        density = 2;
        break;
      default:
        density = 3;
    }
    return density;
  }

  private markPointUserLocation() {
    if (this.userLocation) {
      this.userLocationMarker = this.leafletService
        .marker(this.userLocation.getCenterLocation(), this.userLocation.getUserLocationPointProperties())
        .addTo(this.map);
    }
  }

  private setObjectInfoForShape(shape: IGeoShape, layerId: number): IDisplayedObjectInfo {
    const uniqueIdBasedOnCoordinates = shape.shape.coordinates.join('').match(/[0-9]/g).join('');
    return {
      id: uniqueIdBasedOnCoordinates,
      layerId: layerId,
      label: shape.label,
    };
  }

  private buildParamsObject(): IMapFilterParams {
    return {
      boundaryBox: this.mapBoundsString,
      shapesCount: this.shapesCount,
      distance: this.userLocation ? this.userLocation.getRadiusStringInKm() : null,
      coordinates: this.userLocation ? this.userLocation.getCenterLocation() : null,
    };
  }

  private bindEventsToDisplayedObject(layer: Layer, element) {
    layer.on('click', event => {
      // @ts-ignore
      const id = event.layer._leaflet_id + 1;

      this.highlightObjectOnMap({
        prevLayerId: this.mapOptionsComponent.selectedListItem.layerId,
        newLayerId: id,
      });
      this.mapOptionsComponent.updateSelectedItem(id);
    });
    if (element.label) {
      layer.bindPopup(() => element.label);
    }
  }

  private markSelectedListItem() {
    const selectedId = this.mapOptionsComponent.checkIfItemIsSelected();
    if (selectedId.id) {
      this.highlightObjectOnMap({ prevLayerId: null, newLayerId: selectedId.id, onListTriggered: false });
    }
  }

  private getLayersObject(id: number) {
    if (id <= 0) {
      return;
    }

    // @ts-ignore
    const allMapLayers = this.map._layers;
    return {
      leafletObjectLayer: allMapLayers[id],
      leafletPathLayer: allMapLayers[id - 1]._path,
      leafletMarkerLayer: allMapLayers[id - 1]._icon,
    };
  }

  private closeLayerPopupIfExist(layer: Layer) {
    if (layer.getPopup()) {
      layer.closePopup();
    }
  }

  private openLayerPopupIfExist(layer: Layer) {
    if (layer.getPopup()) {
      layer.openPopup();
    }
  }

  private addLayerClass(layers: any) {
    if (layers.leafletMarkerLayer) {
      layers.leafletMarkerLayer.classList.add('bigPin');
    }
    if (layers.leafletPathLayer) {
      layers.leafletPathLayer.classList.add('lineSelected');
    }
  }

  private removeSelectedClass() {
    const bigPins = Array.from(this.document.querySelectorAll('.bigPin'));
    const selectedObjects = Array.from(this.document.querySelectorAll('.lineSelected'));
    bigPins.map(el => {
      el.classList.remove('bigPin');
    });
    selectedObjects.map(el => {
      el.classList.remove('lineSelected');
    });
  }
}
