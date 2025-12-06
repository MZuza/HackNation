import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG } from '@app/app.config';
import { StringHelper } from '@app/shared/helpers/string.helper';

/**
 * Shared singleton service that handles every case of SEO
 */
@Injectable()
export class SeoService {
  private renderer: Renderer2;

  /**
   * Sets initial page title and meta description
   */
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private translate: TranslateService,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.titleService.setTitle(APP_CONFIG.name);
    this.setInitialMetaDescription();
  }

  /**
   * Set page `<title>` tags
   * @param {string | string[]} title
   */
  setPageTitle(title: string | string[]) {
    if (title instanceof Array) {
      this.titleService.setTitle(title.join(' - ') + ' - ' + APP_CONFIG.name);
    } else {
      this.titleService.setTitle(title + ' - ' + APP_CONFIG.name);
    }
  }

  /**
   * Set description from backend text. Strips html tags and limits text to 30 words
   * @param {string | null} text
   * @param {number} limitWords
   */
  setDescriptionFromText(text: string | null, limitWords: number = 30) {
    if (!text) {
      return;
    }

    const pageDesc = StringHelper.stripHtmlTags(text.split(' ').splice(0, limitWords).join(' ')) + '...';

    this.metaService.updateTag({ name: 'description', content: pageDesc });
  }

  /**
   * Sets page title by translation key
   * @param {string[]} translationKeys
   */
  setPageTitleByTranslationKey(translationKeys: string[]) {
    this.translate.stream(translationKeys).subscribe(translations => {
      this.titleService.setTitle(`${Object.values(translations).join(' - ')} - ${APP_CONFIG.name}`);
    });
  }

  /**
   * Sets initial meta description
   */
  setInitialMetaDescription() {
    this.translate.get(['Description']).subscribe(translation => {
      if (isPlatformBrowser(this.platformId)) {
        this.setInitialMetaDescriptionInBrowser(translation);
      } else {
        this.setupInitialMetaDescriptionForServer(translation);
      }
    });
  }

  private setupInitialMetaDescriptionForServer(translation) {
    let descriptionEl: HTMLMetaElement = this.document.head.querySelector('meta[name="description"]');
    if (!descriptionEl) {
      descriptionEl = this.renderer.createElement('meta');
      this.renderer.setAttribute(descriptionEl, 'name', 'description');
      this.renderer.appendChild(this.document.head, descriptionEl);
    }
    this.renderer.setAttribute(descriptionEl, 'content', translation['Description']);
  }

  private setInitialMetaDescriptionInBrowser(translation) {
    const descriptionEl: HTMLMetaElement = this.metaService.getTag('name = "description"');
    const description = { name: 'description', content: translation['Description'] };

    if (descriptionEl) {
      this.metaService.updateTag(description);
    } else {
      this.metaService.addTag(description);
    }
  }
}
