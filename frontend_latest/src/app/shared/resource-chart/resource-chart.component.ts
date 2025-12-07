import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { LocalStorageService } from 'ngx-localstorage';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRouteHelper } from '../helpers/activated-route.helper';
import { ObjectHelper } from '../helpers/object.helper';
import { ResourceHelper } from '../helpers/resource.helper';

import { toggleVertically } from '@app/animations';
import { DatasetService } from '@app/services/dataset.service';
import { IChartBlueprint, IChartResponse } from '@app/services/models/chart';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { TruncateTextPipe } from '@app/shared/pipes/truncate-text.pipe';
import { DefaultListViewParams } from '@app/shared/resource-table/DefaultListViewParams';
import { ResourceTableColumn } from '@app/shared/resource-table/ResourceTableColumn';

/**
 * Resource Chart Component
 */
@Component({
  selector: 'app-resource-chart',
  templateUrl: './resource-chart.component.html',
  animations: [toggleVertically],
})
export class ResourceChartComponent implements OnInit, OnDestroy {
  /**
   * Resource filter subscription
   */
  resourceFilterSubscription: Subscription;

  /**
   * Incoming resource ID
   */
  @Input() resourceId: string;

  /**
   * Table columns
   */
  columns: ResourceTableColumn[];

  /**
   * Items - table rows with data
   */
  items: any[];

  /**
   * Total count of all rows stored in the database
   */
  count: number;

  /**
   * Limit of data records returned by API
   */
  countLimit = 10000;

  /**
   * Basic params of resource chart component
   */
  basicParams: DefaultListViewParams = {
    page: 1,
    per_page: 10,
    q: '',
    sort: '',
  };

  /**
   * Page settings based on basic params and user interactions
   */
  params: DefaultListViewParams;

  /**
   * Items per page for 2-axis charts
   */
  itemsPerPage: number[] = [5, 10, 15, 20, 30, 40, 50];

  /**
   * Items per page for circular charts
   */
  itemsPerPageCircular: number[] = this.itemsPerPage.slice(0, 4);

  /**
   * Available chart types
   */
  charts: ChartType[] = ['line', 'bar', 'scatter', 'pie', 'doughnut', 'polarArea'];

  /**
   * Circular charts types
   */
  circularCharts: ChartType[] = this.charts.slice(3);

  /**
   * Determines whether at least one numeric column exists
   */
  numericColumnsExist: boolean;

  /**
   * Aggregated data for circular charts
   */
  chartAggregatedColumn: Object;

  /**
   * Datasets displayed in a chart
   */
  chartDatasets: any[] = [];

  /**
   * Datasets displayed in a chart table
   */
  chartDatasetsRepr: any[] = [];

  /**
   * Chart labels
   */
  chartLabels: string[] = [];

  /**
   * Full chart labels (not truncated)
   */
  fullLabels: string[] = [];

  /**
   * Determines whether shortened labels exist
   */
  shortenedLabelsExist: boolean;

  /**
   * X axis label of 2-axis chart
   */
  xAxisLabel: string;

  /**
   * Determines whether chart generation form is visible
   */
  isChartFormVisible: boolean;

  /**
   * Currently displayed chart type
   */
  currentChartType: ChartType;

  /**
   * Chart blueprint
   */
  chartBlueprint: IChartBlueprint;

  /**
   * Determines whether chart is circular
   */
  isCircularChart: boolean;

  /**
   * Local storage id to store chart in local memory for non logged users
   */
  localStorageId: string;

  /**
   * Determines whether chart is stored in local storage
   */
  isInStorage: boolean;

  /**
   * Determines whether chart is in editor preview mode
   */
  isEditorPreview = false;

  /**
   * Determines whether chart is locally generated and not stored or saved yet
   */
  isChartPreview = false;

  /**
   * Id of stored or saved chart
   */
  chartId: string;

  /**
   * Determines whether chart is saved
   */
  isChartSaved: boolean;

  /**
   * Determines whether chart is deleted
   */
  isChartDeleted: boolean;

  /**
   * Determines whether user is logged in
   */
  isUserLoggedIn: boolean;

  /**
   * Determines whether logged in user has access to editor preview
   */
  hasAccessToEditorPreview: boolean;

  /**
   * Determines whether current chart is default
   */
  isCurrentChartDefault: boolean;

