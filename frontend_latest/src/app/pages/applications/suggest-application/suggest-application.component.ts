import { LowerCasePipe, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

import { toggleVertically } from '@app/animations';
import { requireOneUrlValidator } from '@app/pages/applications/suggest-application/requireOneUrlValidator';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { ApplicationsService } from '@app/services/applications.service';
import { CmsService } from '@app/services/cms.service';
import { IPageCms } from '@app/services/models/cms/page-cms';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { DatasetAutocompleteDirective } from '@app/shared/directives/dataset-autocomplete.directive';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TextToLinksPipe } from '@app/shared/pipes/text-to-links.pipe';
import { getEventValue } from '@app/shared/util';

interface IComponentOptions {
  label: string;
  value: string;
}

/**
 * Suggest Application Component
 */
@Component({
    selector: 'app-suggest-application',
    templateUrl: './suggest-application.component.html',
    animations: [toggleVertically],
    standalone: true,
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NotificationsServerComponent,
    NgClass,
    NgFor,
    ImageUploadComponent,
    DatasetAutocompleteDirective,
    MathCaptchaComponent,
    LowerCasePipe,
    TranslatePipe,
    SanitizeHtmlPipe,
    TextToLinksPipe,
    NgOptimizedImage,
  ],
})
export class SuggestApplicationComponent implements OnInit, AfterViewInit {

  /**
   * @ignore
   */
  constructor(
    private seoService: SeoService,
    private applicationsService: ApplicationsService,
    private notificationsService: NotificationsService,
    private cmsService: CmsService,
  ) {}
  /**
   * Application form of suggest application component
   */
  applicationForm: UntypedFormGroup;

  /**
   * Determines whether suggestion is sent
   */
  isSuggestionSent = false;

  /**
   * Uploaded image file
   */
  uploadedImageFile: File;

  /**
   * Uploaded image preview
   */
  uploadedImagePreview: any;

  /**
   * Accepted mime types
   */
  acceptedMimeTypes: string[] = ['image/jpeg', 'image/gif', 'image/png'];

  /**
   * Determines whether type of uploaded file is accepted
   */
  isImageTypeAccepted = true;

  /**
   * Max datasets number of suggest application component
   */
  maxDatasetsNumber = 10;

  /**
   * Max number of characters in notes (description)
   */
  maxDescriptionLength = 3000;

  /**
   * Determines whether terms text is expanded
   */
  isTermsTextExapnded = false;

  /**
   * Temporary field suffix
   */
  tempFieldSuffix = '_temp';

  /**
   * Cms page info
   */
  cmsPageInfo: IPageCms;

  /**
   * Cms page consent
   */
  cmsPageConsent: IPageCms;

  /**
   * fill select control categories
   */
  categoryOptions: IComponentOptions[] = [
    { label: 'ShowcasesCategory.app', value: 'app' },
    { label: 'ShowcasesCategory.www', value: 'www' },
    { label: 'ShowcasesCategory.others', value: 'other' },
  ];

  /**
   * Determines witch sections are visibility, depends on category type
   */
  selected: string;

  /**
   * Determines if mobile application section is visibility
   */
  selectedMobileType = false;

  /**
   * Determines if desktop application section is visibility
   */
  selectedDesktopType = false;

  /**
   * Image upload reference
   */
  @ViewChild('imageInput') imageInput: ElementRef;

  /**
   * Dataset input list reference
   */
  @ViewChildren('datasetInput') datasetInputs: QueryList<HTMLInputElement>;

  /**
   * External dataset title input list reference
   */
  @ViewChildren('externalDatasetTitleInput') externalDatasetTitleInputs: QueryList<HTMLInputElement>;

  protected readonly getValue = getEventValue;

