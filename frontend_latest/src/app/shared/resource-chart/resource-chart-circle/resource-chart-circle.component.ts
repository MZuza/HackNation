import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from '../chart-helpers';

import { breakLongText, transparentColors } from '../chart-helpers';

@Component({
  selector: 'app-resource-chart-circle',
  templateUrl: './resource-chart-circle.component.html',
})
export class ResourceChartCircleComponent implements OnChanges {
  /**
   * Chart type - donought, pie, polarArea
   */
  @Input('type') chartType: ChartType;

  /**
   * Chart labels - one line text
   */
  @Input('labels') chartLabels: Label[];

  /**
   * Full labels - multiline tooltips
   */
  @Input('fullLabels') chartFullLabels: string[];

  /**
   * Chart data
   */
  @Input('datasets') chartData: ChartData[];

  /**
   * Bar background and border colors
   */
  chartColors: Color[];

  /**
   * Chart options.
   * Tooltip options - formatted multiline text
   */
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

      tooltip: {
        position: 'nearest', // auto position tooltip
        callbacks: {
          title: (context): string | void | string[]  => {
            let title = context[0]['label'];
            const datasetIndex = context[0].dataIndex;
            const fullDataLabels = this.chartFullLabels[datasetIndex];

            if (fullDataLabels) {
              const fullTitle = fullDataLabels;
              if (fullTitle) {
                title = breakLongText(fullTitle);
              }
            }
            return title;
          },
          label: (context): string | void | string[]  => {
            const datasetIndex = context.dataIndex;
            return context.dataset.data[datasetIndex].toLocaleString();
          },
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  /**
   * @ignore
   */
  constructor(private changeDetection: ChangeDetectorRef) {
  }

  /**
   * Updates labels and data
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['chartData'] || !changes['chartLabels']) {
      return;
    }

    const tempDatasets = [...changes['chartData'].currentValue];
    this.initChartColors(tempDatasets[0]['data'].length);
    this.chartData = [
      {
        datasets: [
          {
            data: tempDatasets[0]['data'],
            backgroundColor: this.chartColors?.length ? this.chartColors.map(c => c.backgroundColor) : [],
          }
        ]
      }
    ];

    if (changes['chartType']) {
      this.chartType = 'radar'; // correct, but not used - forces change detection to run
      this.changeDetection.detectChanges();
      this.chartType = changes['chartType'].currentValue;

    }
  }

  /**
   * Init fill colors based on length of data
   */
  private initChartColors(chartDataLength: number): void {
    const colorList: string[] = [...transparentColors];

    if (chartDataLength) {
      colorList[chartDataLength - 1] = transparentColors[transparentColors.length - 1];
    }

    this.chartColors = colorList.map(c => {
      return {
        backgroundColor: c,
        borderColor: '#fff',
      };
    });
  }
}
