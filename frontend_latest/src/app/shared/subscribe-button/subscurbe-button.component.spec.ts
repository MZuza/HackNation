import { Overlay } from '@angular/cdk/overlay';
import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { BehaviorSubject } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { UserService } from '@app/services/user.service';
import { SubscribeButtonComponent } from '@app/shared/subscribe-button/subscribe-button.component';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

class MockkFeatureFlagService {
  featureFlags = new BehaviorSubject([]);

  isFlagEnabled = true;

  validateFlag(...args): boolean {
    return this.isFlagEnabled;
  }

  setFlag(isEnabled: boolean) {
    this.isFlagEnabled = isEnabled;
  }
}

const MOCK_ITEM_WITHOUT_SUBSCRIPTION = {
  attributes: {
    source: {
      url: 'https://kdr.mpips.gov.pl/KDR-metadane-partnerzy.xml',
      update_frequency: 'co tydzień',
      last_import_timestamp: '2021-03-19T12:12:21.480961+00:00',
      type: 'xml',
      title: 'PROD 1.0',
    },
    model: 'dataset',
    notes: 'Zbiór zawiera plik CSV z danymi oddziałów partnerów programu SI KDR',
    verified: '2021-03-19T12:12:23.486776+00:00',
    slug: 'si-kdr-wykaz-oddziaow-partnerow-programu',
    created: '2021-03-19T12:12:22.865985+00:00',
    categories: [
      {
        title: 'Ludność i społeczeństwo',
        description:
          'This concept identifies datasets covering such domains as population or society. Population is a collection of humans and their entire race; it is the number of people in a city or town, region, country or world. A society is a group of individuals involved in persistent social interaction, or a large social group sharing the same spatial or social territory, typically subject to the same political authority and dominant cultural expectations. Dataset examples: Population density by NUTS 2 region; Violence against Women: An EU-wide survey.',
        id: '146',
        code: 'SOCI',
        image_url: null,
      },
    ],
    image_alt: '',
    keywords: ['oddział', 'partner', 'KDR'],
    category: {
      title: 'Praca i Pomoc Społeczna',
      description: '{}',
      id: '5',
      image_url: 'https://int.dane.gov.pl/media/images/common/2015-05-18-152059.250972praca-pomoc-spoleczna.png',
    },
    visualization_types: [],
    tags: [],
    modified: '2021-03-19T01:40:32+00:00',
    title: 'SI KDR - wykaz oddziałów partnerów programu',
  },
  type: 'common',
  links: { self: 'https://api.int.dane.gov.pl/datasets/2060,si-kdr-wykaz-oddziaow-partnerow-programu' },
  relationships: {
    institution: {
      data: { id: '41', type: 'institution' },
      links: { related: 'https://api.int.dane.gov.pl/1.4/institutions/41,ministerstwo-energii' },
    },
  },
  id: '2060',
  institution: { doc_count: 191, id: '41', title: 'Ministerstwo Energii', slug: 'ministerstwo-energii' },
  url: '../../dataset/2060,si-kdr-wykaz-oddziaow-partnerow-programu',
  titleTranslationKey: 'Datasets.Single',
  detailsData: [{ titleTranslationKey: 'Attribute.UpdateDate', data: '2021-03-19T12:12:23.486776+00:00', isDate: true }],
};

