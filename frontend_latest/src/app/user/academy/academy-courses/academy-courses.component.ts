import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDashboardListViewComponent } from '../../list-view/user-dashboard-list-view.component';

import { ApiConfig } from '@app/services/api';
import { SeoService } from '@app/services/seo.service';
import { AcademyCoursesListContainerComponent } from '@app/user/academy/academy-courses/academy-courses-list/academy-courses-list-container.component';
import { AodCourseType } from '@app/user/academy/academy-courses/AodCourseType';
import { API_URL } from '@app/user/list-view/API_URL';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';

/**
 * Academy Courses Component
 */
@Component({
    selector: 'app-academy-courses',
    templateUrl: './academy-courses.component.html',
    providers: [{ provide: API_URL, useValue: ApiConfig.aodCourses }],
    standalone: true,
    imports: [UserDashboardListViewComponent, TranslatePipe],
})
export class AcademyCoursesComponent implements OnInit {
  courseComponent: any = AcademyCoursesListContainerComponent;
  config: UserDashboardListViewConfig;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setPageTitle(['Kursy', 'Akademia Otwartych Danych', 'Mój Pulpit']);

    this.setupListConfig();
  }

  private setupListConfig() {
    this.config = new UserDashboardListViewConfig.builder()
      .default()
      .withSort('start')
      .withFoundedItemsCountHeader('Aod.Courses')
      .withFilterConfig({
        filterType: AodCourseType,
        selectedFilters: [AodCourseType.PLANNED.toString(), AodCourseType.CURRENT.toString(), AodCourseType.FINISHED.toString()],
        title: 'Aod.CoursesStatus',
      })
      .build();
  }
}
