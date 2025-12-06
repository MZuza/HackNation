import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';
import { DownloadLinkComponent } from '@app/shared/download-link/download-link.component';
import { LinkHelper } from '@app/shared/helpers';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';
import { DateFormatPipe } from '@app/shared/pipes/date-format.pipe';

export interface BrokenLinksData {
  cmsData: any;
  apiData: any;
}

@Component({
  selector: 'app-broken-links',
  standalone: true,
  imports: [
    TranslatePipe,
    NgIf,
    FormsModule,
    InfoTooltipDirective,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    CmsBlock2Component,
    DownloadLinkComponent,
    DateFormatPipe,
  ],
  templateUrl: './broken-links.component.html',
  styleUrl: './broken-links.component.scss',
})
export class BrokenLinksComponent {
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  readonly post = input<BrokenLinksData>();

  cmsData = computed(() => this.post().cmsData);
  apiData = computed(() => this.post().apiData.data);
  downloadFileList = computed(() => this.apiData().attributes?.files);
  title = computed(() => this.cmsData().title);
  searchQuery: string;

  generateQuery(searchQuery?: string) {
    this.searchQuery = searchQuery || '';

    this.router.navigate([], {
      queryParams: {q: this.searchQuery || null},
      queryParamsHandling: 'merge'
    });
  }

  downloadResource( url: string) {
    LinkHelper.downloadResource({ title: '', url }, this.translateService.currentLang);
  }
}
