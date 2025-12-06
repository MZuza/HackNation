import { Params } from '@angular/router';

export interface Breadcrumb {
    lastChild: boolean;
    label: any;
    params?: Params;
    url?: string;
    segments: string[];
}