const MOCK_ITEM_WITH_SUBSCRIPTION = {
  attributes: {
    source: {
      url: 'http://otwartedane.gdynia.pl/en/',
      update_frequency: 'codziennie',
      last_import_timestamp: '2021-03-25T03:00:01.378248+00:00',
      type: 'ckan',
      title: 'OTWARTE DANE Gdynia',
    },
    model: 'dataset',
    notes:
      'Dane statystyczne wytwarzane wg przepisów odrębnych\r\n\r\n- d – powierzchnia dróg publicznych na terenie gminy wg danej z końca roku ubiegłego [m2]\r\n- p – powierzchnia użytkowa zabudowy mieszkalnej na terenie gminy wg danej z końca roku ubiegłego [m2]',
    verified: '2021-03-23T09:46:42.169349+00:00',
    slug: 'dane-statystyczne-wytwarzane-wg-przepisow-odrebnych',
    created: '2021-03-23T09:45:43.688627+00:00',
    categories: [
      {
        title: 'Rolnictwo, rybołówstwo, leśnictwo i żywność',
        description:
          'This concept identifies datasets covering such domains as agriculture, fisheries, forestry or food. Agriculture is the science and art of cultivating plants and livestock. Fisheries are activities leading to harvesting of fish; may involve capture of wild fish or raising of fish through aquaculture. Forestry is the science and craft of creating, managing, using, conserving and repairing forests, woodlands and associated resources for human and environmental benefits. Food is any substance consumed to provide nutritional support for an organism. Dataset examples: Agricultural and Vegetable Catalogue; The Community Fishing Fleet Register; Pan-European Map of Forest Biomass Increment; Food composition database for nutrient intake: selected vitamins and minerals in selected European countries.',
        id: '139',
        code: 'AGRI',
        image_url: null,
      },
      {
        title: 'Energia',
        description:
          'This concept identifies datasets covering the domain of energy. Energy is the quantitative property that must be transferred to an object in order to perform work on, or to heat, the object. Living organisms require energy to stay alive; human civilisation requires energy to function. Dataset examples: European gas market reports; Electricity prices by type of user.',
        id: '142',
        code: 'ENER',
        image_url: null,
      },
    ],
    image_alt: '',
    keywords: [],
    category: {
      title: 'Sport i Turystyka',
      description: '{}',
      id: '8',
      image_url: 'https://int.dane.gov.pl/media/images/common/2015-05-18-152059.683653sport-turystyka.png',
    },
    visualization_types: [],
    tags: [],
    modified: '2021-03-23T09:46:42.567904+00:00',
    title: 'Dane statystyczne wytwarzane wg przepisów odrębnych',
  },
  type: 'common',
  links: { self: 'https://api.int.dane.gov.pl/datasets/2062,dane-statystyczne-wytwarzane-wg-przepisow-odrebnych' },
  relationships: {
    subscription: {
      data: { id: '282', type: 'subscription' },
      links: { related: 'https://api.int.dane.gov.pl/1.4/auth/subscriptions/282' },
    },
    institution: {
      data: { id: '295', type: 'institution' },
      links: { related: 'https://api.int.dane.gov.pl/1.4/institutions/295,zarzad-drog-i-zieleni' },
    },
  },
  id: '2062',
  institution: { doc_count: 2, id: '295', title: 'Zarząd Dróg i Zieleni', slug: 'zarzad-drog-i-zieleni' },
  url: '../../dataset/2062,dane-statystyczne-wytwarzane-wg-przepisow-odrebnych',
  titleTranslationKey: 'Datasets.Single',
  detailsData: [{ titleTranslationKey: 'Attribute.UpdateDate', data: '2021-03-23T09:46:42.169349+00:00', isDate: true }],
};

class MockUserService {}

class MockObserveService {}

describe('Subscribe button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          parser: {
            provide: TranslateParser,
            useClass: TranslateICUParser,
          },
          defaultLanguage: 'pl',
          useDefaultLang: true,
        }),
        SubscribeButtonComponent,
        TooltipDirective
      ],
      providers: [
        { provide: FeatureFlagService, useClass: MockkFeatureFlagService },
        { provide: UserService, useClass: MockUserService },
        NotificationsService,
        NotificationsFrontService,
        Overlay,
        { provide: ObserveService, useClass: MockObserveService },
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(SubscribeButtonComponent);
    const subscribeButtonComponent = fixture.componentInstance;
    expect(subscribeButtonComponent).toBeTruthy();
  });

  it('should render subscribe button when item isn\'t subscribed', () => {
    const fixture = TestBed.createComponent(SubscribeButtonComponent);
    const component = fixture.componentInstance;
    component.item = MOCK_ITEM_WITHOUT_SUBSCRIPTION;

    fixture.detectChanges();

    const subscribeButton = fixture.debugElement.query(By.css('.btn:not(.btn-danger)'));
    const unsubscribeButton = fixture.debugElement.query(By.css('.btn-danger'));

    expect(subscribeButton).toBeTruthy();
    expect(unsubscribeButton).toBeFalsy();
  });

  it('should render unsubscribe button when item is subscribed', () => {
    const fixture = TestBed.createComponent(SubscribeButtonComponent);
    const component = fixture.componentInstance;
    component.item = MOCK_ITEM_WITH_SUBSCRIPTION;

    fixture.detectChanges();

    const subscribeButton = fixture.debugElement.query(By.css('.btn:not(.btn-danger)'));
    const unsubscribeButton = fixture.debugElement.query(By.css('.btn-danger'));

    expect(unsubscribeButton).toBeTruthy();
    expect(subscribeButton).toBeFalsy();
  });

  it('should unsubscribe item on subscribed item click', () => {
    const fixture = TestBed.createComponent(SubscribeButtonComponent);
    const component = fixture.componentInstance;
    component.item = MOCK_ITEM_WITH_SUBSCRIPTION;

    fixture.detectChanges();

    const unsubscribeButton = fixture.debugElement.query(By.css('.btn-danger'));

    const unsubscribeMock = jest.spyOn(component, 'removeSubscription').mockImplementation(() => {});

    unsubscribeButton.triggerEventHandler('click', {});

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('should subscribe item on unsubscribed item click', () => {
    const fixture = TestBed.createComponent(SubscribeButtonComponent);
    const component = fixture.componentInstance;
    component.item = MOCK_ITEM_WITHOUT_SUBSCRIPTION;

    fixture.detectChanges();

    const subscribeButton = fixture.debugElement.query(By.css('.btn:not(.btn-danger)'));

    const subscribeMock = jest.spyOn(component, 'addSubscription').mockImplementation(() => {});

    subscribeButton.triggerEventHandler('click', {});

    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });
});
