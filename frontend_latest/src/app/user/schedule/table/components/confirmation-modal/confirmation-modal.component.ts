import { NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

/**
 * Confirmation Modal Component
 */
@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    standalone: true,
    imports: [NgClass],
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {

    /**
     * Item id
     * @type {string}
     */
    @Input()
    itemId: string;

    /**
     * Message content
     * @type {string}
     */
    @Input()
    message: string;

    /**
     * Is modal displayed otuside table
     * @type {boolean}
     */
    @Input()
    isOutsideTable = false;

    /**
     * Emits id of item
     * @type {EventEmitter<string>}
     */
    @Output()
    selectedItemId: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Close dialog
     * Emits true when closed by clicking outside
     * @type {EventEmitter<boolean>}
     */
    @Output()
    closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Dialog container element reference
     * @type {ElementRef}
     */
    @ViewChild('container', {read: ElementRef}) containerRef: ElementRef;

    private clickOutsideListener: () => void;

    /**
     * @ignore
     */
    constructor(private readonly renderer: Renderer2) {
    }

    /**
     * Listens on click outside dialog
     */
    ngOnInit(): void {
        setTimeout(() => {
            this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
        });
    }

    /**
     * Cleanup
     */
    ngOnDestroy() {
        this.clickOutsideListener();
    }

    /**
     * Listens on click outside query dialog. Hides dialog.
     * @param {Event} event
     */
    clickOutside(event: Event) {
        const targetElement = event.target as HTMLElement;
        const parentElement = this.containerRef.nativeElement as HTMLElement;
        const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

        if (!clickedInside) {
            this.closeDialog.emit(true);
        }
    }
}