  /**
   * Sets META tags (title).
   * Initializes form with predefined validators
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Applications.Suggest']);
    this.initApplicationForm();
    this.getCmsInfoAndConsent();
  }

  /**
   * Inits application form
   */
  initApplicationForm() {
    this.applicationForm = new UntypedFormGroup({
      title: new UntypedFormControl(null, Validators.required),
      url: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?'),
      ]),
      notes: new UntypedFormControl(null, [Validators.required, Validators.maxLength(this.maxDescriptionLength)]),
      keywords: new UntypedFormControl(null),
      author: new UntypedFormControl(null, Validators.required),
      image: new UntypedFormControl(null),
      ['image' + this.tempFieldSuffix]: new UntypedFormControl(null),
      illustrative_graphics: new UntypedFormControl(null),
      ['illustrative_graphics' + this.tempFieldSuffix]: new UntypedFormControl(null),
      datasets: new UntypedFormArray([]),
      external_datasets: new UntypedFormArray([]),
      applicant_email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      is_personal_data_processing_accepted: new UntypedFormControl(false, Validators.requiredTrue),
      is_terms_of_service_accepted: new UntypedFormControl(false, Validators.requiredTrue),
      captcha: new UntypedFormControl(null, Validators.required),
      category: new UntypedFormControl(null, Validators.required),
      is_mobile_app: new UntypedFormControl(false),
      myMobileUrlGroup: new UntypedFormGroup(
        {
          mobile_apple_url: new UntypedFormControl(null, [Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?')]),
          mobile_google_url: new UntypedFormControl(null, [
            Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?'),
          ]),
        },
        requireOneUrlValidator(),
      ),
      is_desktop_app: new UntypedFormControl(false),
      myDesktopUrlGroup: new UntypedFormGroup(
        {
          desktop_linux_url: new UntypedFormControl(null, [
            Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?'),
          ]),
          desktop_macos_url: new UntypedFormControl(null, [
            Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?'),
          ]),
          desktop_windows_url: new UntypedFormControl(null, [
            Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?'),
          ]),
        },
        requireOneUrlValidator(),
      ),
      license_type: new UntypedFormControl('free', Validators.required),
    });

    this.applicationForm.get('myMobileUrlGroup').disable();
    this.applicationForm.get('myDesktopUrlGroup').disable();
    this.ValueChangesUrlsGroup();
  }

  /**
   * set Urls group to disabled when the checkbox is not checked, set to enabled when checkbox is checked
   */
  ValueChangesUrlsGroup() {
    this.applicationForm.get('is_mobile_app').valueChanges.subscribe(value => {
      if (value) {
        this.applicationForm.get('myMobileUrlGroup').enable();
      } else {
        this.applicationForm.get('myMobileUrlGroup').disable();
      }
    });

    this.applicationForm.get('is_desktop_app').valueChanges.subscribe(value => {
      if (value) {
        this.applicationForm.get('myDesktopUrlGroup').enable();
      } else {
        this.applicationForm.get('myDesktopUrlGroup').disable();
      }
    });
  }

  /**
   * Gets cms info andc onsent
   */
  getCmsInfoAndConsent() {
    zip(
      this.cmsService.getSimplePage(CmsHardcodedPages.APPLICATION_DATA_PROCESSING_INFO),
      this.cmsService.getSimplePage(CmsHardcodedPages.APPLICATION_DATA_PROCESSING_CONSENT),
    ).subscribe(([pageInfo, pageConsent]) => {
      this.cmsPageInfo = pageInfo['body'];
      this.cmsPageConsent = pageConsent['body'];
    });
  }

