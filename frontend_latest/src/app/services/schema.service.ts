import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

/**
 * Schema Service
 */
@Injectable({
    providedIn: 'root'
})
export class SchemaService {

    /**
     * Renderer2 instance
     * @type {Renderer2}
     */
    private readonly renderer2: Renderer2;


    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private readonly document: Document,
                private readonly rendererFactory2: RendererFactory2) {
        this.renderer2 = this.rendererFactory2.createRenderer(this.document.head, null);
    }

    /**
     * Adds structured data
     * @param data
     */
    addStructuredData(data: Object): void {
        this.removeStructuredData();
        const script = this.renderer2.createElement('script');
        this.renderer2.setAttribute(script, 'type', 'application/ld+json');
        this.renderer2.setProperty(script, 'text', JSON.stringify(data));
        this.renderer2.appendChild(this.document.head, script);
    }

    /**
     * Removes structured data
     */
    removeStructuredData(): void {
        const script = this.document.querySelector('script[type="application/ld+json"]');
        if (!!!script) {
            return;
        }
        this.renderer2.removeChild(this.document.head, script);
    }
}
