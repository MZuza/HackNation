import { ListViewFiltersService } from './list-view-filters.service';

describe('FiltersService', () => {
  let service: ListViewFiltersService;

  beforeEach(() => {
    service = new ListViewFiltersService({} as any, undefined);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