  /**
   * Submits the form
   */
  onApplicationFormSubmit() {
    if (!this.applicationForm.valid) {
      return;
    }

    this.notificationsService.clearAlerts();
    const formValue = { ...this.applicationForm.value };
    formValue['url'] = this.addHttpIfMissing(formValue['url']);

    // remove empty and temporary properties
    for (const key in formValue) {
      if (!formValue[key] || key === 'captcha' || key.indexOf(this.tempFieldSuffix) !== -1) {
        delete formValue[key];
      }
    }

    // internal datasets - store only dataset ids
    if (formValue['datasets'] && formValue['datasets'].length) {
      formValue['datasets'] = formValue['datasets']
        .filter(Boolean) // remove null values
        .map(dataset => dataset['id']) // only ids
        .reduce(function (a, b) {
          // remove duplicates
          if (a.indexOf(b) < 0) {
            a.push(b);
          }
          return a;
        }, []);
    }

    // keywords
    if (formValue['keywords'] && formValue['keywords'].length) {
      formValue['keywords'] = formValue['keywords']
        .toString()
        .split(',')
        .filter(Boolean)
        .map((keyword: string) => keyword.trim());
    }

    // external datasets
    if (formValue['external_datasets'] && formValue['external_datasets'].length) {
      formValue['external_datasets'] = formValue['external_datasets'].filter(item => {
        if (item['title'] && item['url']) {
          item['url'] = this.addHttpIfMissing(item['url']);
          return item;
        } else if (item['title'] && !item['url']) {
          delete item['url'];
          return item;
        } else if (!item['title'] && item['url']) {
          item['url'] = this.addHttpIfMissing(item['url']);
          delete item['title'];
          return item;
        }
      });
    }

    // url groups - flat request
    if (formValue['myDesktopUrlGroup']) {
      formValue['desktop_linux_url'] = formValue['myDesktopUrlGroup'].desktop_linux_url
        ? this.addHttpIfMissing(formValue['myDesktopUrlGroup'].desktop_linux_url)
        : '';
      formValue['desktop_macos_url'] = formValue['myDesktopUrlGroup'].desktop_macos_url
        ? this.addHttpIfMissing(formValue['myDesktopUrlGroup'].desktop_macos_url)
        : '';
      formValue['desktop_windows_url'] = formValue['myDesktopUrlGroup'].desktop_windows_url
        ? this.addHttpIfMissing(formValue['myDesktopUrlGroup'].desktop_windows_url)
        : '';
      delete formValue['myDesktopUrlGroup'];
    }

    if (formValue['myMobileUrlGroup']) {
      formValue['mobile_apple_url'] = formValue['myMobileUrlGroup'].mobile_apple_url
        ? this.addHttpIfMissing(formValue['myMobileUrlGroup'].mobile_apple_url)
        : '';
      formValue['mobile_google_url'] = formValue['myMobileUrlGroup'].mobile_google_url
        ? this.addHttpIfMissing(formValue['myMobileUrlGroup'].mobile_google_url)
        : '';
      delete formValue['myMobileUrlGroup'];
    }

    this.applicationsService.suggest(formValue).subscribe({
      next: () => this.isSuggestionSent = true,
      error: err => this.notificationsService.addError(err)
    });
  }

  addHttpIfMissing(url: string): string {
    if (url.split('http://').length > 1 || url.split('https://').length > 1) {
      return url;
    } else {
      return 'http://' + url;
    }
  }

  /**
   * Appends new, empty dataset row (input + remove button)
   */
  onAppendDatasetRow() {
    (<UntypedFormArray>this.applicationForm.get('datasets')).push(
      new UntypedFormGroup({
        dataset: new UntypedFormControl(null),
        id: new UntypedFormControl(null),
      }),
    );
  }

  /**
   * Appends new, empty external dataset row (input + input + remove button)
   */
  onAppendExternalDatasetRow() {
    (<UntypedFormArray>this.applicationForm.get('external_datasets')).push(
      new UntypedFormGroup({
        title: new UntypedFormControl(null),
        url: new UntypedFormControl(null, Validators.pattern('((http|https):\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w- .\\/?%&=]*)?')),
      }),
    );
  }

  /**
   * Removes selected dataset row
   * @param {number} index
   */
  onRemoveDatasetRow(index: number) {
    (<UntypedFormArray>this.applicationForm.get('datasets')).removeAt(index);
  }

  /**
   * Removes selected external dataset row
   * @param {number} index
   */
  onRemoveExternalDatasetRow(index: number) {
    (<UntypedFormArray>this.applicationForm.get('external_datasets')).removeAt(index);
  }

