import { NgIf } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {WidgetAbstractComponent} from '@app/shared/cms/widget/widget.abstract.component';

@Component({
    selector: 'cms-slogan',
    templateUrl: './slogan.component.html',
    standalone: true,
    imports: [NgIf, TranslatePipe]
})
export class SloganComponent extends WidgetAbstractComponent implements OnInit {


  ngOnInit() {
  }

}
