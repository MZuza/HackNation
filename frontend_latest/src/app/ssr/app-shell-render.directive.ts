import { isPlatformServer } from '@angular/common';
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * App Shell Render Directive
 * Skips rendering element if platform is browser
 */
@Directive({
    selector: '[appShellRender]',
    standalone: true,
})
export class AppShellRenderDirective implements OnInit {
  /**
   * @ignore
   */
  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>, @Inject(PLATFORM_ID) private platformId) {}

  /**
   * Clears view container if platform isn't server
   */
  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
