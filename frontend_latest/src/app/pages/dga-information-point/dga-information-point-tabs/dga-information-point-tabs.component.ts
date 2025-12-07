import { Location, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { IMetadataPageChildrenCms } from '@app/services/models/cms/metadata-page-cms';
import { SeoService } from '@app/services/seo.service';

enum DGASortingEnum {
  DGA_INFORMATION = 'cms.DGAInformation',
  DGA_PROTECTED_DATA_LIST = 'cms.DGAProtectedDataList',
  DGA_ACCESS_APPLICATION = 'cms.DGAAccessApplication',
  DGA_NEW_SUB_PAGE = 'cms.DGANewSubPage'
}

interface IMetadataPageChildrenCmsWithCss extends IMetadataPageChildrenCms {
  css_selector: string;
}

@Component({
  selector: 'app-dga-information-point-tabs',
  templateUrl: './dga-information-point-tabs.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    NgIf,
    NgTemplateOutlet,
    NgForOf,
    RouterOutlet
  ]
})
export class DgaInformationPointTabsComponent implements OnInit {
  tabs: IMetadataPageChildrenCmsWithCss[];

  itemPositions = {
    [DGASortingEnum.DGA_INFORMATION]: 0,
    [DGASortingEnum.DGA_PROTECTED_DATA_LIST]: 1,
    [DGASortingEnum.DGA_ACCESS_APPLICATION]: 2,
    [DGASortingEnum.DGA_NEW_SUB_PAGE]: 3
  };

  detailView = false;

  constructor(
    private router: Router,
    private location: Location,
    private seoService: SeoService,
    private translateService: TranslateService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const sortedTabs = this.route.snapshot.data['post'].meta.children;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe((a: any) => {
      if (a.url === '/pl/dga') {
        this.seoService.setPageTitle(this.translateService.instant('DgaInformationPoint.Self'));
      }
    });
    this.seoService.setPageTitle(this.translateService.instant('DgaInformationPoint.Self'));
    sortedTabs.sort((a, b) => this.itemPositions[a.meta.type] - this.itemPositions[b.meta.type]);
    sortedTabs.map((tab: IMetadataPageChildrenCmsWithCss) => {
      tab.css_selector = this.giveCssSelector(tab);
    });
    this.tabs = sortedTabs;
    if (this.location.path().split('/').length > 3) {
      this.detailView = true;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.detailView = event.url && event.url.split('/').length > 3;
      }
    });
  }

  moveToPage(slug: string, type: string) {
    const currentLang = this.translateService.currentLang;
    if (type === DGASortingEnum.DGA_PROTECTED_DATA_LIST) {
      const fullTableUrl = '/' + currentLang + '/dga/' + slug + '/table';
      this.router.navigate([fullTableUrl]).then();
      return;
    }
    const fullUrl = '/' + currentLang + '/dga/' + slug;
    this.router.navigate([fullUrl]).then();
  }

  giveCssSelector(tab: IMetadataPageChildrenCms): string {
    switch (tab.meta.type) {
      case DGASortingEnum.DGA_INFORMATION:
        return 'dga-tile1';
      case DGASortingEnum.DGA_PROTECTED_DATA_LIST:
        return 'dga-tile2';
      case DGASortingEnum.DGA_ACCESS_APPLICATION:
        return 'dga-tile3';
      default:
        return '';
    }
  }

}
