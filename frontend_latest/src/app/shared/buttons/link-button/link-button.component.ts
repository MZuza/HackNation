import {Component, Input, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'link-button',
    templateUrl: './link-button.component.html',
    standalone: true,
    imports: [RouterLink, TranslatePipe]
})
export class LinkButtonComponent implements OnInit {

    @Input() labelTranslateKey: string;
    @Input() routerLink: string[];
  constructor() { }

  ngOnInit() {
  }

}
