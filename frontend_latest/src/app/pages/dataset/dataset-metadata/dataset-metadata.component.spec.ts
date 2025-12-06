import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { AppTestingModule } from '@app/app.testing.module';
import { DatasetMetadataComponent } from '@app/pages/dataset/dataset-metadata/dataset-metadata.component';



describe('DatasetMetadataComponent', () => {
  let component: DatasetMetadataComponent;
  let fixture: ComponentFixture<DatasetMetadataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          parser: {
            provide: TranslateParser,
            useClass: TranslateICUParser,
          },
          defaultLanguage: 'pl',
          useDefaultLang: true,
        }),
        DatasetMetadataComponent
      ],
      providers: [importProvidersFrom(AppTestingModule)]
    });

    fixture = TestBed.createComponent(DatasetMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sets metadata urls when datasetId is exists', () => {
    component.selfLink = 'https://dev.dane.gov.pl/pl';
    component.datasetId = '1';
    fixture.detectChanges();
    component.setMetadataUrls();
    expect(component.selfApiRdf).toBe('1.rdf');
    expect(component.selfApiCsv).toBe('1/resources/metadata.csv');
    expect(component.selfApiXml).toBe('1/resources/metadata.xml');
  });

  it('should sets metadata urls when datasetId is not exists', () => {
    component.selfLink = 'https://dev.dane.gov.pl/pl/1.4';
    fixture.detectChanges();
    component.setMetadataUrls();
    expect(component.selfApiRdf).toBe('https://dev.dane.gov.pl/pl/1.4/catalog.rdf');
    expect(component.selfApiCsv).toBe('https://dev.dane.gov.pl/pl/1.4/datasets/resources/metadata.csv');
    expect(component.selfApiXml).toBe('https://dev.dane.gov.pl/pl/1.4/datasets/resources/metadata.xml');
  });
});
