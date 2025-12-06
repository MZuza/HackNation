import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsService } from '@app/services/notifications.service';
import { WriteUsInfoComponent } from '@app/shared/write-us-info/write-us-info.component';

class BsModalServiceStub {}

describe('WriteUsInfoComponent', () => {
  let component: WriteUsInfoComponent;
  let fixture: ComponentFixture<WriteUsInfoComponent>;
  let service: BsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        WriteUsInfoComponent
      ],
      providers: [
        { provide: BsModalService, useClass: BsModalServiceStub },
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(BsModalService);
    fixture = TestBed.createComponent(WriteUsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should open write us modal', () => {
    jest.spyOn(component, 'openWriteUsModal');
    const link = fixture.debugElement.query(By.css('.write-us-info'));
    link.triggerEventHandler('click', null);
    expect(component.openWriteUsModal).toHaveBeenCalled();
  });
});
