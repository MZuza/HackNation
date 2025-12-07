import { LowerCasePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FocusTrapDirective } from '../directives/focus-trap/focus-trap.directive';

import { APP_CONFIG } from '@app/app.config';

@Component({
    selector: 'app-write-us-info',
    templateUrl: './write-us-info.component.html',
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        FocusTrapDirective,
        UpperCasePipe,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class WriteUsInfoComponent implements OnInit {
  @Input() textLabel: string;
  @Input() buttonLabel = 'WriteUs.Self';
  @Input() buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() buttonLook: 'primary' | 'link' = 'primary';
  @Input() inheritLook = false;
  @Input() uppercase = true;
  @Input() showIcon = true;

  /**
   * Modal trigger (button) reference
   */
  @ViewChild('modalTrigger', { static: false }) modalTrigger: ElementRef;
  @ViewChild('modalTemplate', { static: false }) modalTemplate: TemplateRef<any>;
  writeUsModalRef: BsModalRef;
  hasButtonLook: boolean;

  /**
   * App config
   */
  appConfig = APP_CONFIG;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.hasButtonLook = this.buttonLook !== 'link';
  }

  openWriteUsModal(template: TemplateRef<any>) {
    this.writeUsModalRef = this.modalService.show(template);
  }

  onWriteUsModalClose() {
    this.writeUsModalRef.hide();
    this.writeUsModalRef = null;
    (<HTMLButtonElement>this.modalTrigger.nativeElement).focus();
  }
}
