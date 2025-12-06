import { AsyncPipe, DOCUMENT, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SliderComponent } from '../../slider/slider.component';

import { IDisplayedObjectInfo, INominatimGeocodeResponse } from '@app/services/models/map';
import { NominatimGeocodeService } from '@app/services/nominatim-geocode.service';

@Component({
    selector: 'app-map-options',
    templateUrl: './map-options.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        SliderComponent,
        NgClass,
        NgFor,
        AsyncPipe,
        TranslatePipe,
    ],
})
export class MapOptionsComponent implements OnChanges, OnDestroy {
  @Output() displayPointsInRange = new EventEmitter();
  @Output() allowCustomLocalization = new EventEmitter();
  @Output() saveUserSettings = new EventEmitter();
  @Output() clearForm = new EventEmitter();
  @Output() selectLabel = new EventEmitter();

  @Input() labels;
  @Input() userSettings;

  /**
   * Slider settings
   */
  actualRange: number;

  address: string;
  hasFoundAddress = new BehaviorSubject(true);
  isAddressFormVisible = false;
  inputError = false;

  labelsSubscription: Subscription;
  labelsList = [];

  selectedListItem = this.resetSelectedListItem();

  MIN_ADDRESS_LENGTH = 3;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: NominatimGeocodeService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnChanges() {
    this.setActualRangeFromSavedSettings();

    this.labelsSubscription = this.labels.subscribe(res => {
      if (res) {
        this.labelsList = Array.from(res);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.labelsSubscription.unsubscribe();
  }

  getActualDistance(): number {
    return this.actualRange;
  }

  toggleCustomLocalization() {
    this.isAddressFormVisible = !this.isAddressFormVisible;
    this.allowCustomLocalization.emit(this.isAddressFormVisible);
    this.hasFoundAddress.next(true);
    if (!this.isAddressFormVisible) {
      this.displayPointsInRange.emit(null);
    }
  }

  onSlidersPositionChange(event) {
    this.actualRange = event;
  }

  onSubmit() {
    const address = this.document.getElementById('searchAddressInput') as HTMLInputElement;
    if (!this.actualRange || !address || address.value.length < this.MIN_ADDRESS_LENGTH) {
      this.inputError = true;
      return;
    }
    this.inputError = false;
    this.address = address.value;
    this.mapService.searchAddress(address.value).subscribe(
      response => {
        if (response.features.length === 0) {
          this.hasFoundAddress.next(false);
        } else {
          this.hasFoundAddress.next(true);
          this.displayPointsInRange.emit({
            distance: this.actualRange,
            center: response.features[0].geometry.coordinates,
          });
          this.userSettings = {
            actualRange: this.actualRange,
            address: this.address,
          };

          this.saveUserSettings.emit(this.userSettings);
        }
      },
      err => {
        console.log('ERROR: ', err);
      },
    );
  }

  updateSelectedItem(id: number) {
    if (id === this.selectedListItem.layerId) {
      this.markObject(this.selectedListItem);
      return;
    } else {
      const element = this.labelsList.filter(el => el.layerId === id);
      this.selectedListItem = element.length ? element[0] : this.resetSelectedListItem();
      this.changeDetectorRef.detectChanges();
    }
  }

  onUserLocationClick(coordinates) {
    if (!this.isAddressFormVisible) {
      return;
    }
    this.mapService.geocodePoint(coordinates).subscribe(
      (location: INominatimGeocodeResponse) => {
        this.document.querySelector<HTMLInputElement>('#searchAddressInput').value = location.display_name;
      },
      err => {
        console.log('ERROR: ', err);
      },
    );
  }

  private setActualRangeFromSavedSettings() {
    if (this.userSettings && this.userSettings.actualRange) {
      this.actualRange = this.userSettings.actualRange;
    }
  }

  markObject(item: IDisplayedObjectInfo) {
    const prevItem = this.selectedListItem;
    this.selectedListItem = this.selectedListItem.id === item.id ? this.resetSelectedListItem() : item;
    const updatedPrevObj = this.labelsList.filter(el => el.id === prevItem.id);
    const updatedPrevLayerId = updatedPrevObj.length ? updatedPrevObj[0].layerId : null;
    this.selectLabel.emit({ prevLayerId: updatedPrevLayerId, newLayerId: this.selectedListItem.layerId, onListTriggered: true });
    this.changeDetectorRef.detectChanges();
  }

  resetSelectedListItem() {
    return {
      id: null,
      layerId: null,
      label: null,
    };
  }

  checkIfItemIsSelected() {
    if (this.selectedListItem.id) {
      const filteredList = this.labelsList.filter(el => this.selectedListItem.id === el.id);
      return filteredList.length ? { id: filteredList[0].layerId } : { id: null };
    }
    return { id: null };
  }

  clearAddress() {
    this.document.querySelector<HTMLInputElement>('#searchAddressInput').value = null;
    this.clearForm.emit();
    this.resetErrorFields();
  }

  resetErrorFields() {
    this.inputError = false;
    this.hasFoundAddress.next(true);
  }
}
