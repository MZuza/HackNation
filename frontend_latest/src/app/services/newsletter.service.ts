import { HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ApiConfig} from '@app/services/api';
import {HttpCustomErrorResponse, IErrorBackend} from '@app/services/models';
import {NewsletterRequest} from '@app/services/models/newsletter-request';
import {RestService} from '@app/services/rest.service';
import {TemplateHelper} from '@app/shared/helpers';

@Injectable({
    providedIn: 'root'
})
export class NewsletterService extends RestService {

    /**
     * Add newslleter subscription
     */
    addNewsletterSubscription(newslatterRequest: NewsletterRequest) {
        return this.post(ApiConfig.subscribeNewsletter, newslatterRequest);
    }

    /**
     * Removes newsletter subscription
     */
    removeNewsletterSubscription(token: string) {
        return this.post(ApiConfig.unsubscribeNewsletter, {'activation_code' : token });
    }

    /**
     * Get Newsletter Regulations
     */
    getNewsletterRegulations() {
        return this.get(ApiConfig.subscribeNewsletter);
    }

    /**
     * Confirm Newsletter Subscription
     * @param token
     */
    confirmNewsletterSubscription(token: string) {
        this.headers = new HttpHeaders();
        const url = TemplateHelper.parseUrl(ApiConfig.confirmSubscribeNewsletter, {token: token});
        return this.post(url);
    }

    /**
     * Get Error message
     * @param {HttpCustomErrorResponse} customError
     * @returns {string}
     */
    getNewsletterError(customError: HttpCustomErrorResponse): string {
        let errorMessage = '';
        const errors: IErrorBackend [] = this.getBackendErrors(customError);
        if (errors) {
            errorMessage =  errors[0].detail;
        }

        return errorMessage;
    }
}
