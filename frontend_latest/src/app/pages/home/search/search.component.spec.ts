import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { SearchComponent } from '@app/pages/home/search/search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, SearchComponent],
      providers: [importProvidersFrom(AppTestingModule)]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.maxLength = 1000;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should redirects to dataset lists page to display results', () => {
    const testForm = <NgForm>{
      value: {
        name: 'Hello',
        category: 'World',
      },
    };
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.search(testForm);
    expect(navigateSpy).toHaveBeenCalledWith(['/dataset']);
  });

  it('should redirects to dataset lists page to display query results', () => {
    const testForm = <NgForm>{
      value: {
        name: 'Hello',
        category: 'World',
        query: 'test',
      },
    };
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.search(testForm);
    expect(navigateSpy).toHaveBeenCalledWith(['/dataset'], { queryParams: { q: 'test' } });
    expect(component.maxLength).toEqual(1000);
  });
});
