import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { provideNgxLocalstorage } from 'ngx-localstorage';

import { InstitutionItemResultsComponent } from '@app/pages/institutions/institution-item-results/institution-item-results.component';
import { SharedModule } from '@app/shared/shared.module';

describe('InstitutionItemResultsComponent', () => {
  let component: InstitutionItemResultsComponent;
  let fixture: ComponentFixture<InstitutionItemResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        InstitutionItemResultsComponent
      ],
      providers: [
        provideNgxLocalstorage(),
        provideRouter([]),
        provideHttpClientTesting()
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionItemResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
