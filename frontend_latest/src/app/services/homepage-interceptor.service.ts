import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from './api';

@Injectable({
    providedIn: 'root'
})
export class HomepageInterceptorService implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        const {url, params} = request;
        let isStatsRequest: boolean;
        let isNewsRequest: boolean;

        isStatsRequest = (url.indexOf(ApiConfig.stats) !== -1);
        isNewsRequest = (url.indexOf(ApiConfig.articles) !== -1)
            && params.has('category') && (+params.get('category') === 1)
            && params.has('per_page') && (+params.get('per_page') === 3);

        if (!isNewsRequest && !isStatsRequest) { return next.handle(request); }

        const requestClone = request.clone({
            headers: request.headers
                .append('Cache-Control', 'no-cache')
                .append('Pragma', 'no-cache')
                .append('Expires', '-1')
        });

        return next.handle(requestClone);
    }
}
