import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';

export class CmsFormQuestionRadio extends CmsFormQuestion {
    htmlElementName = 'input';
    htmlElementType = 'radio';
    hasTextInput: boolean;
    hasMultilineInput: boolean;

    constructor(options, hasTextInput: boolean, hasMultilineInput: boolean) {
        super(options);
        this.hasTextInput = hasTextInput;
        this.hasMultilineInput = hasMultilineInput;
    }
}
