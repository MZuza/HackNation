export class ApiResponse {
  constructor(response) {
    this._results = response['data'];
    this._count = response['meta']['count'];
    this._filters = response['meta']['aggs'];
    this._aggregations = response['meta']['aggregations'];
    this._institutions = response['included'];
    this._links = response['links'];
    this._subscription_url = response['meta']['subscription_url'];
    this._params = response['meta']['params'];
  }

  private _links: any;

  get links(): any {
    return this._links;
  }

  private _institutions: any = [];

  get institutions(): any {
    return this._institutions;
  }

  private _results = [];

  get results(): any[] {
    return this._results;
  }

  private _count = 0;

  get count(): number {
    return this._count;
  }

  private _filters = {};

  get filters(): {} {
    return this._filters;
  }

  private _aggregations: any;

  get aggregations(): any {
    return this._aggregations;
  }

  private _subscription_url = '';

  get subscription_url(): string {
    return this._subscription_url;
  }

  private _params: any;

  get params(): any {
    return this._params;
  }
}
