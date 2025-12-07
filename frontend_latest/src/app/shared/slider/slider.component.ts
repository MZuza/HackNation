import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    standalone: true,
    imports: [NgStyle, TranslatePipe],
})
export class SliderComponent implements OnInit {
  @Input() savedRadius;
  @Output() newRadiusValue = new EventEmitter();

  radius = 0;
  sliderLabel;
  sliderValueMapping = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    if (this.savedRadius) {
      this.radius = this.sliderValueMapping.findIndex(el => el === this.savedRadius);
    }
    this.sliderLabel = this.document.getElementById('sliderLabel');
    this.newRadiusValue.emit(this.sliderValueMapping[this.radius]);
  }

  onRadiusChange(event): void {
    this.radius = event.target.value;
    this.newRadiusValue.emit(this.sliderValueMapping[this.radius]);
    this.sliderLabel.style.left = (280 / this.sliderValueMapping.length) * this.radius - 10 + 'px';
  }
}
