import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ApiConfig } from '@app/services/api';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { API_URL } from '@app/user/list-view/API_URL';

/**
 * Data Proposal Component
 */
@Component({
    selector: 'app-data-proposal',
    templateUrl: './data-proposal.component.html',
    providers: [
        { provide: API_URL, useValue: ApiConfig.dataProposal }
    ],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, PermissionDirective, RouterOutlet, TranslatePipe]
})
export class DataProposalComponent {
    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}
