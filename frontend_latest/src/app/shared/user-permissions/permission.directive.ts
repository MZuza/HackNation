import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Role } from '@app/shared/user-permissions/Role';

/**
 * Adds the template content to the DOM when user has required permissions.
 */
@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class PermissionDirective {
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private userService: UserService) {}

  @Input() set hasPermission(roles: Array<Role>) {
    if (roles.length === 0 || (!this.hasView && this.userService.hasRequiredRole(roles))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.userService.hasRequiredRole(roles) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
