import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { DatasetService } from '@app/services/dataset.service';
import { SeoService } from '@app/services/seo.service';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';

/**
 * Submission Item Component
 */
@Component({
  selector: 'app-submission-item',
  templateUrl: './submission-item.component.html',
  animations: [
    toggleVertically
  ],
  imports: [
    NotificationsServerComponent,
    TranslatePipe,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    MathCaptchaComponent
  ],
  standalone: true
})
export class SubmissionItemComponent implements OnInit {

    /**
     * Submission - data proposal
     */
    submission: any;

    /**
     * Feedback form
     */
    feedbackForm: UntypedFormGroup;

    /**
     * Max number of characters in the feedback
     */
    @Input() minFeedbackLength = 3;

    /**
     * Max number of characters in the feedback
     */
    @Input() maxFeedbackLength = 3000;

    /**
     * Determines whether feedback is sent
     */
    isFeedbackSent: boolean;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private datasetService: DatasetService) {
    }

    /**
     * Sets META tags.
     * Initializes feedback form.
     */
    ngOnInit(): void {
        this.submission = this.activatedRoute.snapshot.data['post'].data;
        this.seoService.setPageTitle(this.submission.attributes.title);
        this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.submission.attributes.notes));
        this.initForm();
    }

    /**
     * Initializes form
     */
    initForm(): void {
        this.feedbackForm = new UntypedFormGroup({
            'feedback': new UntypedFormControl(null, [
                Validators.required,
                Validators.minLength(this.minFeedbackLength),
                Validators.maxLength(this.maxFeedbackLength)
            ]),
            'captcha': new UntypedFormControl(null, Validators.required)
        });
    }

    /**
     * Sends feedback on form submit
     */
    onFormSubmit(): void  {
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

        this.datasetService.sendSubmissionFeedback(this.submission.id, JSON.parse(payload)).subscribe(() => this.isFeedbackSent = true);
    }
}
