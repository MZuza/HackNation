import { importProvidersFrom, SimpleChange } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { ApiSourceLinkComponent } from '@app/shared/api-source-link/api-source-link.component';

describe('ApiSourceLinkComponent', () => {
  let component: ApiSourceLinkComponent;
  let fixture: ComponentFixture<ApiSourceLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ApiSourceLinkComponent],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiSourceLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should call ngOnChanges for apiUrl', inject([TranslateService], (translateService: TranslateService) => {
    component.apiUrl = 'localhost:8080/homepage';
    translateService.currentLang = 'pl';
    component.ngOnChanges({ apiUrl: new SimpleChange(null, component.apiUrl, true) });
    expect(component.apiUrl).toEqual('localhost:8080/homepage?lang=pl');
  }));

  it('should call ngOnChanges for apiUrl with params', inject([TranslateService], (translateService: TranslateService) => {
    component.apiUrl = 'localhost:8080/homepage?sort=relevance';
    translateService.currentLang = 'pl';
    component.ngOnChanges({ apiUrl: new SimpleChange(null, component.apiUrl, true) });
    expect(component.apiUrl).toEqual('localhost:8080/homepage?sort=relevance&lang=pl');
  }));

  it('should call ngOnChanges for apiUrl when component.apiUrl is not defined', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      translateService.currentLang = 'pl';
      component.ngOnChanges({ apiUrl: new SimpleChange(null, 'localhost:8080/homepage', true) });
      expect(component.apiUrl).toEqual(undefined);
    },
  ));

  it('should call ngOnChanges for apiUrl with params when lang is exist', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      component.apiUrl = 'localhost:8080/homepage?sort=relevance&lang=pl';
      translateService.currentLang = 'pl';
      component.ngOnChanges({ apiUrl: new SimpleChange(null, component.apiUrl, true) });
      expect(component.apiUrl).toEqual('localhost:8080/homepage?sort=relevance&lang=pl');
    },
  ));
});
