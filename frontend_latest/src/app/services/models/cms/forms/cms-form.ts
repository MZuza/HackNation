import { IMetadataPageCms } from '../metadata-page-cms';

import { CmsFormset } from '@app/services/models/cms/forms/cms-formset';

export interface ICmsForm {
    id: string | number;
    meta: IMetadataPageCms;
    title: string;
    last_published_at: string;
    latest_revision_created_at: string;
    intro: string;
    thank_you_text: string;
    formsets: IFormset[];
    formsetObjects: CmsFormset[];
}

export interface IFormset {
    title: string;
    name: string;
    description: string;
    required:   boolean;
    default_value: string;
    fields: IFormField[];
}

export interface IFormField {
    id: string;
    type: string;
    value: IFormFieldValue;
}

export interface IFormFieldValue {
    label: string;
    help_text: string;
    value: string;
    checked: boolean;
    placeholder: string;

    input_label: string;
    input_help_text: string;
    input_default_value: string;
    input_placeholder: string;
}

export enum CmsFormFieldTypes {
    CHECKBOX = 'checkbox',
    CHECKBOX_AND_TEXT = 'checkboxwithinput',
    CHECKBOX_AND_MULTITEXT = 'checkboxwithmultilineinput',

    RADIO = 'radiobutton',
    RADIO_AND_TEXT = 'radiobuttonwithinput',
    RADIO_AND_MULTITEXT = 'radiobuttonwithmultilineinput',

    SINGLELINE = 'singlelinetextinput',
    MULTILINE = 'multilinetextinput',
}
