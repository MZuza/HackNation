import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';

/**
 * Result list wrapper for list view
 */
@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgClass,
        NgTemplateOutlet,
    ],
})
export class ResultListComponent implements AfterContentInit {
  /**
   * left template
   */
  leftTemplate: TemplateRef<any> = null;

  /**
   * left template
   */
  rightTemplate: TemplateRef<any> = null;

  /**
   * Conntent projected templates which will be displated in view
   */
  @ContentChildren(TemplateRef) templateReferences: QueryList<TemplateRef<any>>;

  /**
   * items to display
   */
  @Input() items = [];

  /**
   * Sets available templates
   */
  ngAfterContentInit() {
    const templates = this.templateReferences.toArray();
    this.leftTemplate = templates[0];
    this.rightTemplate = templates[1];
  }

  /**
   * Tracks list items for better performance
   * @param index
   * @param item
   * @returns {number}
   */
  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
