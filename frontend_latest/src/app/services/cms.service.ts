import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiCmsConfig, CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { LandingPageStyleService } from '@app/services/landing-page-style.service';
import { CmsRequestOptions } from '@app/services/models/cms/cms-request-options';
import { IRawTextDocumentMetadata } from '@app/services/models/cms/controls/raw-text/raw-text-object';
import { ICmsForm } from '@app/services/models/cms/forms/cms-form';
import { IPageCms } from '@app/services/models/cms/page-cms';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { INewsPageParams } from '@app/services/models/page-params';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/operators';

/**
 * Cms Service that handles communication with CMS
 */
@Injectable({
  providedIn: 'root',
})
export class CmsService {
  /**
   * List of cms documents
   */
  private cmsDocumentsList: any;

  /**
   * Hostname dependent on the environment
   */
  private readonly base_hostname: string;

  elementFooterNavIsExist: Subject<boolean> = new Subject<boolean>();
  isElementFooterNavExist: boolean;

  /**
   * @ignore
   */
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private landingPageStyleService: LandingPageStyleService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: any,
  ) {
    if (!environment.production) {
      this.base_hostname = ApiCmsConfig.CMS_PREFIX;
    } else {
      this.base_hostname = this.document.location.protocol + '//cms.' + this.document.location.hostname.replace('www.', '');
    }
    this.elementFooterNavIsExist.subscribe(value => {
      this.isElementFooterNavExist = value;
    });

    // TODO CMS fix when endpoint /documents return
    // this.http.get(`${this.base_hostname}/api/documents/`)
    //     .subscribe((resp: any) => this.cmsDocumentsList = resp);
  }

  /**
   * General method to get any element from CMS.
   * @param {string} url
   * @param {CmsRequestOptions} options
   * @return {Observable<any>}
   */
  get(url: string, options?: CmsRequestOptions): Observable<any> {
    return this.http.get(this.createUrl(url), options);
  }

  /**
   * General method to check if footer navigation is existed
   * @param {boolean} isVisible
   */
  footerNavIsExist(isVisible: boolean) {
    this.elementFooterNavIsExist.next(isVisible);
  }

  /**
   * General method to get all News/Articles from CMS
   * @param {INewsPageParams} params
   */
  getAllNewsWidgets(params: INewsPageParams): Observable<any> {
    const url = `${this.base_hostname}${ApiCmsConfig.BASE_URL}${CmsHardcodedPages.NEWS}/`;
    return this.http.get(url, { ...this.getCredentials(), params: params }).pipe(
      map(resp => {
        return {
          data: resp['meta'].children.map(child => {
            return {
              attributes: {
                author: child.author,
                created: child.meta.first_published_at,
                modify: child.meta.last_published_at,
                title: child.title,
                notes: child.body,
                keywords: child.tags,
                slug: child.meta.slug,
                html_url: child.meta.html_url,
                url_path: child.meta.url_path,
              },
            };
          }),
          children_count: resp['meta'].children_count,
        };
      }),
    );
  }

  /**
   * General method to get specific News/Article from CMS
   * @param {string} id
   */
  getNewsWidgets(id: string): Observable<any> {
    const url = `${this.base_hostname}${ApiCmsConfig.BASE_URL}${CmsHardcodedPages.NEWS}/${id}/`;
    return this.http.get(url, this.getCredentials()).pipe(
      map(resp => {
        return {
          attributes: {
            author: resp['author'],
            created: resp['meta'].first_published_at,
            modify: resp['meta'].last_published_at,
            title: resp['title'],
            notes: resp['body'],
            keywords: resp['tags'],
            slug: resp['meta'].slug,
          },
        };
      }),
    );
  }

  /**
   * General method to get any element from CMS.
   * @param {string} relativeUrl
   * @return {Observable<any>}
   */
  getHomePageWidgets(): Observable<any> {
    const url = `${this.base_hostname}${ApiCmsConfig.BASE_URL}${ApiCmsConfig.HOME_PAGE}/?lang=${this.translate.currentLang}`;
    return this.http.get(url, this.getCredentials());
  }

  /**
   * Gets meta data image from CMS.
   * @param id image in CMS
   * @return {Observable<any>}
   */
  getImageMetaData(id: number): Observable<any> {
    const url = ApiCmsConfig.IMAGES + id + '/';
    return this.get(url, this.getCredentials());
  }

  /**
   * Gets a physical image from CMS.
   * @param url image
   */
  getImage(url: string) {
    return this.http.get(this.base_hostname + url, { ...this.getCredentials(), responseType: 'blob' }).pipe(
      map(response => {
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
      }),
    );
  }

  /**
   * Gets hostname.
   * @return {string}
   */
  getHostName(): string {
    return this.base_hostname;
  }

  /**
   * Gets document metadata.
   * @id {string}
   * @return {IRawTextDocumentMetadata}
   */
  getDocumentMetadata(id: string): IRawTextDocumentMetadata {
    const foundDocument = this.cmsDocumentsList.items.find(element => element.id.toString() === id);

    if (!foundDocument) {
      return { id: null, href: null };
    }

    const filename = foundDocument.meta.download_url.split('/').pop();
    return {
      id: foundDocument.id,
      href: `${this.base_hostname}/documents/${foundDocument.id}/${filename}`,
    };
  }

  /**
   * Adds a css style to the widget.
   * @param widget to which a style is added
   * @param {string} origin of widget
   */
  addStyle(widget: IWidget, origin?: 'any' | 'hyperEditor') {
    return this.landingPageStyleService.addStyle(widget, origin);
  }

  /**
   * Get Landing Page in the current language from CMS
   * @param {string} relativeUrl
   * @param {string} lang
   * @param {string} revision
   * @return {Observable<any>}
   */
  getLandingPage(relativeUrl: string, lang: string = this.translate.currentLang, revision?: string): Observable<IPageCms> {
    const landingPageUrl = this.getUrl(relativeUrl);
    const params = this.createParamsObj(lang, revision);

    if (params.has('rev') && isPlatformServer(this.platformId)) {
      return of();
    }

    return this.http.get<IPageCms>(landingPageUrl, { ...this.getCredentials(), params: params }).pipe(
      map(page => {
        return {
          ...page,
          type: WidgetType.TEXT,
        };
      }),
    );
  }

  /**
   * Get Simple Page in the current language
   * @param {string} relativeUrl
   * @param {string} lang
   * @param {string} revision
   * @return {Observable<any>}
   */
  getSimplePage(relativeUrl: string, lang: string = this.translate.currentLang, revision?: string): Observable<any> {
    const simplePageUrl = this.getUrl(relativeUrl);
    const params = this.createParamsObj(lang, revision);

    return this.http.get<IPageCms>(simplePageUrl, { ...this.getCredentials(), params: params }).pipe(
      map(page => {
        return {
          ...page,
          type: WidgetType.TEXT,
          value: page.body,
        };
      }),
    );
  }

  /**
   * Get Forms page
   * @param {string} relativeUrl
   * @param {string} lang
   * @param {string} revision
   * @return {Observable<any>}
   */
  getForms(relativeUrl: string, lang: string = this.translate.currentLang, revision?: string): Observable<any> {
    const formsPageUrl = this.getUrl(relativeUrl);
    const params = this.createParamsObj(lang, revision);
    return this.http.get<ICmsForm>(formsPageUrl, { ...this.getCredentials(), params: params });
  }

  /**
   * Get slug from url
   * @param {string} url
   * @param {FormData} payload
   * @return {Observable<any>}
   */
  sendForm(url: string, payload: { [key: string]: any }): Observable<any> {
    return this.http.post(url, payload);
  }

  /**
   * Displays warning for CMS errors
   * @param {string} url
   * @param {FormData} message
   */
  displayCmsErrorMessage(url: string, message: string) {
    console.warn(`Page "${url}" does not exist in CMS system: ${message}`);
  }

  /**
   * Creates url
   * @param {string} relativeUrl
   * @return {string}
   */
  private createUrl(relativeUrl: string): string {
    return this.base_hostname + ApiCmsConfig.BASE_URL + relativeUrl;
  }

  /**
   * Creates url for new APi version
   * @param {string} url
   * @return {string}
   */
  private getUrl(url: string): string {
    const urlWithCutParams = url.split('?').shift();
    return `${this.base_hostname}${ApiCmsConfig.BASE_URL}${ApiCmsConfig.HOME_PAGE}${urlWithCutParams}/`;
  }

  /**
   * Create http params objects used in static pages and forms CMS Api requests
   * @param {string} lang
   * @param {string} revision
   * @return {HttpParams}
   */
  private createParamsObj(lang: string, revision?: string): HttpParams {
    let paramsObj: any = { lang: lang };
    if (revision) {
      paramsObj = { ...paramsObj, rev: revision };
    }
    return new HttpParams({
      fromObject: paramsObj,
    });
  }

  /**
   * Gets credentials based on current environment
   * @returns {{withCredentials: boolean}}
   */
  getCredentials(): { [key: string]: boolean } {
    let hasCredentials: boolean;
    switch (this.document.location.hostname) {
      case 'localhost':
      case 'dev.dane.gov.pl':
        hasCredentials = false;
        break;
      default:
        hasCredentials = true;
    }

    return {
      withCredentials: hasCredentials,
    };
  }
}
