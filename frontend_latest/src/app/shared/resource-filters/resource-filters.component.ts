import { AsyncPipe, formatDate, LowerCasePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ActivatedRouteHelper } from '../helpers/activated-route.helper';
import { ResourceHelper } from '../helpers/resource.helper';
import { InfoTooltipDirective } from '../info-tooltip/info-tooltip.directive';
import { TranslateDateFormatPipe } from '../pipes/translate-date-format.pipe';
import { ResourceDataType, ResourceFilterOperator } from '../resource-table/enums';
import { IResourceTableFilter } from '../resource-table/IResourceTableFilter';
import { ResourceTableColumn } from '../resource-table/ResourceTableColumn';

import { toggleVertically } from '@app/animations';
import { DatasetService } from '@app/services/dataset.service';

/**
 * Resource Filters Component
 */
@Component({
    selector: 'app-resource-filters',
    templateUrl: './resource-filters.component.html',
    animations: [toggleVertically],
    standalone: true,
  imports: [
    FormsModule,
    NgIf,
    InfoTooltipDirective,
    NgFor,
    DatepickerComponent,
    AsyncPipe,
    LowerCasePipe,
    TranslatePipe,
    TranslateDateFormatPipe,
    TimepickerComponent,
  ],
})
export class ResourceFiltersComponent implements OnInit {
  /**
   * Incoming resource ID
   */
  @Input() resourceId: string;

  /**
   * Table view columns as a data source
   */
  columns: ResourceTableColumn[];

  /**
   * Search query
   */
  searchQuery: string;

  /**
   * Determines whether filters are visible
   */
  areFiltersVisible = false;

  /**
   * Reference to the filters form
   */
  @ViewChild('filtersForm') filtersForm: NgForm;

  /**
   * Currently selected filter before is to the list of selected filters
   */
  currentFilter: IResourceTableFilter = {
    column: null,
    operator: null,
    phrase: '',
    phraseTime: '',
    query: '',
    typeTranslationKey: null,
  };

  /**
   * List of selected filters
   */
  selectedFilters: IResourceTableFilter[] = [];

  /**
   * Temporary list of operators for current filter
   */
  tempOperators: ResourceFilterOperator[];

  /**
   * Determines whether filter form's phrase field is accessible
   */
  isPhraseFieldAccessible = false;

  /**
   * @ignore
   */
  constructor(private datasetService: DatasetService, private activatedRoute: ActivatedRoute) {}

  /**
   * Initializes form data
   */
  ngOnInit() {
    if (!this.resourceId) {
      this.resourceId = ActivatedRouteHelper.getParamFromCurrentOrParentRoute(this.activatedRoute, 'resourceId');
    }

    this.datasetService.getResourceData(this.resourceId, {}).subscribe(response => {
      if (!response['meta']['headers_map']) {
        return;
      }

      this.columns = ResourceHelper.getTableColumns(response);
    });

    if (this.activatedRoute.snapshot.queryParams.q) {
      let q = this.activatedRoute.snapshot.queryParams.q as string;
      const qArray = q.split('AND');

      if (!!qArray.length) {
        q = qArray[0];
      }

      this.searchQuery = q.trim();
    } else {
      this.searchQuery = '';
    }

    this.datasetService.resourceFilterChanged.next(this.searchQuery);
  }

  /**
   * Generates query ready to process by Elastic Search
   */
  generateQuery(searchQuery?: string) {
    const andOperator = ' AND ';

    if (searchQuery || searchQuery === '') {
      this.searchQuery = searchQuery;
    }

    let esQuery = this.searchQuery || '';

    if (this.selectedFilters.length) {
      if (esQuery) {
        esQuery += andOperator;
      }
      esQuery += this.selectedFilters.map(filter => filter.query).join(andOperator);
    }

    this.datasetService.resourceFilterChanged.next(esQuery);
  }

