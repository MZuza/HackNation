import { HttpErrorResponse } from '@angular/common/http';

export interface IErrorBackend {
    id: string;
    status: string;
    code: string;
    title: string;
    detail: string;
}

export class HttpCustomErrorResponse extends HttpErrorResponse {
    readonly error: {
        jsonapi: {
            version: string
        },
        errors: IErrorBackend[]
    };
}
