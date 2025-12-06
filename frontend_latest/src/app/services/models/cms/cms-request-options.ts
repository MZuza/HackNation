import { HttpParams } from '@angular/common/http';

export interface CmsRequestOptions {
    params?: HttpParams;
    withCredentials?: boolean;
}
