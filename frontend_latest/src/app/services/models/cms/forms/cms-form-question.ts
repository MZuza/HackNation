import { IFormField, IFormFieldValue } from '@app/services/models/cms/forms/cms-form';

export class CmsFormQuestion {
    id: string;
    type: string;
    value: IFormFieldValue;
    htmlElementName: string;
    htmlElementType: string;
    hasTextInput: boolean;
    hasMultilineInput: boolean;

    constructor(formField: IFormField) {
        this.id = formField.id;
        this.type = formField.type;
        this.value = formField.value;
        this.htmlElementName = '';
        this.htmlElementType = '';
    }
}
