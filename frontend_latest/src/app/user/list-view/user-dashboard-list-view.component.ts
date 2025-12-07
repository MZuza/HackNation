import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import moment from 'moment/min/moment-with-locales';
import { switchMap } from 'rxjs/operators';

import { BasicPageParams } from '@app/services/models/page-params';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { UserDashboardListViewService } from '@app/user/list-view/user-dashboard-list-view.service';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';
import { UserDashboardListViewContainer } from '@app/user/list-view/UserDashboardListViewContainer';
import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

/**
 * User Dashboard List View Component
 */
@Component({
    selector: 'app-user-dashboard-list-view',
    templateUrl: './user-dashboard-list-view.component.html',
    providers: [UserDashboardListViewService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ItemsPerPageComponent,
        PaginationComponent,
        TranslatePipe,
    ],
})
export class UserDashboardListViewComponent implements OnInit {
  /**
   * List Configuration
   */
  @Input()
  config: UserDashboardListViewConfig;

  /**
   * Component that contains list
   */
  @Input()
  listContainerComponent: Type<UserDashboardListViewContainer>;

  /**
   * Reference to list container
   */
  @ViewChild('listContainer', { static: true, read: ViewContainerRef })
  listContainerRef: ViewContainerRef;

  /**
   * Basic params of the component
   */
  basicParams: BasicPageParams;

  /**
   * User defined params
   */
  params: BasicPageParams;

  /**
   * List of items
   */
  items: any[];

  /**
   * Count of items
   */
  count: number;

  /**
   * Selected filters
   */
  selectedFilters: string[];

  /**
   * Filter type
   */
  filterType: typeof UserDashboardListViewFilterType;

  /**
   * Reference to dynamic component
   * @type {ComponentRef<any>}
   */
  private componentRef: ComponentRef<any>;

  /**
   * @ignore
   */
  constructor(
    private listService: UserDashboardListViewService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  /**
   * Setups config and handles activated route params
   */
  ngOnInit(): void {
    moment.locale(this.translate.currentLang);
    this.setupConfig();
    this.handleActivatedRouteParams();
  }

  /**
   * Updates query params on every user interaction
   * @param {any} params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
    const updatedBasicParams = {
      page: +this.params['page'] || this.basicParams['page'],
      per_page: +this.params['per_page'] || this.basicParams['per_page'],
      q: this.params['q'] || '',
      sort: this.params['sort'] || '',
    };

    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...params,
      },
      queryParamsHandling: method,
    });
  }

  /**
   * Handles filtering on list of items (courses)
   * @param {string} item
   */
  onCheck(item: string) {
    if (!this.selectedFilters) {
      this.selectedFilters = [];
    }

    const index = this.selectedFilters.indexOf(item);
    index === -1 ? this.selectedFilters.push(item) : this.selectedFilters.splice(index, 1);

    this.updateParams({ state: this.selectedFilters.join(',') });
  }

  /**
   * Determines whether checkbox (filter) is checked
   * @param {string} item
   * @returns {boolean}
   */
  isChecked(item: string): boolean {
    return this.selectedFilters.indexOf(item) !== -1;
  }

  /**
   * Setups component with config values
   */
  private setupConfig(): void {
    this.filterType = this.config.filterConfig?.filterType;
    this.selectedFilters = this.config.filterConfig ? this.config.filterConfig.selectedFilters : [];
    this.basicParams = {
      sort: this.config.sortParamValue,
      page: 1,
      q: '',
      per_page: 5,
    };
    if (this.config.injector !== undefined) {
      this.listService = this.config.injector.get(UserDashboardListViewService);
    }
  }

  /**
   * Handles activated route params change
   */
  private handleActivatedRouteParams() {
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap(qParamMap => {
          let sort = '';

          if (!this.allBasicParamsIn(qParamMap['params'])) {
            sort = this.basicParams['sort'];
          }

          this.params = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || sort,
          };

          if (qParamMap.get('state')) {
            this.params['state'] = qParamMap.get('state');
            this.selectedFilters = [...qParamMap.get('state').split(',')];
          } else {
            this.params['state'] = this.selectedFilters.join(',');
          }

          Object.keys(this.config.additionalPageParams).forEach(key => {
            this.params[key] = this.config.additionalPageParams[key];
          });

          this.config.additionalPageParamsCallback(this.params, qParamMap);

          return this.listService.getAll(this.params);
        }),
      )
      .subscribe(response => {
        this.items = response.results;
        this.count = response.count;
        this.config.afterDataFetchedCallback(response);
        this.createListView();
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Checks whether default page params already exist
   * @param {any} obj
   * @returns {boolean}
   */
  private allBasicParamsIn(obj: any): boolean {
    for (const key of Object.keys(this.basicParams)) {
      if (!(key in obj)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Create list container component
   */
  private createListView(): void {
    if (this.listContainerRef.length === 0) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.listContainerComponent);
      this.componentRef = this.listContainerRef.createComponent<any>(componentFactory);
    }
    this.componentRef.instance.items = this.items;
  }
}
