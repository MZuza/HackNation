import {IRawTextObjectType} from '@app/services/models/cms/controls/raw-text/raw-text-object-type.enum';

export interface IRawTextObject {
    type: IRawTextObjectType;
    text?: string;
}

export interface IRawTextDocumentMetadata {
    id: string;
    href: string;
}
