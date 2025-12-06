import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { IChartResponse } from '@app/services/models/chart';

@Component({
  selector: 'app-resource-chart-selector',
  templateUrl: './resource-chart-selector.component.html',
})
export class ResourceChartSelectorComponent implements OnChanges {
  /**
   * Saved charts - all the charts related to the resource
   */
  @Input() savedCharts: IChartResponse[];

  /**
   * Current chart - default or selected by user
   */
  @Input() selectedChartIndex = 0;

  /**
   * Is view availble only for the editor role
   */
  @Input() isEditorPreview: boolean;

  /**
   * Is user logged in
   */
  @Input() isUserLoggedIn: boolean;

  /**
   * Is chart creation blocked for user (not editor)
   */
  @Input() isChartCreationBlockedForUser = false;

  /**
   * Fires an avent when a chart is selected
   */
  @Output() chartSelected = new EventEmitter<number>();

  /**
   * Fires an avent when a chart is removed
   */
  @Output() chartRemoved = new EventEmitter<string>();

  /**
   * Fires an avent when a chart is going to be created
   */
  @Output() newChart = new EventEmitter<void>();

  /**
   * Determines whether is any chart defined by a user on the list
   */
  isUserChartDefined: boolean;

  /**
   * Determines whether is any chart defined by an editor on the list
   */
  isEditorChartDefined: boolean;

  /**
   * on changes
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['savedCharts'] && changes['savedCharts'].currentValue) {
      const charts = changes['savedCharts'].currentValue;

      if (!this.isEditorPreview && charts instanceof Array) {
        this.isUserChartDefined = charts.some(chart => chart.attributes.is_default === false);
        this.isEditorChartDefined = charts.some(chart => chart.attributes.is_default === true);
      }
    }
  }

  /**
   * Activates specified chart
   * @param chartIndex
   */
  onChartClick(chartIndex: number) {
    this.selectedChartIndex = chartIndex;
    this.chartSelected.emit(chartIndex);
  }

  /**
   * Removes specified chart
   * @param {number} chartIndex
   */
  onRemoveChart(chartId: string) {
    this.chartRemoved.emit(chartId);
  }

  /**
   * Event when new chart is going to be created
   */
  onAddNewChart() {
    this.newChart.emit();
  }
}
