import { LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';

@Component({
  selector: 'app-suggest-dataset',
  templateUrl: './suggest-dataset.component.html',
  animations: [toggleVertically],
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    RouterLink,
    ReactiveFormsModule,
    NotificationsServerComponent,
    NgClass,
    LowerCasePipe,
    MathCaptchaComponent
  ]
})
export class SuggestDatasetComponent implements OnInit {
  /**
   * Application form of suggest application component
   */
  datasetForm: UntypedFormGroup;

  /**
   * Determines whether suggestion is sent
   */
  isSuggestionSent: boolean = false;

  /**
   * Max number of characters in notes (description)
   */
  maxDescriptionLength: number = 3000;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private datasetService: DatasetService, private notificationsService: NotificationsService) {}

  /**
   * Sets META tags (title).
   * Initializes form with predefined validators
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['DatasetForm.Heading']);

    this.datasetForm = new UntypedFormGroup({
      title: new UntypedFormControl(null, Validators.required),
      notes: new UntypedFormControl(null, [Validators.required, Validators.maxLength(this.maxDescriptionLength)]),
      organization_name: new UntypedFormControl(null),
      data_link: new UntypedFormControl(null, Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?')),
      potential_possibilities: new UntypedFormControl(null),
      captcha: new UntypedFormControl(null, Validators.required),
    });
  }

  addHttpIfMissing(data_link: string): string {
    if (!data_link) {
      return null;
    }
    if (data_link && (data_link.split('http://').length > 1 || data_link.split('https://').length > 1)) {
    return data_link;
  } else {
    return 'http://' + data_link;
  }
}

  /**
   * Determines whether dataset form is submitted
   */
  onDatasetFormSubmit() {
    if (!this.datasetForm.valid) { return; }

    this.notificationsService.clearAlerts();
    const formValue = { ...this.datasetForm.value };
    formValue['data_link'] = this.addHttpIfMissing(formValue['data_link']);

    // remove empty properties
    for (const key in formValue) {
      if (!formValue[key] || (formValue[key] && !formValue[key].length) || key === 'captcha') {
        delete formValue[key];
      }
    }

    const payload = `{
            "data": {
                "type": "submission",
                "attributes": ${JSON.stringify(formValue)}
            }
        }`;

    this.datasetService.sendSubmission(JSON.parse(payload)).subscribe(
      () => (this.isSuggestionSent = true),
      error => {
        this.notificationsService.addError(error);
      },
    );
  }
}