  /**
   * Applies a filter to the list of selected filters
   * @param {NgForm} form
   */
  onApplyFilter(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.currentFilter.phrase = this.isPhraseFieldAccessible ? form.controls['phrase'].value : '';
    this.currentFilter.phraseTime = this.isPhraseFieldAccessible && form.controls['phraseTime'] ? form.controls['phraseTime'].value : '';
    this.currentFilter.query = this.transformCurrentFilterIntoQuery();

    this.selectedFilters.push(this.currentFilter);

    this.generateQuery();
    this.resetForm();
  }

  /**
   * Removes filter from the list of selected filters
   * @param {number} index
   */
  onRemoveFilterByIndex(index: number) {
    this.selectedFilters.splice(index, 1);
    this.generateQuery();
  }

  /**
   * Runs on every column change.
   * Updates operator list and clears phrase field.
   * @param {ResourceTableColumn} column
   */
  onFilterColumnChange(column: ResourceTableColumn) {
    this.filtersForm.form.patchValue({
      operator: null,
      phrase: '',
    });

    this.currentFilter.column = column;

    switch (column.type as ResourceDataType) {
      case ResourceDataType.datetime:
      case ResourceDataType.time:
        this.currentFilter.typeTranslationKey = ResourceDataType.datetime;
        break;
      case ResourceDataType.date:
        this.currentFilter.typeTranslationKey = ResourceDataType.date;
        break;
      case ResourceDataType.integer:
      case ResourceDataType.number:
      case ResourceDataType.float:
        this.currentFilter.typeTranslationKey = ResourceDataType.integer;
        break;
      case ResourceDataType.string:
      case ResourceDataType.geopoint:
      case ResourceDataType.any:
        this.currentFilter.typeTranslationKey = ResourceDataType.string;
        break;
      case ResourceDataType.boolean:
        this.currentFilter.typeTranslationKey = ResourceDataType.boolean;
        break;
    }

    this.tempOperators = this.getOperatorsByDataType(this.currentFilter.typeTranslationKey as ResourceDataType);
  }

  /**
   * Determines whether phrase field is accessible
   * @param {ResourceFilterOperator} value
   */
  onFilterOperatorChange(value: ResourceFilterOperator) {
    if (value === null || value === ResourceFilterOperator.isEmpty || value === ResourceFilterOperator.isNotEmpty) {
      this.isPhraseFieldAccessible = false;
    } else {
      this.isPhraseFieldAccessible = true;
    }

    this.currentFilter.operator = value;
  }

  /**
   * Gets operators by resource data type
   * @param {ResourceDataType} dataType
   * @returns {ResourceFilterOperator[]} operators by data type
   */
  getOperatorsByDataType(dataType: ResourceDataType): ResourceFilterOperator[] {
    const topOperators = [ResourceFilterOperator.isEqual, ResourceFilterOperator.isNotEqual];
    const bottomOperators = [ResourceFilterOperator.isEmpty, ResourceFilterOperator.isNotEmpty];
    const glOperators = [ResourceFilterOperator.isGreaterThan, ResourceFilterOperator.isLessThan];
    const glOrOperators = [ResourceFilterOperator.isGreaterOrEqual, ResourceFilterOperator.isLessOrEqual];

    switch (dataType) {
      case ResourceDataType.datetime:
      case ResourceDataType.date:
      case ResourceDataType.time:
        return [...topOperators, ...glOperators, ...glOrOperators, ...bottomOperators];
      case ResourceDataType.string:
      case ResourceDataType.geopoint:
      case ResourceDataType.any:
        return [
          ...topOperators,
          ResourceFilterOperator.beginsWith,
          ResourceFilterOperator.itContains,
          ResourceFilterOperator.doNotContain,
          ...bottomOperators,
        ];
      case ResourceDataType.integer:
      case ResourceDataType.number:
      case ResourceDataType.float:
        return [...topOperators, ...glOperators, ...glOrOperators, ...bottomOperators];
      case ResourceDataType.boolean:
        return [...topOperators, ...bottomOperators];
      default:
        return [];
    }
  }

  /**
   * Removes all selected filters
   */
  onClearSelectedFilters() {
    this.selectedFilters = [];
    this.generateQuery();
  }

