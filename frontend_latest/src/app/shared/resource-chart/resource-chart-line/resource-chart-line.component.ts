import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { backgroundAndBorderColors, breakLongText, Color, Label } from '../chart-helpers';

/**
 * Resource Chart Line Component
 */
@Component({
  selector: 'app-resource-chart-line',
  templateUrl: './resource-chart-line.component.html',
})
export class ResourceChartLineComponent implements OnChanges {
  /**
   * Chart labels
   */
  @Input('labels') chartLabels: Label[];

  /**
   * Chart data
   */
  @Input('datasets') chartData: ChartData[];

  /**
   * Background and border colors
   */
  chartColors: Color[];

  /**
   * Data for line chart
   */
  public lineChartData: ChartConfiguration<'line'>['data'];

  /**
   * Chart options.
   * Tooltip options - formatted multiline text
   */
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        position: 'nearest',
        callbacks: {
          title: (context) => {
            let title = context[0]['label'];
            const datasetIndex = context[0].dataIndex;
            const fullDataLabels = (this.chartData as any)[0]['fullDataLabels'][datasetIndex];

            if (fullDataLabels) {
              const fullTitle = fullDataLabels;

              if (fullTitle) {
                title = breakLongText(fullTitle);
              }
            }

            return title;
          },
          label: (context) => {
            const datasetIndex = context.dataIndex;
            return context.dataset.data[datasetIndex].toLocaleString();
          },
        },
      },
    },
  };

  /**
   * Initializes chart colors
   */
  ngOnChanges(): void {
    this.chartColors = backgroundAndBorderColors;

    const datasets: ChartConfiguration<'line'>['data']['datasets'] = [];

    this.chartData.forEach((data, index) => {
      datasets.push({
        data: (data as any).data,
        label: (data as any).label,
        fill: true,
        tension: 0.5,
        borderColor: this.chartColors[index].borderColor,
        backgroundColor: this.chartColors[index].backgroundColor,
        pointBackgroundColor: this.chartColors[index].backgroundColor,
      });
    });

    this.lineChartData = {
      labels: this.chartLabels,
      datasets: datasets,
    };
  }
}
