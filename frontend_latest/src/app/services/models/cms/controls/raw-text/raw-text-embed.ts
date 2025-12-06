import {IRawTextObject} from '@app/services/models/cms/controls/raw-text/raw-text-object';

export interface IRawTextEmbed extends IRawTextObject {
    alt: string;
    embedType?: string;
    format?: string;
    id?: string;
    url?: string;
}
