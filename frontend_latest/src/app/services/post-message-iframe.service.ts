import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
/**
 * Post Message Service handles communication with child iframe
 */
export class PostMessageIframeService {


    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }

    /**
     * Sends post message to child iframe
     * @param iframeElement
     * @param data
     */
    sendMessage(iframeElement: HTMLIFrameElement, data: any): void {
        iframeElement.contentWindow.postMessage(data, '*');
    }

    getMessages(): Observable<any> {
        return fromEvent<MessageEvent>(window, 'message')
            .pipe(
                filter(e => e.origin.includes('dane.gov.pl')),
                map(e => e.data)
            );
    }

}
