import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MapComponent } from '@app/shared/map/map.component';
import { AppShellNoRenderDirective } from '@app/ssr/app-shell-no-render.directive';

@Component({
  selector: 'app-dataset-resource-map',
  templateUrl: './dataset-resource-map.component.html',
  standalone: true,
  imports: [
    MapComponent,
    AppShellNoRenderDirective
  ]
})
export class DatasetResourceMapComponent implements OnInit {
  /**
   * Resource id
   */
  resourceId: string;

  /**
   * @ignore
   */
  constructor(private route: ActivatedRoute) {}

  /**
   * Set resource ID
   */
  ngOnInit() {
    this.resourceId = this.route.parent.snapshot.params.resourceId;
  }
}
