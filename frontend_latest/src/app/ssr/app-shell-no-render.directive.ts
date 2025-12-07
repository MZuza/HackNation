import { isPlatformServer } from '@angular/common';
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * App Shell No Render Directive
 * Skips rendering element if platform is server
 */
@Directive({
    selector: '[appShellNoRender]',
    standalone: true,
})
export class AppShellNoRenderDirective implements OnInit {
  /**
   * @ignore
   */
  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>, @Inject(PLATFORM_ID) private platformId) {}

  /**
   * Clears view container if platform is server
   */
  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
