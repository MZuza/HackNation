import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';

export class CmsFormQuestionTextarea extends CmsFormQuestion {
    htmlElementName = 'textarea';

    constructor(options) {
        super(options);
    }
}
