import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';

export class CmsFormQuestionText extends CmsFormQuestion {
    htmlElementName = 'input';
    htmlElementType = 'text';

    constructor(options) {
        super(options);
    }
}
