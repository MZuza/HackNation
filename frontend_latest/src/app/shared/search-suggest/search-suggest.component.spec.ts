import { ElementRef, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { ApiModel } from '@app/services/api/api-model';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchSuggestionsService } from '@app/services/search-suggestions.service';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

class LocalizeRouterServiceStub {}

describe('SearchSuggestComponent', () => {
  let component: SearchSuggestComponent;
  let fixture: ComponentFixture<SearchSuggestComponent>;
  let service: SearchSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        SearchSuggestComponent
      ],
      providers: [
        SearchSuggestionsService,
        NotificationsService,
        { provide: LocalizeRouterService, useClass: LocalizeRouterServiceStub },
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(SearchSuggestionsService);
    fixture = TestBed.createComponent(SearchSuggestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should populates suggestions list, toggles suggestions list, reset active descendant index', () => {
    const item = [{ title: 'test', url: 'localhost' }];
    component.toggleDropdown(item);
    expect(component.listBoxOptions).toEqual(item);
    expect(component.isListBoxExpanded).toBe(true);
  });

  it('should creates listbox option from a data item of the api response for ApiModel.ARTICLE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.ARTICLE, slug: 'articles' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/article/2,articles', areaTranslationKey: 'Articles.News' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.SHOWCASE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.SHOWCASE, slug: 'showcases' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/showcase/2,showcases', areaTranslationKey: 'Menu.Showcases' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.KNOWLEDGE_BASE', () => {
    const item = {
      attributes: { title: 'test', model: ApiModel.KNOWLEDGE_BASE, slug: 'knowledge_base', html_url: 'pl/knowledgebase/useful-materials/' },
      id: '2',
    };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/knowledgebase/useful-materials', areaTranslationKey: 'KnowledgeBase.Self' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.NEWS', () => {
    const item = { attributes: { title: 'test', model: ApiModel.NEWS, slug: 'news' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/article/news', areaTranslationKey: 'Articles.News' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.RESOURCE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.RESOURCE, slug: 'resource' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/resource/2,resource', areaTranslationKey: 'Resources.Self' });
  });

  it('should parses knowledge base url', () => {
    const url = 'pl/knowledgebase/useful-materials/';
    const returnValue = component.parseKnowledgeBaseUrl(url);
    expect(returnValue).toBe('/knowledgebase/useful-materials');
  });

  it('should prepares listbox options', () => {
    const item = [{ attributes: { title: 'test', model: ApiModel.NEWS, slug: 'news' }, id: '2' }];
    const returnValue = component.prepareListboxOptions(item);
    expect(returnValue).toStrictEqual([{ title: 'test', url: '/article/news', areaTranslationKey: 'Articles.News' }]);
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key ArrowDown', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const spyFunction = jest.spyOn(component, 'setNextActiveSuggestionIndex');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key ArrowUp', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const spyFunction = jest.spyOn(component, 'setPreviousActiveSuggestionIndex');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key Enter', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spyFunction = jest.spyOn(component, 'onActiveSuggestionClick');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key Tab', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(component.isListBoxExpanded).toBeTruthy();
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key Space', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space', shiftKey: true });
    const spyFunction = jest.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
    expect(component.isListBoxExpanded).toBeTruthy();
  });

  it('should enables keyboard navigation. Performs actions on keyboard events - key Escape', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(component.isListBoxExpanded).toBeFalsy();
  });

  it('should conditionally show suggestion list when input has focus', () => {
    component.onFocusIn();
    expect(component.isSearchQueryInvalid).toBeFalsy();
  });

  it('should sets next index on the list as active when activeSuggestionIndex === notSelectedSuggestionIndex', () => {
    component.setNextActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(0);
  });

  it('should sets next index on the list as active when activeSuggestionIndex === listBoxOptions.length - 1', () => {
    component.activeSuggestionIndex = 0;
    component.listBoxOptions = ['list1'];
    component.setNextActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(component.notSelectedSuggestionIndex);
  });

  it('should sets next index on the list as active when activeSuggestionIndex !== notSelectedSuggestionIndex', () => {
    component.notSelectedSuggestionIndex = 1;
    component.activeSuggestionIndex = 2;
    component.setNextActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(3);
  });

  it('should sets previous index on the list as active when activeSuggestionIndex === notSelectedSuggestionIndex', () => {
    component.setPreviousActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(-1);
  });

  it('should sets previous index on the list as active when activeSuggestionIndex = 0', () => {
    component.activeSuggestionIndex = 0;
    component.setPreviousActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(component.notSelectedSuggestionIndex);
  });

  it('should sets previous index on the list as active when activeSuggestionIndex !== notSelectedSuggestionIndex', () => {
    component.activeSuggestionIndex = 2;
    component.setPreviousActiveSuggestionIndex();
    expect(component.activeSuggestionIndex).toEqual(1);
  });

  it('should navigates to a details of the active item on the suggestion list', () => {
    component.onActiveSuggestionClick();
    expect(component.activeSuggestionIndex).toEqual(component.notSelectedSuggestionIndex);
  });

  it('should emit event click to move into search results for screen reader', () => {
    jest.spyOn(component.moveToSearchResultTrigger, 'emit');
    component.emitMoveToSearchResult();
    expect(component.moveToSearchResultTrigger.emit).toHaveBeenCalled();
  });

  it('should chose and emit of the active item on the suggestion region list', () => {
    component.onSuggestionSearchClick();
    expect(component.activeSuggestionIndex).toEqual(component.notSelectedSuggestionIndex);
  });

  it('should chose and emit of the ' +
    'active item on the suggestion region list when activeSuggestionIndex != notSelectedSuggestionIndex', () => {
    jest.spyOn(component.regionListboxOption, 'emit');
    component.listBoxOptions = ['option1', 'option2'];
    component.activeSuggestionIndex = 1;
    component.onSuggestionSearchClick();
    expect(component.regionListboxOption.emit).toHaveBeenCalled();
    expect(component.listBoxOptions).toEqual([]);
  });

  it('should clears query input and sets focus on it.', () => {
    component.queryInputRef = new ElementRef({ focus() {} });
    const spyFunction = jest.spyOn(component.queryInputRef.nativeElement, 'focus');
    component.onClear();
    expect(component.searchText).toEqual('');
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should clears query input and sets focus on it with user trigger', () => {
    component.queryInputRef = new ElementRef({ focus() {} });
    component.useTriggers = true;
    const spyFunction = jest.spyOn(component.queryInputRef.nativeElement, 'focus');
    jest.spyOn(component.clearTrigger, 'emit');
    component.onClear();
    expect(component.searchText).toEqual('');
    expect(spyFunction).toHaveBeenCalled();
  });
});
