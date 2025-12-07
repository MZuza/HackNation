export enum ResourceDataType {
  date = 'date',
  datetime = 'datetime',
  time = 'time',

  integer = 'integer',
  number = 'number',
  float = 'float',

  string = 'string',
  boolean = 'boolean',
  geopoint = 'geopoint',
  any = 'any',
}

export enum ResourceFilterOperator {
  isEqual = 'isEqual',
  isNotEqual = 'isNotEqual',
  isEmpty = 'isEmpty',
  isNotEmpty = 'isNotEmpty',

  isGreaterThan = 'isGreaterThan',
  isGreaterOrEqual = 'isGreaterOrEqual',
  isLessThan = 'isLessThan',
  isLessOrEqual = 'isLessOrEqual',

  beginsWith = 'beginsWith',
  itContains = 'itContains',
  doNotContain = 'doNotContain',
}
