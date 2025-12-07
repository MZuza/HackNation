import { CmsFormFieldTypes, IFormField, IFormset } from '@app/services/models/cms/forms/cms-form';
import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';
import { CmsFormQuestionCheckbox } from '@app/services/models/cms/forms/cms-form-question_checkbox';
import { CmsFormQuestionRadio } from '@app/services/models/cms/forms/cms-form-question_radio';
import { CmsFormQuestionText } from '@app/services/models/cms/forms/cms-form-question_text';
import { CmsFormQuestionTextarea } from '@app/services/models/cms/forms/cms-form-question_textarea';

export class CmsFormset {
    id: string;
    name: string;
    required: boolean;
    default: string;
    title: string;
    description: string;
    fields: IFormField[];
    answerOptions: CmsFormQuestion[];
    questionType: string = null;

    constructor(formset: IFormset) {

        this.title = formset.title || '';
        this.name = formset.name || '';
        this.description = formset.description || null;
        this.required = formset.required;
        this.default = formset.default_value.trim() || '';
        this.fields = formset.fields;
        this.answerOptions = formset.fields.map(field => this.createFieldObject(field));
    }

    /**
     * Creates question fields class instances
     * @param {IFormField} field
     * @return {CmsFormQuestion}
     */
    private createFieldObject(field: IFormField): CmsFormQuestion {
        const hasTextInput = true;
        const hasMultilineInput = true;

        switch (field.type) {
            case CmsFormFieldTypes.SINGLELINE:
                return new CmsFormQuestionText(field);
            case CmsFormFieldTypes.MULTILINE:
                return new CmsFormQuestionTextarea(field);
            case CmsFormFieldTypes.RADIO:
                return new CmsFormQuestionRadio(field, !hasTextInput, !hasMultilineInput);
            case CmsFormFieldTypes.RADIO_AND_TEXT:
                return new CmsFormQuestionRadio(field, hasTextInput, !hasMultilineInput);
            case CmsFormFieldTypes.RADIO_AND_MULTITEXT:
                return new CmsFormQuestionRadio(field, !hasTextInput, hasMultilineInput);
            case CmsFormFieldTypes.CHECKBOX:
                return new CmsFormQuestionCheckbox(field, !hasTextInput, !hasMultilineInput);
            case CmsFormFieldTypes.CHECKBOX_AND_TEXT:
                return new CmsFormQuestionCheckbox(field, hasTextInput, !hasMultilineInput);
            case CmsFormFieldTypes.CHECKBOX_AND_MULTITEXT:
                return new CmsFormQuestionCheckbox(field, !hasTextInput, hasMultilineInput);
            default:
                return null;
        }
    }
}
