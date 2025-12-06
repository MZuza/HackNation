import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

import { RestService } from '@app/services/rest.service';
import { StringHelper } from '@app/shared/helpers/string.helper';
import {
  ForumBadge,
  ForumCategory,
  ForumNotification,
  ForumNotificationWithBadge,
  ForumResourceType,
  ForumTopic,
  ForumTopicWithCategory,
} from '@app/user/forum/forum.enum';
import { UserService } from '@app/services/user.service';
import { LoginService } from '@app/services/login-service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Forum Service
 */
@Injectable({
  providedIn: 'root',
})
export class DiscourseService extends RestService {
  /**
   * List of all badges
   */
  badges$: Observable<ForumBadge[]>;

  /**
   * Latest notifications
   */
  notifications$: Observable<ForumNotification[]>;

  /**
   * Topic/post categories
   */
  categories$: Observable<ForumCategory[]>;

  /**
   * Latest topics
   */
  latestTopics$: Observable<ForumTopic[]>;

  /**
   * Environment
   */
  env = '';

  /**
   * Api key
   */
  apiKey: string;

  /**
   * Api username
   */
  apiUsername: string;

  /**
   * Http credentials headers
   */
  httpCredentials: object;

  /**
   * @ignore
   */
  constructor(
    protected http: HttpClient,
    public translate: TranslateService,
    public router: Router,
    public notificationService: NotificationsService,
    public storageService: LocalStorageService,
    public cookieService: CookieService,
    public loginService: LoginService,
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) public platformId: string,
    private readonly userService: UserService,
  ) {
    super(http, translate, router, notificationService, storageService, cookieService, loginService, document, platformId);
  }

  /**
   * Sets discourse credentials
   */
  setDiscourseCredentials() {
    this.apiKey = this.userService.getTokenData().user.discourse_api_key;
    this.apiUsername = this.userService.getTokenData().user.discourse_user_name;
    this.httpCredentials = {
      headers: new HttpHeaders({
        'Api-Key': this.apiKey,
        'Api-Username': this.apiUsername,
      }),
    };
  }

  /**
   * Clears discourse credentials
   */
  clearDiscourseCredentials() {
    this.apiKey = null;
    this.apiUsername = null;
    this.httpCredentials = {};
  }

  /**
   * Gets badges
   * @returns {Observable<ForumBadge[]>} badges
   */
  getBadges(): Observable<ForumBadge[]> {
    // https://forum.szkolenia.dane.gov.pl/badges.json
    return this.http
      .get(this.buildUrl(ForumResourceType.BADGES), this.httpCredentials)
      .pipe(map(badgesResponse => badgesResponse[ForumResourceType.BADGES]));
  }

  /**
   * Updates badges
   * @param {ForumBadge[]} badges
   * @returns {ForumBadge[]}
   */
  private updateBadges(badges: ForumBadge[]): ForumBadge[] {
    return badges
      .map(badge => {
        const iconArray = badge.icon.split('-');
        iconArray[0] = 'fa';

        return {
          ...badge,
          fa_icon: StringHelper.toCamelCase(iconArray.join('-')),
        };
      })
      .sort((a, b) => (a.id > b.id ? 0 : -1));
  }

  /**
   * Gets notifications
   * @returns {Observable<ForumNotification[]>} notifications
   */
  getNotifications(): Observable<ForumNotification[]> {
    // https://forum.szkolenia.dane.gov.pl/notifications.json?username=kamil&filter=read
    const httpOptions = {
      ...this.httpCredentials,
      params: new HttpParams({ fromObject: { username: this.apiUsername, filter: 'unread' } }),
    };

    return this.http
      .get(this.buildUrl(ForumResourceType.NOTIFICATIONS), httpOptions)
      .pipe(map(forumNotificationsResponse => forumNotificationsResponse[ForumResourceType.NOTIFICATIONS]));
  }

  /**
   * Gets notifications with badges
   * @returns {Observable<ForumNotificationWithBadge[]>} notifications with badges
   */
  getNotificationsWithBadges(): Observable<ForumNotificationWithBadge[]> {
    return combineLatest([this.getBadges(), this.getNotifications()]).pipe(
      map(([badges, notifications]) => {
        const updatedBadges = this.updateBadges(badges);

        return notifications.map(notification => {
          const badgeId = notification.data?.badge_id ? notification.data?.badge_id : notification.notification_type;

          return {
            ...notification,
            badge: updatedBadges.find(badge => badge.id === badgeId),
          };
        });
      }),
    );
  }

  /**
   * Gets categories
   * @returns {Observable<ForumCategory[]>} categories
   */
  getCategories(): Observable<ForumCategory[]> {
    // https://forum.dev.dane.gov.pl/categories.json
    return this.http
      .get(this.buildUrl(ForumResourceType.CATEGORIES), this.httpCredentials)
      .pipe(map(categoriesResponse => categoriesResponse['category_list'][ForumResourceType.CATEGORIES]));
  }

  /**
   * Gets latest topics
   * @param {number} [offset]
   * @returns {Observable<ForumTopic[]>} lates topics
   */
  getLatestTopics(offset = 3): Observable<ForumTopic[]> {
    // https://forum.dev.dane.gov.pl/latest.json
    return this.http
      .get(this.buildUrl(ForumResourceType.LATEST), this.httpCredentials)
      .pipe(map(latestTopicsResponse => latestTopicsResponse['topic_list']['topics'].slice(0, offset)));
  }

  /**
   * Gets latest topics with categories
   * @param {number} [offset]
   * @returns {Observable<ForumTopicWithCategory[]>} latest topics with categories
   */
  getLatestTopicsWithCategories(offset?: number): Observable<ForumTopicWithCategory[]> {
    return combineLatest([this.getCategories(), this.getLatestTopics(offset)]).pipe(
      map(([categories, latestTopics]) => {
        return latestTopics.map(topic => {
          return {
            ...topic,
            category: categories.find(category => category.id === topic.category_id),
          };
        });
      }),
    );
  }

  /**
   * Marks notifications as read
   */
  markNotificationsAsRead() {
    return this.http.put(this.buildUrl(ForumResourceType.NOTIFICATIONS + '/' + ForumResourceType.MARK_READ), {}, this.httpCredentials);
  }

  /**
   * Builds url
   * @param {string} resource
   * @returns {string}
   */
  buildUrl(resource: string): string {
    this.setEnv();
    return `//forum.${this.env}dane.gov.pl/${resource}.json`;
  }

  /**
   * Sets environment variable
   */
  private setEnv() {
    switch (this.document.location.hostname) {
      case 'localhost':
      case 'int.dane.gov.pl':
        this.env = 'int.';
        break;
      case 'dev.dane.gov.pl':
        this.env = 'dev.';
        break;
      case 'szkolenia.dane.gov.pl':
        this.env = 'szkolenia.';
        break;
      case 'dane.gov.pl':
        this.env = '';
        break;
      default:
        this.env = '';
    }
  }
}
