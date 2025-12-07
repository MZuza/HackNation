import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { RawTextEmbedComponent } from './raw-text-embed/raw-text-embed.component';

import { CmsService } from '@app/services/cms.service';
import { EmbedRawTextService } from '@app/services/embed-raw-text.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { IRawTextObject } from '@app/services/models/cms/controls/raw-text/raw-text-object';
import { IRawText } from '@app/services/models/cms/widgets/raw-text';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Raw text
 */
@Component({
    selector: 'cms-raw-text',
    templateUrl: './raw-text.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        NgFor,
        NgStyle,
        RawTextEmbedComponent,
        TranslatePipe,
        SanitizeHtmlPipe,
    ],
})
export class RawTextComponent extends WidgetAbstractComponent implements OnInit, AfterViewInit {
  /**
   * Text to display
   */
  @Input() rawText: IRawText;

  /**
   * Is full width
   */
  @Input() isFullWidth = false;

  /**
   * Event emitter for loaded content
   */
  @Output() rawTextHasLoaded = new EventEmitter();

  isFooterNav: boolean;

  /**
   * Widget type enum
   */
  readonly widgetType = WidgetType;

  /**
   * Extract text from html like element used to build link for hyper editor link widget
   */
  text: string;

  /**
   * Styles for text
   */
  style: any;

  /**
   * Raw text objects
   */
  rawTextObjects: IRawTextObject[] = [];

  classes: string;

  /**
   * Randomly generated id for every navigation list
   */
  listId: string;

  /**
   * Is navigation list visible
   */
  isVisible = false;

  strippedText: string;

  /**
   * @ignore
   */
  constructor(
    cmsService: CmsService,
    sanitizer: DomSanitizer,
    private embedRawTextService: EmbedRawTextService,
    private featureFlagService: FeatureFlagService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super(cmsService, sanitizer);
  }

  /**
   * Prepare text with styles do display in html
   */
  ngOnInit() {
    this.rawTextHasLoaded.emit(true);
    this.rawTextObjects = this.embedRawTextService.changeTextToRawTextObjectList(
      this.rawText.settings ? this.rawText.settings.text : this.rawText.value,
    );
    this.style = this.cmsService.addStyle(this.rawText);
    if (this.rawText.settings && this.rawText.settings.url) {
      this.text = this.embedRawTextService.extractTextFromElement(this.rawText.settings.text);
    }
    if (this.rawText.general?.classes) {
      this.classes = this.rawText.general.classes;
      this.IsListFooterNav(this.rawText.general.classes);
    }
  }

  ngAfterViewInit() {
    if (
      document.querySelector('a.page-footer__list-item.btn-write-us') &&
      document.querySelector('a.page-footer__list-item.btn-link-rodo')
    ) {
      this.cmsService.footerNavIsExist(true);
    }
  }

  IsListFooterNav(classNames: string) {
    if (classNames.split(' ')[0] === 'page-footer__nav-title') {
      this.isFooterNav = true;
      this.strippedText = this.rawText.settings.text.replace(/(<([^>]+)>)/gi, '');
    } else {
      this.isFooterNav = false;
    }
  }

  toggleMenu() {
    this.isVisible = !this.isVisible;
    const className = this.classes.split(' ')[1];
    const elem = this.document.querySelector('.page-footer__nav.' + className);
    elem.classList.contains('visibility-animated')
      ? elem.classList.remove('visibility-animated')
      : elem.classList.add('visibility-animated');
  }
}
