import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiConfig } from '@app/services/api';
import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

const userSchedulesMock = {
  meta: {
    language: 'pl',
    server_time: '2020-11-30T12:55:35Z',
    path: '/1.4/auth/user_schedules/16',
    params: { include: 'schedule,user_schedule_item' },
    notifications: { datasets: { new: 5 }, queries: { new: 85 } },
    relative_uri: '/1.4/auth/user_schedules/16?include=schedule,user_schedule_item',
  },
  data: {
    relationships: {
      user: { data: { id: '2573', type: 'user' } },
      period: { data: { id: '13', type: 'period' }, links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/periods/13' } },
      schedule: {
        data: { id: '13', type: 'schedule' },
        links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13' },
      },
      user_schedule_items: {
        links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedules/16/items' },
        meta: { count: 2 },
      },
    },
    attributes: {
      email: 'pelnomocnik1@gmail.com',
      institution: 'Ministerstwo Cyfryzacji',
      items_count: 2,
      is_ready: false,
      recommended_items_count: 1,
      implemented_items_count: 2,
      state: 'implemented',
    },
    id: '16',
    links: { self: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedules/16' },
    type: 'user_schedule',
  },
  jsonapi: { version: '1.0' },
  included: [
    {
      relationships: {
        period: {
          data: { id: '13', type: 'period' },
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/periods/13' },
        },
        user_schedules: {
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13/user_schedules' },
          meta: { count: 1 },
        },
        user_schedule_items: {
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13/user_schedule_items' },
          meta: { count: 2 },
        },
      },
      attributes: {
        period: 'II p\u00f3\u0142rocze 2026',
        end_date: '2020-11-01',
        new_end_date: '2020-11-01',
        link: '',
        state: 'implemented',
        name: 'Harmonogram otwierania danych na II p\u00f3\u0142rocze 2026',
      },
      id: '13',
      links: { self: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13' },
      type: 'schedule',
    },
    {
      relationships: {
        user: { data: { id: '2573', type: 'user' } },
        schedule: {
          data: { id: '13', type: 'schedule' },
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13' },
        },
        user_schedule: {
          data: { id: '16', type: 'user_schedule' },
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedules/16' },
        },
        comments: { links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/51/comments' }, meta: { count: 0 } },
      },
      attributes: {
        institution: 'Urz\u0105d Miejski w B\u0142oniu 30.11.2020',
        institution_unit: 'Urz\u0105d Miejski w B\u0142oniu 30.11.2020',
        dataset_title: 'xyz - admin update 30.11.2020',
        created: '2020-11-18',
        format: 'csv,xlsx',
        is_new: false,
        is_openness_score_increased: true,
        is_quality_improved: false,
        description: 'Uwagi 30.11.2020',
        state: 'implemented',
        is_accepted: false,
        is_resource_added: true,
        is_resource_added_notes: 'Komentarz do realizacji 30.11.2020',
        resource_link: 'http://example.com',
      },
      id: '51',
      links: { self: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/51' },
      type: 'user_schedule_item',
    },
    {
      relationships: {
        user: { data: { id: '2573', type: 'user' } },
        schedule: {
          data: { id: '13', type: 'schedule' },
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/schedules/13' },
        },
        user_schedule: {
          data: { id: '16', type: 'user_schedule' },
          links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedules/16' },
        },
        comments: { links: { related: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/52/comments' }, meta: { count: 0 } },
      },
      attributes: {
        institution: 'Urz\u0105d Miejski w B\u0142oniu',
        institution_unit: 'Instytut Badawczy Dr\u00f3g i Most\u00f3w',
        dataset_title: 'aaaa',
        created: '2020-11-18',
        format: 'doc',
        is_new: true,
        is_openness_score_increased: true,
        is_quality_improved: false,
        description: 'brak uwag od pe\u0142nomocnika',
        state: 'implemented',
        is_accepted: true,
        is_resource_added: true,
        is_resource_added_notes: 'komentarz pe\u0142nomocnika do realizacja i linku',
        resource_link: 'http://www.example.com?q=pelnomocnik1&realizacja=tak',
      },
      id: '52',
      links: { self: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/52' },
      type: 'user_schedule_item',
    },
  ],
  links: { self: 'https://api.dev.dane.gov.pl/1.4/auth/user_schedules/16?include=schedule,user_schedule_item' },
};

describe('ApplicationsService', () => {
  let service: ScheduleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ScheduleService));

    service = TestBed.inject(ScheduleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch schedules item for current schedule from user schedules endpoint when user is admin', () => {
    service.getSchedulesItemForCurrentSchedule(1, true, 1).subscribe(() => {
      httpMock.expectOne(`/api${ApiConfig.userSchedules}/${1}?include=schedule,user_schedule_item`);
    });
  });

  it('should fetch schedules item for current schedule from schedules endpoint when user isn\'t admin', () => {
    service.getSchedulesItemForCurrentSchedule(1, false, 1).subscribe(data => {
      httpMock.expectOne(`/api${ApiConfig.schedules}/${1}/user_schedule_items?include=schedule,user_schedule`);
      expect(data).toBeTruthy();
    });
  });

  it('should map response to UserSchedule', () => {
    service.getSchedulesItemForCurrentSchedule(1, true, 1).subscribe(data => {
      const req = httpMock.expectOne(`/api${ApiConfig.userSchedules}/${1}?include=schedule,user_schedule_item`);
      req.flush(userSchedulesMock);
      expect(data).toEqual({
        completed: false,
        data: [
          {
            accepted: 'Tak',
            creationDate: '2020-11-18',
            datasets: 'aaaa',
            department: 'Instytut Badawczy Dróg i Mostów',
            finished: 'Tak',
            id: 52,
            institution: 'Urząd Miejski w Błoniu',
          },
          {
            accepted: 'Nie',
            creationDate: '2020-11-18',
            datasets: 'xyz - admin update 30.11.2020',
            department: 'Urząd Miejski w Błoniu 30.11.2020',
            finished: 'Tak',
            id: 51,
            institution: 'Urząd Miejski w Błoniu 30.11.2020',
          },
        ],
        id: 13,
        link: '',
        newPlanningEndDate: '2020-11-01',
        planningEndDate: '2020-11-01',
        representativeEmail: 'pelnomocnik1@gmail.com',
        state: 'implemented',
        userScheduleId: '16',
      });
    });
  });

  it('should call getRepresentativesSchedules function', () => {
    const spyFunction = jest.spyOn(service, 'getRepresentativesSchedules');
    service.getRepresentativesSchedules('1', 'archived');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should check http url with params in getRepresentativesSchedules function', () => {
    const id = '1';
    const state = 'archived';
    service.getRepresentativesSchedules(id, state).subscribe(() => {
      httpMock.expectOne(`/api${ApiConfig.schedules}/${id}?state=${state}&include=user_schedule`);
    });
  });

  it('should check params in getRepresentativesSchedules function', () => {
    const id = '1';
    const state = 'archived';
    service.getRepresentativesSchedules(id, state);
    const params = { state: state, include: 'user_schedule' };

    expect(params).toEqual({ state: 'archived', include: 'user_schedule' });
  });

  it('should call getSchedules function', () => {
    const spyFunction = jest.spyOn(service, 'getSchedules');
    service.getSchedules('archived');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should check params in getSchedules function', () => {
    const state = 'archived';
    service.getSchedules(state);
    const params = { state: state, sort: '-id' };

    expect(params).toEqual({ state: 'archived', sort: '-id' });
  });

  it('should check http url with params in getSchedules function', () => {
    const state = 'archived';
    service.getSchedules(state).subscribe(() => {
      httpMock.expectOne(`/api${ApiConfig.schedules}?state=${state}&sort=-id`);
    });
  });

  it('should check if getSchedules http request is GET', () => {
    service.getSchedules('archived').subscribe(() => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should call moveScheduleToArchive function', () => {
    const spyFunction = jest.spyOn(service, 'moveScheduleToArchive');
    service.moveScheduleToArchive(1);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should move schedule to archive for current schedule', () => {
    service.moveScheduleToArchive(1).subscribe(() => {
      httpMock.expectOne(`/api${ApiConfig.schedules}/${1}`);
    });
  });

  it('should call restoreScheduleToImplemented function', () => {
    const spyFunction = jest.spyOn(service, 'restoreScheduleToImplemented');
    service.restoreScheduleToImplemented(1);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should restore schedule to implemented state for current schedule', () => {
    service.restoreScheduleToImplemented(1).subscribe(() => {
      httpMock.expectOne(`/api${ApiConfig.schedules}/${1}`);
    });
  });

  it('should call addUserScheduleItemByAdmin function', () => {
    const planningFormBlueprint = {
      user_schedule_id: '1',
      institution: '',
      dataset_title: '',
      format: '',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: false,
      is_user_schedule_blocked: false,
    };
    let user_schedule_id;
    service.addUserScheduleItemByAdmin(planningFormBlueprint);
    user_schedule_id = planningFormBlueprint.user_schedule_id;
    expect(user_schedule_id).toBe(planningFormBlueprint.user_schedule_id);
  });

  it('should delete user_schedule_id from planningFormBlueprint in addUserScheduleItemByAdmin function', () => {
    const planningFormBlueprint = {
      user_schedule_id: '1',
      institution: '',
      dataset_title: '',
      format: '',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: false,
      is_user_schedule_blocked: false,
    };
    const user_schedule_id = '1';
    delete planningFormBlueprint.user_schedule_id;

    expect(planningFormBlueprint).not.toEqual({
      user_schedule_id: '1',
      institution: '',
      dataset_title: '',
      format: '',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: false,
      is_user_schedule_blocked: false,
    });
    expect(user_schedule_id).toEqual('1');
  });

  it('should call getExportUrl function', () => {
    const spyFunction = jest.spyOn(service, 'getExportUrl');
    service.getExportUrl('schedules', 1, 'csv');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should mach url if source parameter is schedule in getExportUrl function', () => {
    const source = 'schedules';
    const id = 1;
    const format = 'cvs';
    service.getExportUrl(source, id, 'csv');
    const url = source === 'schedules' ? `${ApiConfig.schedules}/${id}.${format}` : `${ApiConfig.userSchedules}/${id}/items.${format}`;
    expect(url).toEqual(`${ApiConfig.schedules}/${id}.${format}`);
    expect(url).not.toEqual(`${ApiConfig.userSchedules}/${id}/items.${format}`);
  });

  it('should mach url if source parameter is user_schedules in getExportUrl function', () => {
    const source = 'user_schedules';
    const id = 1;
    const format = 'cvs';
    service.getExportUrl(source, id, 'csv');
    const url = source === 'user_schedules' ? `${ApiConfig.userSchedules}/${id}/items.${format}` : `${ApiConfig.schedules}/${id}.${format}`;
    expect(url).toEqual(`${ApiConfig.userSchedules}/${id}/items.${format}`);
    expect(url).not.toEqual(`${ApiConfig.schedules}/${id}.${format}`);
  });

  it('should check isFullExport parameter in getExportUrl function', () => {
    const source = 'schedules';
    const id = 1;
    const isFullExport = false;
    service.getExportUrl(source, id, 'csv', isFullExport);
    const queryParams = undefined;
    expect(queryParams).toEqual(undefined);
    expect(isFullExport).not.toEqual(true);
  });

  it('should check if getExportUrl http request is GET in getExportUrl function', () => {
    const source = 'schedules';
    const id = 1;
    const isFullExport = false;
    service.getExportUrl(source, id, 'csv', isFullExport).subscribe(() => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });
});
