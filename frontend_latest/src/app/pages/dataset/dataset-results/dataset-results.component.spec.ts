import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { SharedModule } from '@app/shared/shared.module';

describe('DefaultResultItemComponent ', () => {
  let component: DatasetResultsComponent;
  let fixture: ComponentFixture<DatasetResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, DatasetResultsComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
