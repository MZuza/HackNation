import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-embed-layout',
  templateUrl: './embed-layout.component.html',
  imports: [
    RouterOutlet
  ],
  standalone: true
})
export class EmbedLayoutComponent {
  /**
   * @ignore
   */
  constructor() {}
}
