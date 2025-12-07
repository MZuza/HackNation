import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';

export class CmsFormQuestionCheckbox extends CmsFormQuestion {
    htmlElementName = 'input';
    htmlElementType = 'checkbox';
    hasTextInput: boolean;
    hasMultilineInput: boolean;

    constructor(options, hasTextInput: boolean, hasMultilineInput: boolean) {
        super(options);
        this.hasTextInput = hasTextInput;
        this.hasMultilineInput = hasMultilineInput;
    }
}
