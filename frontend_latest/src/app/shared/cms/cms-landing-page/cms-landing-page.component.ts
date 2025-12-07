import { DOCUMENT, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CmsBlock2Component } from '../cms-block2/cms-block2.component';

import { CmsService } from '@app/services/cms.service';
import { IPageCms } from '@app/services/models/cms/page-cms';
import { IBanner } from '@app/services/models/cms/widgets/banner';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

/**
 * Hyper editor pages component
 */
@Component({
    selector: 'cms-landing-page',
    templateUrl: './cms-landing-page.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgClass,
        NgTemplateOutlet,
        CmsBlock2Component,
        RouterOutlet,
    ],
})
export class CmsLandingPageComponent implements OnInit, OnDestroy {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * is detail view
   */
  isDetailView = false;

  /**
   * Page slug
   */
  requestedUrl: string;

  /**
   * Page query params
   */
  queryParams: Params;

  /**
   * page css name created from slug for styling purposes
   */
  pageCmsCss: string;

  /**
   * Array of widgets to display
   */
  body: IWidget[];

  /**
   * Array of subscriptions
   */
  sub: Subscription = new Subscription();

  /**
   * Check if app was refresh, and we need data form CMS
   */
  isFirstEnter = true;

  /**
   * Widget subject for footer and header
   */
  @Input() widgetFooterSubject: BehaviorSubject<IWidget[]>;

  /**
   * @ignore
   */
  constructor(
    public cmsService: CmsService,
    public route: ActivatedRoute,
    public router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    /**
     * sets isDetailView value
     */
    this.isDetailView = this.router.url && this.router.url.split('/').length > 4;
    this.sub.add(
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isDetailView = event.url && event.url.split('/').length > 4;
          if (!this.isDetailView && !this.isFirstEnter) {
            this.setContentCmsPage();
          }
        }
      }),
    );
  }

  /**
   * if link is a first children of the element then the element is clickable and navigation to detail view should be triggered
   * @param {IWidget} section
   */
  navigateToDetail(section: IWidget) {
    const isBanner =
      section.children && section.children[0].children.length && (section.children[0].children[0] as IBanner).value?.action_url;

    if (isBanner) {
      return;
    }

    this.router.navigate([this.router.url + '/' + section.children[0].settings.url]).then();
  }

  /**
   * Get page from cms api, if page is draft, then displays it only for admin users
   */
  ngOnInit() {
    this.setContentCmsPage();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setContentCmsPage() {
    this.queryParams = { ...this.route.snapshot.queryParams };
    this.requestedUrl = this.router.url;

    this.pageCmsCss = `${this.route.snapshot.data['slug']} ${this.route.snapshot.data['cssContainerClass']}`;

    this.requestedUrl = this.router.url;
    const previewIndex = this.requestedUrl.indexOf(`/${this.routerEndpoints.PREVIEW}`);
    if (previewIndex !== -1) {
      this.requestedUrl = this.requestedUrl.substring(0, previewIndex);
    }
    this.requestedUrl = this.requestedUrl.substring(3);
    this.getPageData();
  }

  /**
   * Gets page data from API if necessary
   */
  private getPageData(): void {
    if (this.isDetailView && !this.widgetFooterSubject && !this.isFirstEnter) {
      return;
    }
    if (this.widgetFooterSubject) {
      this.sub.add(
        this.widgetFooterSubject.subscribe(response => {
          this.body = response;
          if (this.body) {
            this.findElementsWithLinks(this.body);
            this.addClassnameProperty(this.body);
          }
        }),
      );
    } else {
      this.isFirstEnter = false;
      this.cmsService.getLandingPage(this.requestedUrl, this.queryParams.lang, this.queryParams.rev).subscribe(
        (page: IPageCms) => {
          this.body = Array.isArray(page.body) ? page.body : page.body.blocks;

          if (this.body) {
            this.findElementsWithLinks(this.body);
            this.addClassnameProperty(this.body);
          }
        },
        err => {
          this.cmsService.displayCmsErrorMessage(this.requestedUrl, err.message);
          this.router.navigate(['/']).then();
        },
      );
    }
  }

  /**
   * Find element which are links
   * @param {IWidget[]} components
   */
  private findElementsWithLinks(components: IWidget[]) {
    components.forEach(component => {
      if (!component.children || !component.children.length) {
        return;
      }
      if (this.isLinkElementWithValidUrl(component)) {
        this.bindLink(component);
      }
      this.findElementsWithLinks(component.children);
    });
  }

  /**
   * Bind link from parent to children elements if widget has link type
   * @param {IWidget} component
   */
  private bindLink(component: IWidget) {
    const { origin } = this.document.location;
    const { url } = component.settings;

    if (url.indexOf(origin) !== -1) {
      component.settings.isExternalUrl = true;
    } else {
      component.settings.isExternalUrl = !!url.match(/^http(s)?:\/\//);
    }

    component.children.forEach(child => {
      if (!child.settings.url) {
        child.settings.url = component.settings.url;

        if (component.type === WidgetType.LINK) {
          if (child.type === WidgetType.TEXT) {
            component.settings.text = child.settings.text;
            if (!component.children.find(child => child.type === WidgetType.IMAGE)) {
              component.children = [];
            }
          }

          if (child.type === WidgetType.IMAGE && component.settings.title) {
            child.settings.image.title = component.settings.title;
          }
        }
      }
    });
  }

  /**
   * Add class name property to widgets
   * @param {IWidget[]} elements
   */
  private addClassnameProperty(elements: IWidget[]) {
    elements.forEach(element => {
      element.classname = element.type === 'row' ? 'row' : element.type === 'column' ? this.getColumnClassnameString(element.settings) : '';
      if (element.children && element.children.length > 0) {
        this.addClassnameProperty(element.children);
      }
    });
  }

  /**
   * Check if widget has link type and valid url
   * @param {IWidget} element
   */
  private isLinkElementWithValidUrl(element: IWidget): boolean {
    return element.type === WidgetType.LINK && !!element.settings.url;
  }

  /**
   * Build class name string
   * @param  properties
   * @return string
   */
  private getColumnClassnameString(properties): string {
    let classname = '';
    if (!properties) {
      return classname;
    }
    if (properties.sizeLG) {
      classname += `col-lg-${properties.sizeLG} `;
    }
    if (properties.sizeMD) {
      classname += `col-md-${properties.sizeMD} `;
    }
    if (properties.sizeSM) {
      classname += `col-sm-${properties.sizeSM} `;
    }
    if (properties.sizeXS) {
      classname += `col-xs-${properties.sizeXS} `;
    }
    if (properties.offsetLG) {
      classname += `offset-lg-${properties.offsetLG} `;
    }
    if (properties.offsetMD) {
      classname += `offset-md-${properties.offsetMD} `;
    }
    if (properties.offsetSM) {
      classname += `offset-sm-${properties.offsetSM} `;
    }
    if (properties.offsetXS) {
      classname += `offset-xs-${properties.offsetXS}`;
    }
    return classname;
  }
}
