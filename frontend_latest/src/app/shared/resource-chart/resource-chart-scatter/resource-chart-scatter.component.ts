import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Color, Label } from '../chart-helpers';
import { backgroundAndBorderColors } from '../chart-helpers';

/**
 * Resource Chart Scatter Component
 */
@Component({
  selector: 'app-resource-chart-scatter',
  templateUrl: './resource-chart-scatter.component.html',
})
export class ResourceChartScatterComponent implements OnChanges {
  /**
   * Chart labels
   */
  @Input('labels') chartLabels: Label[];

  /**
   * Chart data
   */
  @Input('datasets') chartData: ChartDataset[];

  /**
   * Background and border colors
   */
  chartColors: Color[];

  /**
   * Chart options
   */
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  /**
   * Updates and transforms data into 2-dimensional structure
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['chartData'] || !changes['chartLabels']) {
      return;
    }
    this.chartColors = backgroundAndBorderColors;

    const labels = [...changes['chartLabels'].currentValue];
    const datasets = [...changes['chartData'].currentValue];

    const chartData: ChartDataset[] = datasets.map((dataset, datasetIndex) => {
      const dataRow = dataset['data'].map((item, itemIndex) => {
        return {
          x: labels[itemIndex],
          y: item,
        };
      });

      return {
        data: dataRow,
        label: dataset['label'],
        pointRadius: datasetIndex * 2 + 5,
        borderColor: this.chartColors[datasetIndex].borderColor,
        backgroundColor: this.chartColors[datasetIndex].backgroundColor,
        pointBackgroundColor: this.chartColors[datasetIndex].backgroundColor,
      };
    });

    // this.chartData = [...chartData];
    this.chartData = [...chartData];
  }



}
