import { LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';

/**
 * Feedback Form Component
 */
@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  animations: [toggleVertically],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    TranslatePipe,
    MathCaptchaComponent,
    LowerCasePipe
  ]
})
export class FeedbackFormComponent implements OnInit {
  /**
   * Data model
   */
  @Input() model: ApiModel.DATASET | ApiModel.RESOURCE = ApiModel.DATASET;

  /**
   * Id of related object (model)
   */
  @Input() id: string;

  /**
   * Max number of characters in the feedback
   */
  @Input() minFeedbackLength = 3;

  /**
   * Max number of characters in the feedback
   */
  @Input() maxFeedbackLength = 3000;

  /**
   * Service method related to the model
   */
  private serviceMethod = 'sendDatasetFeedback';

  /**
   * Feedback form
   */
  feedbackForm: UntypedFormGroup;

  /**
   * Feedback sent indicator
   */
  isFeedbackSent = false;

  /**
   * @ignore
   */
  constructor(private datasetService: DatasetService) {}

  /**
   * Inits form
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inits form
   */
  initForm(): void {
    this.feedbackForm = new UntypedFormGroup({
      feedback: new UntypedFormControl(null, [
        Validators.required,
        Validators.minLength(this.minFeedbackLength),
        Validators.maxLength(this.maxFeedbackLength),
      ]),
      captcha: new UntypedFormControl(null, Validators.required),
    });
  }

  /**
   * Sends feedback on feedback form submit
   */
  onFormSubmit(): void {
    if (this.feedbackForm.invalid) {
      return;
    }

    const payload = `{
            "data": {
                "type": "comment",
                "attributes": {
                    "comment": ${JSON.stringify(this.feedbackForm.value.feedback)}
                }
            }
        }`;

    if (this.model === ApiModel.RESOURCE) {
      this.serviceMethod = 'sendResourceFeedback';
    }

    this.datasetService[this.serviceMethod](this.id, JSON.parse(payload)).subscribe(() => (this.isFeedbackSent = true));
  }
}
