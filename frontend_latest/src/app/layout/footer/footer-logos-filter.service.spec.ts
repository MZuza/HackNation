import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { IWidgetSvg } from '@app/services/models/cms/widgets/widget-svg';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';

describe('FooterLogosFilterService', () => {
  let service: FooterLogosFilterService;
  const elements: IWidgetSvg[] = [
    {
      'type': WidgetType.SVG,
      'value': {
        'title': 'Normal',
        'download_url': 'https://cms.dane.gov.pl/media/documents/fe-pc-left-pl.svg'
      },
      'id': '73695826-2ce9-405e-be6c-e9b235dc3687'
    } as IWidgetSvg,
    {
      'type': WidgetType.SVG,
      'value': {
        'title': 'BW1 [black-white]',
        'download_url': 'https://cms.dane.gov.pl/media/documents/rp-left-pl.svg'
      },
      'id': '449c391f-9556-403e-a7a6-7d07fcdbd048'
    } as IWidgetSvg,
    {
      'type': WidgetType.SVG,
      'value': {
        'title': 'BW2 [black-white]',
        'download_url': 'https://cms.dane.gov.pl/media/documents/rp-left-pl.svg'
      },
      'id': '449c391f-9556-403e-a7a6-7d07fcdbd048'
    } as IWidgetSvg,
    {
      'type': WidgetType.SVG,
      'value': {
        'title': 'BY1 [black-yellow]',
        'download_url': 'https://cms.dane.gov.pl/media/documents/eu-efrp-right-pl_sV5I2rs.svg'
      },
      'id': 'ed843bcd-68fe-496a-b662-090afdca67da'
    } as IWidgetSvg,
    {
      'type': WidgetType.SVG,
      'value': {
        'title': 'BY2 [black-yellow]',
        'download_url': 'https://cms.dane.gov.pl/media/documents/eu-efrp-right-pl_sV5I2rs.svg'
      },
      'id': 'ed843bcd-68fe-496a-b662-090afdca67da'
    } as IWidgetSvg
  ];

  let currentContrastMode: HighContrastModeEnum = HighContrastModeEnum.NORMAL;

  beforeEach(() => {

    const HighContrastServiceMock = {
      getCurrentContrastMode: () => {
        return of(currentContrastMode);
      },
    };
    TestBed.configureTestingModule({
      providers: [FooterLogosFilterService, {provide: HighContrastService, useValue: HighContrastServiceMock}],
    });
    service = TestBed.inject(FooterLogosFilterService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter normal', (done: jest.DoneCallback) => {
    service.filter(elements).subscribe(filter => {
      expect(filter.length).toEqual(1);
      expect(filter[0].value.title).toEqual('Normal');
      done();
    });

  });

  it('should filter black-yellow', (done: jest.DoneCallback) => {

    currentContrastMode = HighContrastModeEnum.BLACK_YELLOW;
    service.filter(elements).subscribe(filter => {
      expect(filter.length).toEqual(2);
      expect(filter[0].value.title).toEqual('BY1');
      expect(filter[1].value.title).toEqual('BY2');
      done();
    });

  });

  it('should filter BLACK_WHITE', (done: jest.DoneCallback) => {

    currentContrastMode = HighContrastModeEnum.BLACK_WHITE;
    service.filter(elements).subscribe(filter => {
      expect(filter.length).toEqual(2);
      expect(filter[0].value.title).toEqual('BW1');
      expect(filter[1].value.title).toEqual('BW2');
      done();
    });

  });

  it('should filter YELLOW_BLACK as normal', (done: jest.DoneCallback) => {

    currentContrastMode = HighContrastModeEnum.YELLOW_BLACK;

    service.filter(elements).subscribe(filter => {
      expect(filter.length).toEqual(1);
      expect(filter[0].value.title).toEqual('Normal');

      currentContrastMode = HighContrastModeEnum.NORMAL;
      service.filter(elements).subscribe(filteredNormal => {
        expect(filteredNormal.length).toEqual(1);
        expect(filteredNormal[0].value.title).toEqual('Normal');
        done();
      });
    });
  });
});
