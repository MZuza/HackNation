import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

import { CmsService } from '@app/services/cms.service';
import { IWidgetStyleForHtmlInject } from '@app/services/models/cms/controls/widget-style';
import { IVideo, IVideoHyperEditor } from '@app/services/models/cms/widgets/video';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';

/**
 * Video component displays videos from CMS
 * @example
 * <cms-video></app-video>
 */
@Component({
    selector: 'cms-video',
    templateUrl: './video.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgStyle,
        NgClass,
        TranslatePipe,
    ],
})

/**
 * @ignore
 */
export class VideoComponent extends WidgetAbstractComponent implements OnInit {
  /**
   * Video to display
   */
  @Input() video: IVideo | IVideoHyperEditor;

  /**
   * Safe resource url for video
   */
  videoYoutubeUrl: SafeResourceUrl;

  /**
   * resource url for video
   */
  videoUrl: string;

  /**
   * thumbnail url for video
   */
  poster: string;

  /**
   * Css styles for video youtube div container
   */
  videoStyles: IWidgetStyleForHtmlInject;

  /**
   * Css class for video div container
   */
  videoClass: string;

  /**
   * Is supported video player
   */
  isPlayerSupported = true;

  /**
   * Predefined video players properties
   */
  videoPlayers = [
    {
      name: 'youtube',
      separator: '=',
      url: 'https://www.youtube.com/embed/',
    },
    {
      name: 'youtu.be',
      separator: '/',
      url: 'https://www.youtube.com/embed/',
    },
    {
      name: 'vimeo',
      separator: '/',
      url: 'https://player.vimeo.com/video/',
    },
    {
      name: 'dailymotion',
      separator: 'video/',
      url: 'https://www.dailymotion.com/embed/video/',
    },
  ];

  /**
   * @ignore
   */
  constructor(cmsService: CmsService, sanitizer: DomSanitizer) {
    super(cmsService, sanitizer);
  }

  /**
   *  Prepare url and styles
   */
  ngOnInit() {
    if (this.video.settings && this.video.settings.video_url) {
      this.videoYoutubeUrl = this.createEmbedUrl(this.video.settings.video_url);
      if (this.video.settings['uploaded_video']) {
        this.isPlayerSupported = true;
        this.videoUrl = this.video.settings['uploaded_video'].download_url;
        this.poster = this.video.settings['uploaded_video'].thumbnail_url;
        this.videoClass = 'video-center';
      }
      this.videoStyles = this.cmsService.addStyle(this.video, 'hyperEditor');
      return;
    }

    if ((this.video as IVideo).value) {
      this.videoUrl = (this.video as IVideo).value.uploaded_video.download_url;
      this.poster = (this.video as IVideo).value.uploaded_video.thumbnail_url;
      this.videoClass = 'video-center';
      return;
    }

    const videoFromCmsTextEditor = this.video as IVideo;
    if (videoFromCmsTextEditor.value && videoFromCmsTextEditor.value.video) {
      this.videoYoutubeUrl = this.createEmbedUrl((this.video as IVideo).value.video);
    }
  }

  /**
   *  Create embed url
   *  @param {string} originalUrl
   *  @return {SafeUrl}
   */
  private createEmbedUrl(originalUrl: string): SafeUrl {
    const videoPlayer = this.videoPlayers.find(player => RegExp(player.name, 'i').test(originalUrl));
    if (!videoPlayer) {
      this.isPlayerSupported = false;
      return null;
    }
    const videoId = originalUrl.split(videoPlayer.separator)[1].split('&').shift();
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoPlayer.url + videoId);
  }
}
