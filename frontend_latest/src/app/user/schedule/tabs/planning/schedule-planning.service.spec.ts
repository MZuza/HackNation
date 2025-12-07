import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SchedulePlanningService } from './schedule-planning.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('SchedulePlanningService', () => {
  let service: SchedulePlanningService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SchedulePlanningService));

    service = TestBed.inject(SchedulePlanningService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSchedulesItemForCurrentSchedule function', () => {
    const spyFunction = jest.spyOn(service, 'getSchedulesItemForCurrentSchedule');
    service.getSchedulesItemForCurrentSchedule();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getRepresentativesSchedules function', () => {
    const spyFunction = jest.spyOn(service, 'getRepresentativesSchedules');
    service.getRepresentativesSchedules();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call updateScheduleStatus function', () => {
    const spyFunction = jest.spyOn(service, 'updateScheduleStatus');
    service.updateScheduleStatus(1, true);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call blockSchedule function', () => {
    const spyFunction = jest.spyOn(service, 'blockSchedule');
    service.blockSchedule(false);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call deleteScheduleItem function', () => {
    const spyFunction = jest.spyOn(service, 'deleteScheduleItem');
    service.deleteScheduleItem('2');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call searchForUserSchedules function', () => {
    const spyFunction = jest.spyOn(service, 'searchForUserSchedules');
    service.searchForUserSchedules('q', 2);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getUserScheduleItem function', () => {
    const spyFunction = jest.spyOn(service, 'getUserScheduleItem');
    service.getUserScheduleItem(2);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call updateUserScheduleItem function', () => {
    const spyFunction = jest.spyOn(service, 'updateUserScheduleItem');
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.updateUserScheduleItem(planningBlueprint);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call addUserScheduleItem function', () => {
    const spyFunction = jest.spyOn(service, 'addUserScheduleItem');
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.addUserScheduleItem(planningBlueprint);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call addUserScheduleItemByAdmin function', () => {
    const spyFunction = jest.spyOn(service, 'addUserScheduleItemByAdmin');
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.addUserScheduleItemByAdmin(planningBlueprint);

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getUserInstitutions function', () => {
    const spyFunction = jest.spyOn(service, 'getUserInstitutions');
    service.getUserInstitutions();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getUserEmailAndInstitutions function', () => {
    const spyFunction = jest.spyOn(service, 'getUserEmailAndInstitutions');
    service.getUserEmailAndInstitutions('2', 'test@test.pl');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getUserInstitutionsForScheduleItem function', () => {
    const spyFunction = jest.spyOn(service, 'getUserInstitutionsForScheduleItem');
    service.getUserInstitutionsForScheduleItem('2');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getUserInstitutionsForScheduleItemId function', () => {
    const spyFunction = jest.spyOn(service, 'getUserInstitutionsForScheduleItemId');
    service.getUserInstitutionsForScheduleItemId('2');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call openNewSchedule function', () => {
    const spyFunction = jest.spyOn(service, 'openNewSchedule');
    service.openNewSchedule();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call isTableShouldBeReloaded function', () => {
    const spyFunction = jest.spyOn(service, 'isTableShouldBeReloaded');
    service.isTableShouldBeReloaded();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call setTableShouldBeReloaded function', () => {
    const spyFunction = jest.spyOn(service, 'setTableShouldBeReloaded');
    service.setTableShouldBeReloaded();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getScheduleItemComments function', () => {
    const spyFunction = jest.spyOn(service, 'getScheduleItemComments');
    service.getScheduleItemComments('1');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call saveComment function', () => {
    const spyFunction = jest.spyOn(service, 'saveComment');
    service.saveComment('1', 'text');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call saveComment function with comment ID', () => {
    const spyFunction = jest.spyOn(service, 'saveComment');
    service.saveComment('1', 'text', '1');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should getSchedulesItemForCurrentSchedule function return value', () => {
    service.getSchedulesItemForCurrentSchedule().subscribe(() => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should getRepresentativesSchedules function return value', () => {
    service.getRepresentativesSchedules().subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should updateScheduleStatus function return value', () => {
    service.updateScheduleStatus(2, true).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should blockSchedule function return value', () => {
    service.blockSchedule(true).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should deleteScheduleItem function return value', () => {
    service.deleteScheduleItem('1').subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should searchForUserSchedules function return value', () => {
    service.searchForUserSchedules('g', 1).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should getUserScheduleItem function return value', () => {
    service.getUserScheduleItem(2).subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should updateUserScheduleItem function return value', () => {
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.updateUserScheduleItem(planningBlueprint).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should addUserScheduleItem function return value', () => {
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.addUserScheduleItem(planningBlueprint).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should addUserScheduleItemByAdmin function return value', () => {
    const planningBlueprint = {
      id: '2',
      institution: 'test',
      dataset_title: 'test',
      format: 'format',
      is_new: false,
      is_ready: true,
      is_schedule_blocked: true,
      is_user_schedule_blocked: true,
    };
    service.addUserScheduleItemByAdmin(planningBlueprint).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should getUserInstitutions function return value', () => {
    service.getUserInstitutions('2').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should getUserEmailAndInstitutions function return value', () => {
    const dataTest = { email: 'test@test.pl', institutions: {} };
    service.getUserEmailAndInstitutions('2', 'test@test.pl').subscribe(value => {
      const req = httpMock.expectOne(() => true);
      req.flush(dataTest);
    });
  });

  it('should getUserInstitutionsForScheduleItem function return value', () => {
    service.getUserInstitutionsForScheduleItem('2').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should getUserInstitutionsForScheduleItemId function return value', () => {
    service.getUserInstitutionsForScheduleItemId('2').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should openNewSchedule function return value', () => {
    service.openNewSchedule().subscribe(value => {
      const req = httpMock.expectOne({ method: 'POST' });
      req.flush('Post');
    });
  });

  it('should isTableShouldBeReloaded function return value', () => {
    service.isTableShouldBeReloaded().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should getScheduleItemComments function return value', () => {
    service.getScheduleItemComments('2').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });

  it('should saveComment function return value', () => {
    service.saveComment('2', 'text').subscribe(value => {
      const req = httpMock.expectOne({ method: 'POST' });
      req.flush('Post');
    });
  });

  it('should getSchedules function return value', () => {
    service.getSchedules().subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });
});
