import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';
import { AvailableIFrameService } from '@app/services/available-i-frame.service';
import { PostMessageIframeService } from '@app/services/post-message-iframe.service';
import { SeoService } from '@app/services/seo.service';
import { LoaderComponent } from '@app/shared/loader/loader.component';

@Component({
    selector: 'app-stats-page',
    templateUrl: './dashboard-stats.component.html',
    standalone: true,
    imports: [
        NgIf,
        LoaderComponent,
        TranslatePipe,
    ],
})

/**
 * Dashboard Stats component
 */
export class DashboardStatsComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * iFrame element ref
   * @type {ElementRef<HTMLIFrameElement>}
   */
  @ViewChild('statsIframeRef')
  iframe: ElementRef<HTMLIFrameElement>;

  /**
   * Frame content height
   * @type {string}
   */
  frameContentHeight: string = '0';

  /**
   * Stats URL
   * @type {string}
   */
  statsURL: SafeUrl;
  /**
   * Iframe index in iframe service
   * @type {number}
   */
  private iframeIndex: number;

  /**
   * @ignore
   */
  constructor(
    private seoService: SeoService,
    private readonly iframeService: AvailableIFrameService,
    private readonly postMessageService: PostMessageIframeService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  /**
   * Setups stats URL
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['MyDashboard.Stats']);

    if (environment.production) {
      this.statsURL = this.sanitizer.bypassSecurityTrustResourceUrl(APP_CONFIG.urls.stats);
    } else {
      this.statsURL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://dev.dane.gov.pl${APP_CONFIG.urls.stats}`);
    }
  }

  /**
   * Add visible iframe to service
   * Subscribe for frame height
   */
  ngAfterViewInit(): void {
    this.iframeIndex = this.iframeService.append(this.iframe);
    this.postMessageService
      .getMessages()
      .pipe(
        filter(data => data.height),
        debounceTime(100),
        distinctUntilChanged((prev, curr) => prev.height === curr.height),
      )
      .subscribe(dimensions => {
        this.frameContentHeight = dimensions.height + 'px';
      });
  }

  /**
   * Cleanups visible iframe
   */
  ngOnDestroy() {
    this.iframeService.remove(this.iframeIndex);
  }
}
