import {Circle, LatLngBounds, LatLngExpression} from 'leaflet';

import { LeafletService } from '@app/services/leflet.service';

/**
 * This class stores user location data.
 */
export class UserLocationData {

    private readonly centerCircleX;
    private readonly centerCircleY;
    private readonly radiusKilometers;
    private readonly radiusMeters;

    private circleMarker: Circle;

    private pointMarkerProperties = {
        icon: this.leafletService.icon({
            iconSize: [30, 70],
            iconAnchor: [15, 50],
            iconUrl: 'assets/icomoon/SVG/pin-red.svg',
        }),
        className: 'redMarker',
        keyboard: false
    };

    private METERS = 1000;
    private SCALE = 100;

    /**
     * constructor.
     *
     * @param data position and distance data from the map
     * @param leafletService
     */
    constructor(data: any, private readonly leafletService: LeafletService) {
        this.centerCircleX = data.center[1];
        this.centerCircleY = data.center[0];
        this.radiusKilometers = data.distance;
        this.radiusMeters = data.distance * this.METERS;
        this.leafletService = leafletService;
    }

    /**
     *  Get center location like LatLngExpression.
     */
    public getCenterLocation(): LatLngExpression {
        return [this.centerCircleX, this.centerCircleY];
    }

    /**
     *  Get center location like LatLngExpression.
     */
    public getRadiusStringInKm(): string {
        return this.radiusKilometers + 'km';
    }

    /**
     * Get bounds.
     */
    public getBounds(): LatLngBounds {
        return this.calculateTwoPointOnTheCircle();
    }

    private calculateTwoPointOnTheCircle() {
        const scaleDistance = this.radiusKilometers / this.SCALE;
        const pointA_x = this.centerCircleX + scaleDistance;
        const pointB_x = this.centerCircleX - scaleDistance;
        return  this.leafletService.latLngBounds([pointA_x, this.centerCircleY], [pointB_x, this.centerCircleY]);
    }

    /**
     * Create circle marker from user location.
     */
    public circle(): Circle {
        this.circleMarker = this.leafletService.circle(this.getCenterLocation(), {radius: this.radiusMeters, className: 'distanceCircle'});
        return this.circleMarker;
    }

    /**
     * get circle Marker.
     */
    public getCircleMarker(): Circle {
        return this.circleMarker;
    }

    /**
     * get user location point properties.
     */
    public getUserLocationPointProperties() {
        return this.pointMarkerProperties;
    }

}