  /**
   * Chart status translation key
   */
  chartStatusTranslationKey: string;

  /**
   * Saved charts - returned from API
   */
  savedCharts: IChartResponse[];

  /**
   * Determines whether named chart mode is on - chart name is mandatory
   */
  isNamedChartMode = true;

  /**
   * Selected chart index - related to chart selector
   */
  selectedChartIndex = -1;

  /**
   * Determines whether form toggle is active
   */
  isFormToggleActive = true;

  /**
   * Determines whether chart preview is available
   */
  isChartPreviewAvailable = true;

  /**
   * Determines whether chart is creation blocked
   */
  isChartCreationBlocked = false;

  /**
   * @ignore
   */
  constructor(
    private datasetService: DatasetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private userStateService: UserStateService,
  ) {}

  /**
   * Determines whether chart is defined on the server or locally.
   * Initializes and updates list of items (chart data) on query params or seach query and filters change.
   */
  ngOnInit() {
    this.checkEditorPreview();
    this.isChartCreationBlockedForUser();

    if (!this.resourceId) {
      this.resourceId = ActivatedRouteHelper.getParamFromCurrentOrParentRoute(this.activatedRoute, 'resourceId');
    }

    this.localStorageId = `${this.resourceId}_chart`;
    this.isUserLoggedIn = this.userService.isLoggedIn();

    const filter$ = this.datasetService.resourceFilterChanged$.pipe(distinctUntilChanged());

    this.resourceFilterSubscription = filter$.subscribe(filterQuery => {
      this.updateParams({ page: 1, q: filterQuery });
    });

    this.activatedRoute.queryParamMap
      .pipe(
        withLatestFrom(filter$),
        switchMap(([qParamMap, filterQuery]) => {
          this.params = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || '',
          };

          if (qParamMap.get('sum')) {
            this.params['sum'] = qParamMap.get('sum');
          }

          return combineLatest([
            this.datasetService.getResourceData(this.resourceId, { ...this.params, q: filterQuery }),
            this.datasetService.getResourceChartById(this.resourceId),
          ]);
        }),
      )
      .subscribe(([tableDataResponse, chartResponse]) => {
        if (chartResponse['meta']['named_charts']) {
          this.isNamedChartMode = chartResponse['meta']['named_charts'];
        }

        // filter out user defined charts in editor preview
        this.savedCharts = this.isEditorPreview
          ? chartResponse['data'].filter(chart => chart.attributes.is_default)
          : chartResponse['data'];

        if (this.isNamedChartMode && !this.isUserLoggedIn) {
          this.checkStorage();
        }

        const tableMeta = tableDataResponse['meta'];

        if (!tableMeta['headers_map']) {
          return;
        }

        if (!tableDataResponse['data'].length) {
          this.items = null;
          this.count = this.params && !!this.params.q ? 0 : null;
          return;
        }

        this.items = tableDataResponse['data'].map(item => item['attributes']);
        this.count = tableMeta['count'];

        const columns = ResourceHelper.getTableColumns(tableDataResponse);
        this.columns = [...columns.sort((a, b) => (a.description > b.description ? 1 : -1))];
        this.numericColumnsExist = columns.some(item => item.type === 'integer' || item.type === 'number');

        // sum for circular charts
        if (tableMeta['aggregations'] && tableMeta['aggregations']['sum']) {
          const sum = tableMeta['aggregations']['sum'][0];
          this.chartAggregatedColumn = sum;
        }

        if (this.isChartPreview) {
          this.createChartFromBlueprint();
        } else {
          if (!this.isNamedChartMode) {
            this.loadChart(chartResponse);
          } else {
            this.selectedChartIndex = 0;
            this.onChartSelected(0);
          }
        }

        this.updateStatus();
      });
  }

  /**
   * Determines whether logged in user has access to editor preview
   */
  checkEditorPreview() {
    this.isEditorPreview = ActivatedRouteHelper.getRouteData(this.activatedRoute, 'editorPreview');

    if (this.isEditorPreview) {
      if (this.userService.isAdmin()) {
        this.hasAccessToEditorPreview = true;
        return;
      }

      if (this.userService.isEditor()) {
        this.userStateService.getCurrentUser().subscribe(currentUser => {
          const resourceInstitutionId = this.getResourceInstitutionId();
          const userInstitutionIds = ObjectHelper.getNested(currentUser, ['institutions']);

          if (userInstitutionIds && resourceInstitutionId) {
            this.hasAccessToEditorPreview = userInstitutionIds.some(item => item.id === resourceInstitutionId);
          }
        });
      }
    }
  }

  /**
   * Gets resource institution id
   * @returns {string}
   */
  getResourceInstitutionId(): string {
    const resource = ActivatedRouteHelper.getRouteData(this.activatedRoute, 'post');
    return ObjectHelper.getNested(resource, ['relationships', 'institution', 'data', 'id']);
  }

  /**
   * Loads appropriate chart based on API response and other conditions
   * @param chartResponse
   */
  loadChart(chartResponse: Object[]) {
    let userChart: IChartBlueprint;
    let userChartId: string;
    let defaultChart: IChartBlueprint;
    let defaultChartId: string;
    let chartBlueprint: IChartBlueprint;
    this.checkStorage();

    if (chartResponse && chartResponse.length) {
      chartResponse.forEach(chart => {
        if (!chart['attributes']) {
          return;
        }

        if (chart['attributes']['is_default']) {
          defaultChart = chart['attributes']['chart'];
          defaultChartId = chart['id'];
        }

        if (this.isUserLoggedIn && !chart['attributes']['is_default']) {
          userChart = chart['attributes']['chart'];
          userChartId = chart['id'];
        }
      });

      if (this.isNamedChartMode && chartResponse.length === 1) {
        this.selectedChartIndex = this.savedCharts.findIndex(chart => chart.id === chartResponse[0]['id']);
      }
    }

    // logged in
    if (this.isUserLoggedIn) {
      // preview mode
      if (this.isEditorPreview) {
        if (defaultChart) {
          chartBlueprint = defaultChart;
          this.chartId = defaultChartId;
          this.isCurrentChartDefault = true;
        }
      } else {
        if (userChart) {
          chartBlueprint = userChart;
          this.chartId = userChartId;
          this.isCurrentChartDefault = false;
        } else if (defaultChart) {
          chartBlueprint = defaultChart;
          this.isCurrentChartDefault = true;
        }
      }
      // not logged in
    } else if (!this.isUserLoggedIn) {
      if (this.isInStorage) {
        chartBlueprint = this.getFromStorage();
        this.chartId = this.localStorageId;
        this.isCurrentChartDefault = false;
      } else {
        chartBlueprint = defaultChart;
        this.isCurrentChartDefault = true;
      }
    }

    if (chartBlueprint) {
      this.onChartBlueprintCreated(chartBlueprint, false);
    } else {
      this.isChartFormVisible = true;
    }
  }

  /**
   * Updates query params on every user interaction
   * @param {Object} params
   */
  updateParams(params: Object) {
    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.params = {
      ...this.params,
      ...params,
    };

    this.router.navigate([], { queryParams: this.params, replaceUrl: true });
  }

  /**
   * Updates query params and sets charts variables needed to build a chart
   * @param {Object} chartBlueprint
   * @param {boolean} [isPreview]
   */
  onChartBlueprintCreated(chartBlueprint: IChartBlueprint, isPreview: boolean = true) {
    this.isChartPreviewAvailable = true;
    this.chartBlueprint = chartBlueprint;
    this.isChartPreview = isPreview;

    const isCircularChart = this.circularCharts.indexOf(<ChartType>this.chartBlueprint['chart_type']) !== -1;
    const updatedParams = {};

    if (isCircularChart) {
      // deafult sort as Z-A
      if (this.params['sort'] !== `-${this.chartBlueprint['datasets']}`) {
        updatedParams['sort'] = `-${this.chartBlueprint['datasets']}`;
      }

      // default per_page value = 15
      if (this.params['per_page'] !== this.itemsPerPage[2]) {
        updatedParams['per_page'] = this.itemsPerPage[2];
      }

      // additional aggregations
      if (this.params['sum'] !== this.chartBlueprint['datasets'].join(',')) {
        updatedParams['sum'] = this.chartBlueprint['datasets'].join(',');
      }
    } else {
      if (!this.chartBlueprint['sort'] && (!('sort' in this.params) || !this.params['sort'])) {
        this.params['sort'] = '';
      } else if (this.chartBlueprint['sort'] !== this.params['sort']) {
        updatedParams['sort'] = this.chartBlueprint['sort'] ? this.chartBlueprint['sort'] : '';
      }
    }

    if (Object.keys(updatedParams).length) {
      this.updateParams(updatedParams);
    } else {
      this.createChartFromBlueprint();
    }
  }

  /**
   * Creates chart from blueprint
   */
  createChartFromBlueprint() {
    const labelColumn = this.getColumnByName(this.chartBlueprint['labels']);
    const datasets = this.chartBlueprint['datasets'].map(columnName => this.getColumnByName(columnName));

    // clear values
    this.chartLabels = [];
    this.chartDatasets = [];
    this.chartDatasetsRepr = [];

    this.currentChartType = this.chartBlueprint['chart_type'] as ChartType;
    this.isCircularChart = this.circularCharts.indexOf(this.currentChartType) !== -1;
    this.xAxisLabel = labelColumn.description;

    this.prepareChartLabels(labelColumn);
    datasets.map((column: ResourceTableColumn) => this.prepareChartData(column));

    this.appendAggregatedData();
    this.updateStatus();
  }

  /**
   * Appends aggregated data to chart data for circular chart
   */
  appendAggregatedData() {
    if (!this.isCircularChart || !this.chartAggregatedColumn) {
      return;
    }

    // only one (first) for circular charts
    const firstDatasetData = this.chartDatasets[0]['data'];
    if (firstDatasetData.length < this.params['per_page']) {
      return;
    }

    const datasetTotal = firstDatasetData.reduce((a, b) => Number(a) + Number(b), 0);
    firstDatasetData.push(this.chartAggregatedColumn['value'] - datasetTotal);

    this.chartLabels.push('Pozostałe (' + (this.count - this.params['per_page']) + ')');
  }

  /**
   * Gets column by name
   * @param {string} columnName
   * @returns {ResourceTableColumn}
   */
  getColumnByName(columnName: string): ResourceTableColumn {
    return this.columns.find(item => item['name'] === columnName);
  }

  /**
   * Prepares chart data
   * @param {ResourceTableColumn} column
   */
  prepareChartData(column: ResourceTableColumn) {
    const columnData = this.getColumnsByProperty(column, 'name', 'val');
    const columnLabel = this.getColumnsByProperty(column, 'name', 'repr');

    const newDataset = { label: column.description, data: columnData };
    const newDatasetRepr = { label: column.description, data: columnLabel };

    if (this.fullLabels) {
      newDataset['fullDataLabels'] = this.fullLabels;
      newDatasetRepr['fullDataLabels'] = this.fullLabels;
    }

    if (this.chartDatasets && this.chartDatasets.length) {
      const isDataExists = this.chartDatasets.findIndex(item => item.label === column.description);
      if (isDataExists === -1) {
        this.chartDatasets.push(newDataset);
        this.chartDatasetsRepr.push(newDatasetRepr);
      }
    } else {
      this.chartDatasets.push(newDataset);
      this.chartDatasetsRepr.push(newDatasetRepr);
    }
  }

  /**
   * Prepares chart labels
   * @param {ResourceTableColumn} column
   */
  prepareChartLabels(column: ResourceTableColumn) {
    const labels = this.getColumnsByProperty(column, 'name', 'repr');
    this.fullLabels = [];

    if (column.type === 'string') {
      this.shortenedLabelsExist = false;

      const shortenedLabels = this.items.reduce((temp: string[], item: string) => {
        const currentName = ResourceHelper.getResourceColumnData(item[column.name], 'repr') || ('' as string);
        const shortenedName = new TruncateTextPipe().transform(currentName, 25);

        if (!this.shortenedLabelsExist) {
          if (currentName && currentName.length > 25) {
            this.shortenedLabelsExist = true;
          }
        }

        temp.push(shortenedName);
        return temp;
      }, []);

      this.chartLabels = shortenedLabels;
      this.fullLabels = labels;
    } else {
      this.chartLabels = labels;
    }
  }

  /**
   * Gets columns by property
   * @param {ResourceTableColumn} column
   * @param {string} property
   * @param key
   * @returns {Array<any>}
   */
  getColumnsByProperty(column: ResourceTableColumn, property: string, key: 'val' | 'repr'): any[] {
    return this.items.reduce(function (temp, item) {
      temp.push(ResourceHelper.getResourceColumnData(item[column[property]], key));
      return temp;
    }, []);
  }

  /**
   * Updates chart status
   */
  updateStatus() {
    if (!this.chartBlueprint) {
      this.chartStatusTranslationKey = 'Chart.StatusNoChart';
    } else {
      if (this.isChartPreview) {
        this.chartStatusTranslationKey = 'Chart.Preview';
      } else {
        if (this.isCurrentChartDefault) {
          this.chartStatusTranslationKey = 'Chart.StatusDefault';
        } else {
          if (this.isUserLoggedIn) {
            this.chartStatusTranslationKey = 'Chart.StatusUserLoggedIn';
          } else {
            this.chartStatusTranslationKey = 'Chart.StatusUserNotLoggedIn';
          }
        }
      }
    }
  }

  /**
   * Saves chart blueprint
   */
  saveChart() {
    this.isUserLoggedIn ? this.saveForUser() : this.saveInStorage();
  }

  /**
   * Saves chart blueprint in a local storage
   */
  saveInStorage() {
    this.localStorage.set(this.localStorageId, JSON.stringify(this.chartBlueprint));
    this.checkStorage();
    this.selectedChartIndex = this.savedCharts.length - 1;
    this.chartId = this.localStorageId;
    this.isChartPreview = false;
    this.isCurrentChartDefault = false;
    this.changeAfterTime('isChartSaved');
    this.updateStatus();
  }

  /**
   * Saves chart blueprint for logged in user or as a default when in editor preview mode
   */
  saveForUser() {
    if (this.isNamedChartMode) {
      if (this.chartId) {
        this.datasetService
          .updateResourceChart(this.resourceId, this.chartId, this.chartBlueprint, this.isEditorPreview, this.isNamedChartMode)
          .subscribe(saved => {
            this.chartId = saved['data']['id'];
            this.isChartPreview = false;
            this.changeAfterTime('isChartSaved');
            this.updateStatus();

            this.savedCharts[this.selectedChartIndex] = saved.data;
            this.isChartFormVisible = false;
          });
      } else {
        this.datasetService
          .saveResourceChart(this.resourceId, this.chartBlueprint, this.isEditorPreview, this.isNamedChartMode)
          .subscribe(saved => {
            this.chartId = saved['data']['id'];
            this.isChartPreview = false;
            this.isCurrentChartDefault = this.isEditorPreview;
            this.changeAfterTime('isChartSaved');
            this.updateStatus();

            let updatedSavedChartes = [];

            if (this.isNamedChartMode) {
              updatedSavedChartes = [...this.savedCharts, saved.data];

              this.savedCharts = updatedSavedChartes;
              this.selectedChartIndex = this.savedCharts.length - 1;
              this.isChartFormVisible = false;
            }
          });
      }
    } else {
      this.datasetService
        .saveResourceChart(this.resourceId, this.chartBlueprint, this.isEditorPreview, this.isNamedChartMode)
        .subscribe(saved => {
          this.chartId = saved['data']['id'];
          this.isChartPreview = false;
          this.isCurrentChartDefault = this.isEditorPreview;
          this.changeAfterTime('isChartSaved');
          this.updateStatus();

          let updatedSavedChartes = [];

          if (this.isNamedChartMode) {
            updatedSavedChartes = [...this.savedCharts, saved.data];

            this.savedCharts = updatedSavedChartes;
            this.selectedChartIndex = this.savedCharts.length - 1;
            this.isChartFormVisible = false;
          }
        });
    }
  }

  /**
   * Loads chart from local storage and updates the form
   */
  getFromStorage() {
    if (!this.localStorage.get(this.localStorageId)) {
      return;
    }

    return JSON.parse(this.localStorage.get(this.localStorageId));
  }

  /**
   * Checks whether chart blueprint is in the local storage
   */
  checkStorage() {
    this.isInStorage = !!this.localStorage.get(this.localStorageId);
    this.checkStorageAndAttachChartIfExists();
  }

  /**
   * Deletes chart blueprint
   */
  deleteChart(chartId?: string) {
    this.isUserLoggedIn ? this.deleteForUser(chartId) : this.deleteFromStorage();
  }

  /**
   * Removes locally stored chart blueprint
   */
  deleteFromStorage() {
    this.localStorage.remove(this.localStorageId);
    this.checkStorage();
    this.chartId = '';
    this.isChartPreview = true;
    this.changeAfterTime('isChartDeleted');
    this.updateStatus();

    if (this.isNamedChartMode) {
      this.selectedChartIndex = this.savedCharts.length ? 0 : -1;
      this.onChartSelected(0);
    }
  }

  /**
   * Removes permanently saved chart blueprint from API
   * Works for logged in user or as a default when in editor preview mode
   */
  deleteForUser(chartId?: string) {
    this.datasetService.deleteResourceChart(chartId || this.chartId).subscribe(() => {
      this.chartId = null;
      this.isChartPreview = true;
      this.isCurrentChartDefault = this.isEditorPreview;
      this.changeAfterTime('isChartDeleted');
      this.updateStatus();

      if (this.isNamedChartMode) {
        this.savedCharts = this.savedCharts.filter(chart => chart.id !== (chartId || this.chartId));

        if (!this.savedCharts.length) {
          this.onAddNewChart();
        }
      }
    });
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy(): void {
    this.resourceFilterSubscription && this.resourceFilterSubscription.unsubscribe();
  }

  /**
   * Sets component property to true and then to false, after specified time
   * @param {string} property
   * @param {number} [time]
   */
  private changeAfterTime(property: string, milliseconds: number = 3000) {
    this[property] = true;

    setTimeout(() => {
      this[property] = false;
    }, milliseconds);
  }

  /**
   * Event when chart is selected on the chart selector
   * @param {number} selectedIndex
   */
  onChartSelected(selectedIndex: number) {
    if (!this.savedCharts.length) {
      if (!this.isEditorPreview && this.isChartCreationBlocked) {
        return;
      }

      this.onAddNewChart();
      return;
    }

    this.isChartFormVisible = false;
    const chart = this.savedCharts[selectedIndex];

    this.selectedChartIndex = selectedIndex;
    this.chartId = chart.id;

    this.onChartBlueprintCreated(chart.attributes.chart);
    this.setFormToggleVisibility();
  }

  /**
   * Event when new chart is going to be created
   */
  onAddNewChart() {
    this.selectedChartIndex = -1;
    this.chartId = null;
    this.chartBlueprint = null;
    this.isChartPreviewAvailable = false;
    this.isChartFormVisible = false;

    setTimeout(() => {
      this.isChartFormVisible = true;
    });
  }

  /**
   * Revokes chart to its initial settings
   */
  onRevokeChart() {
    const { chart } = this.savedCharts[this.selectedChartIndex].attributes;
    const sortedSavedChart = Object.keys(chart)
      .sort()
      .reduce((accumulator, currentValue) => {
        accumulator[currentValue] = chart[currentValue];
        return accumulator;
      }, {});

    if (JSON.stringify(sortedSavedChart) !== JSON.stringify(this.chartBlueprint)) {
      this.onChartBlueprintCreated(sortedSavedChart as IChartBlueprint);
      this.isChartFormVisible = false;
    }
  }

  /**
   * Sets form toggle visibility
   */
  setFormToggleVisibility() {
    if (this.isNamedChartMode) {
      if (!this.isEditorPreview) {
        this.isFormToggleActive = !this.savedCharts[this.selectedChartIndex]?.attributes.is_default;
      }
    } else {
      this.isFormToggleActive = !this.isEditorPreview || (this.isEditorPreview && this.hasAccessToEditorPreview);
    }
  }

  /**
   * Checks storage and attaches stored chart to the list of charts
   */
  checkStorageAndAttachChartIfExists() {
    if (this.isNamedChartMode) {
      if (this.isInStorage) {
        const chartBlueprint = this.getFromStorage();
        this.chartId = this.localStorageId;
        const chartName = chartBlueprint.name;
        delete chartBlueprint.name;

        this.savedCharts = [
          ...this.savedCharts.filter(item => item.attributes.is_default),
          {
            id: this.chartId,
            type: 'chart',
            attributes: {
              is_default: false,
              chart: chartBlueprint,
              name: chartName,
            },
          },
        ];
      } else {
        this.savedCharts = [...this.savedCharts.filter(item => item.attributes.is_default)];
      }
    }
  }

  /**
   * Determines whether chart creation is blocked for user (not editor)
   */
  isChartCreationBlockedForUser() {
    const resource = ActivatedRouteHelper.getRouteData(this.activatedRoute, 'post');
    this.isChartCreationBlocked = ObjectHelper.getNested(resource, ['attributes', 'is_chart_creation_blocked']);
  }
}
