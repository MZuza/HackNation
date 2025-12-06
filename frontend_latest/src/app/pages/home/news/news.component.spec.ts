import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { HomeModule } from '@app/pages/home/home.module';
import { NewsComponent } from '@app/pages/home/news/news.component';
import { CmsService } from '@app/services/cms.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SharedModule } from '@app/shared/shared.module';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        HomeModule,
        NewsComponent
      ],
      providers: [
        CmsService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
      teardown: {destroyAfterEach: false}
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should unsubscribe when component is destroyed', fakeAsync( () => {
    const unsubscriptionSpy = jest.spyOn(component.articlesSubstription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalled();
  }));
});