  /**
   * Restores initial view - clears search field and selected filter list
   */
  onRestoreInitialView() {
    this.selectedFilters = [];
    this.searchQuery = '';
    this.generateQuery();
  }

  /**
   * Resets filter form
   */
  private resetForm() {
    const commonProps = {
      column: null,
      operator: null,
      phrase: '',
      phraseTime: '',
    };

    this.currentFilter = { ...commonProps, query: '', typeTranslationKey: null };
    this.filtersForm.form.patchValue({ ...commonProps });
    this.tempOperators = [];
  }

  /**
   * Transforms current filter into Elastic Search compliant query
   * @returns {string}
   */
  private transformCurrentFilterIntoQuery(): string {
    const { name, type } = this.currentFilter.column;
    let { operator, phrase, phraseTime } = this.currentFilter;

    if ((type as ResourceDataType) === ResourceDataType.date && phrase) {
      phrase = formatDate(phrase, 'yyyy-MM-dd', 'en-US');
    }

    if ((type as ResourceDataType) === ResourceDataType.datetime && phrase) {
      phrase = this.joinDateWithTime(phrase, phraseTime);
    }

    let phraseWithQuotes = phrase;
    if ((type as ResourceDataType) === ResourceDataType.string) {
      phraseWithQuotes = '"' + phrase + '"';
    }

    switch (operator as ResourceFilterOperator) {
      case ResourceFilterOperator.isEqual:
        return name + ':' + phraseWithQuotes;
      case ResourceFilterOperator.isNotEqual:
        return 'NOT ' + name + ':' + phraseWithQuotes;

      case ResourceFilterOperator.isEmpty:
        return name + ':null';
      case ResourceFilterOperator.isNotEmpty:
        return 'NOT ' + name + ':null';

      case ResourceFilterOperator.isGreaterThan:
        return name + ':(>' + phrase + ')';
      case ResourceFilterOperator.isGreaterOrEqual:
        return name + ':[' + phrase + ' TO *]';

      case ResourceFilterOperator.isLessThan:
        return name + ':(<' + phrase + ')';
      case ResourceFilterOperator.isLessOrEqual:
        return name + ':[* TO ' + phrase + ']';

      case ResourceFilterOperator.beginsWith:
        return name + ':' + phrase + '*';
      case ResourceFilterOperator.itContains:
        return name + ':*' + phrase + '*';
      case ResourceFilterOperator.doNotContain:
        return 'NOT ' + name + ':*' + phrase + '*';

      default:
        return null;
    }
  }

  /**
   * Checks if the date or the datetime type is selected.
   * @param {string} dataType
   * @return {boolean} true if valid
   */
  isDateType(dataType: string): boolean {
    return (dataType as ResourceDataType) === ResourceDataType.date || (dataType as ResourceDataType) === ResourceDataType.datetime;
  }

  /**
   * Checks if the datetime type is selected.
   * @param {string} dataType
   * @return {boolean} true if valid
   */
  isDateTimeType(dataType: string): boolean {
    return (dataType as ResourceDataType) === ResourceDataType.datetime;
  }

  /**
   * Checks if the number type is selected.
   * @param {string} dataType
   * @return {boolean} true if valid
   */
  isNumberType(dataType: string): boolean {
    return this.compareResourceDataType(dataType as ResourceDataType, ResourceDataType.integer);
  }

  /**
   * Compares resource data types
   * @param {ResourceDataType} type
   * @param {ResourceDataType} type2
   * @returns {boolean} true if equal
   */
  private compareResourceDataType(type: ResourceDataType, type2: ResourceDataType): boolean {
    return type === type2;
  }

  /**
   * Joins date with time
   * @param {string} date
   * @param {string} time
   * @returns {string}
   */
  joinDateWithTime(date: string, time: string): string {
    const dateTime = new Date(date);
    const timeTemp = new Date(time);
    dateTime.setHours(timeTemp.getHours(), timeTemp.getMinutes());
    return formatDate(dateTime, 'yyyy-MM-ddTHH:mm', 'en-US');
  }
}
