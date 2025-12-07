import { ApiResponse } from '@app/services/api';
import { Injector } from '@angular/core';
import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

export class UserDashboardListViewConfig {
  constructor(
    public readonly isPagingVisible: boolean,
    public readonly isPaginationVisible: boolean,
    public readonly sortParamValue: string,
    public readonly filterConfig: UserDashboardListViewFilterConfig | null,
    public readonly additionalPageParams: { [key: string]: string | boolean },
    public readonly additionalPageParamsCallback: (params, qParams) => void,
    public readonly foundedItemsCountHeaderTitle: string,
    public readonly afterDataFetchedCallback: (response: ApiResponse) => void,
    public readonly injector: Injector,
  ) {}

  static builder = class UserDashboardListViewConfigBuilder {
    private isPagingVisible: boolean;
    private isPaginationVisible: boolean;
    private additionalPageParams: { [p: string]: string | boolean };
    private foundedItemsCountHeader: string;
    private additionalPageParamsCallback: (params, qParamMap) => void;
    private filterConfig: UserDashboardListViewFilterConfig;
    private afterDataFetchedCallback: (response: any) => void;
    private sortParamValue: string;
    private injector: Injector;

    withPaging(paging: boolean): UserDashboardListViewConfigBuilder {
      this.isPagingVisible = paging;
      return this;
    }

    withPagination(pagination: boolean): UserDashboardListViewConfigBuilder {
      this.isPaginationVisible = pagination;
      return this;
    }

    withSort(paramValue: string): UserDashboardListViewConfigBuilder {
      this.sortParamValue = paramValue;
      return this;
    }

    withFilterConfig(filterConfig: UserDashboardListViewFilterConfig): UserDashboardListViewConfigBuilder {
      this.filterConfig = filterConfig;
      return this;
    }

    withAdditionalPageParams(params: { [key: string]: string | boolean }): UserDashboardListViewConfigBuilder {
      this.additionalPageParams = params;
      return this;
    }

    withAdditionalPageParamsCallback(fn: (params, qParamMap) => void): UserDashboardListViewConfigBuilder {
      this.additionalPageParamsCallback = fn;
      return this;
    }

    withFoundedItemsCountHeader(title: string): UserDashboardListViewConfigBuilder {
      this.foundedItemsCountHeader = title;
      return this;
    }

    withAfterDataFetchedCallback(fn: (response) => void): UserDashboardListViewConfigBuilder {
      this.afterDataFetchedCallback = fn;
      return this;
    }

    withInjector(injector: Injector): UserDashboardListViewConfigBuilder {
      this.injector = injector;
      return this;
    }

    default(): UserDashboardListViewConfigBuilder {
      this.isPagingVisible = true;
      this.isPaginationVisible = true;
      this.filterConfig = null;
      this.additionalPageParams = {};
      this.additionalPageParamsCallback = () => {};
      this.afterDataFetchedCallback = () => {};
      this.foundedItemsCountHeader = 'Elementy';
      return this;
    }

    build(): UserDashboardListViewConfig {
      return new UserDashboardListViewConfig(
        this.isPagingVisible,
        this.isPaginationVisible,
        this.sortParamValue,
        this.filterConfig,
        this.additionalPageParams,
        this.additionalPageParamsCallback,
        this.foundedItemsCountHeader,
        this.afterDataFetchedCallback,
        this.injector,
      );
    }
  };
}

interface UserDashboardListViewFilterConfig {
  selectedFilters: Array<string>;
  filterType: typeof UserDashboardListViewFilterType;
  title: string;
}