  onCheckPersonalDataProcessingAccepted(event: Event) {
    this.applicationForm.patchValue({ is_personal_data_processing_accepted: (event.target as HTMLInputElement).checked});
  }

  onCheckIsTermsOfServiceAccepted(event: Event) {
    this.applicationForm.patchValue({ is_terms_of_service_accepted: (event.target as HTMLInputElement).checked});
  }

  /**
   * Reads dataset chosen from autocomplete dropdown menu
   * @param {any} dataset
   * @param {number} index
   */
  onDatasetSelected(dataset, index: number) {
    (<UntypedFormArray>this.applicationForm.get('datasets')).at(index).setValue({
      dataset: dataset.attributes.title,
      id: dataset.id,
    });
  }

  /**
   * Uploads an image and transforms into base64 data format
   * @param event
   * @returns
   */
  onFileSelected(event) {
    // 'Cancel' clicked - no image chosen
    if (!event.target.files.length) { return; }

    const fileToUpload: File = <File>event.target.files[0];

    // not an image
    if (this.acceptedMimeTypes.indexOf(fileToUpload.type) === -1) {
      this.isImageTypeAccepted = false;
      return;
    } else {
      this.isImageTypeAccepted = true;
    }

    this.uploadedImageFile = fileToUpload;

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onloadend = () => {
      this.uploadedImagePreview = reader.result;
      this.applicationForm.get('image').setValue(this.uploadedImagePreview);
    };
  }

  /**
   * Sets focus on the last dataset (internal and external) input
   */
  ngAfterViewInit() {
    let datasetCount = 0;
    let externalDatasetCount = 0;

    this.datasetInputs.changes.subscribe(elements => {
      // all elements removed
      if (!elements.length) {
        datasetCount = 0;
        return;
      }

      // no change
      if (datasetCount === elements.length) { return; }

      datasetCount = elements.length;
      (<HTMLInputElement>elements.last.nativeElement).focus();
    });

    this.externalDatasetTitleInputs.changes.subscribe(elements => {
      // all elements removed
      if (!elements.length) {
        externalDatasetCount = 0;
        return;
      }

      // no change
      if (externalDatasetCount === elements.length) { return; }

      externalDatasetCount = elements.length;
      (<HTMLInputElement>elements.last.nativeElement).focus();
    });
  }

  /**
   * Sets image data on every temp image upload or remove
   * @param {string} field
   * @param {string} imageData
   */
  onFileChange(field: string, imageData: string) {
    if (field.indexOf(this.tempFieldSuffix) !== -1) {
      field = field.substr(0, field.indexOf(this.tempFieldSuffix));
    }

    this.applicationForm.get(field).setValue(imageData);
  }

  /**
   * Show sections in view depends on category type
   * @param {string} type
   */
  selectedCategoryChange(type: string) {
    switch (type) {
      case 'mobileType':
        this.selectedMobileType = !this.selectedMobileType;
        break;
      case 'desktopType':
        this.selectedDesktopType = !this.selectedDesktopType;
        break;
    }
  }

  /**
   * change the visibility of a section after changing the category
   */
  onChangeCategory(value: string) {
    this.selected = value;
    this.resetApplicationType();
  }

  /**
   * Reset application type section when change category
   */
  resetApplicationType() {
    this.selectedMobileType = false;
    this.selectedDesktopType = false;
    this.applicationForm.get('is_mobile_app').reset();
    this.applicationForm.get('is_desktop_app').reset();
    this.applicationForm.get('myMobileUrlGroup').reset();
    this.applicationForm.get('myDesktopUrlGroup').reset();
  }

  /**
   * check if item form autocompleted list is selected, if not set invalid error
   * @param event
   * @param {number} index
   */
  onCheckIfItemIsSelected(event, index: number) {
    if (!event.target.attributes.readonly) {
      this.applicationForm.get('datasets')['controls'][index].controls.dataset.setErrors({ invalid: true });
    }
  }
}
