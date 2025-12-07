import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Knowledge Base Component - general container and routing base
 */
@Component({
    selector: 'app-knowledge-base',
    templateUrl: './knowledge-base.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class KnowledgeBaseComponent {
}
