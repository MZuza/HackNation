import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { FooterNavListComponent } from '@app/layout/footer/footer-nav-list/footer-nav-list.component';

describe('FooterNavListComponent', () => {
  let component: FooterNavListComponent;
  let fixture: ComponentFixture<FooterNavListComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), FooterNavListComponent],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
