import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StringHelper } from '../helpers/string.helper';

import { ApiModel } from '@app/services/api/api-model';
import { SearchService } from '@app/services/search.service';

/**
 * Dataset Autocomplete Directive
 */
@Directive({
    selector: '[app-dataset-autocomplete]',
    standalone: true
})
export class DatasetAutocompleteDirective implements OnInit, OnDestroy {

    /**
     * Search changed of dataset autocomplete directive
     */
    searchChanged = new Subject();

    /**
     * Dropdown item click listeners of dataset autocomplete directive
     */
    dropdownItemClickListeners: any[] = [];

    /**
     * Output (selected dataset) of dataset autocomplete directive
     */
    @Output('datasetSelected') datasetSelected = new Subject();

    /**
     * Listens on clicks outside the host (input) to remove dropdown
     * @param event
     */
    @HostListener('document:click', ['$event']) onDocumentClick(event) {
        if (event.target !== this.elementRef.nativeElement) {
            this.removeDropdownMenu();
        }
    }

    /**
     * Listens on keyup events on hosted input to initialize search
     * @param event
     */
    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
        // 0-9 numbers, a-z letters, Backspace
        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            event.key === 'Backspace') {

            const inputValue = (<HTMLInputElement>event.target).value.trim();

            if (inputValue && inputValue.length > 2) {
                const searchParams = {
                    page: 1,
                    per_page:  10,
                    q: inputValue,
                    sort: 'relevance'
                };

                this.searchChanged.next(searchParams);
            } else {
                this.removeDropdownMenu();
            }
        }
    }

    /**
     * @ignore
     */
    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private searchService: SearchService) {
    }

    /**
     * Initalizes dropdown
     */
    ngOnInit() {
        this.initDropdown();
    }

    /**
     * Initializes or recreates dropdown menu of datasets
     */
    initDropdown() {
        this.searchChanged
            .pipe(
                distinctUntilChanged(),
                debounceTime(400),
                switchMap((changedParams: {[key: string]: string | number}) => {
                    return this.searchService.search({
                        ...changedParams,
                        'model[terms]': ApiModel.DATASET
                    });
                })
            )
            .subscribe(response => {

            this.removeDropdownMenu();

            if (!response['data'] || !response['data'].length) {
                return;
            }

            // recreate list of options to choose from
            const dropdown = this.createDropdownMenu();

            for (const dataset of response['data']) {
                this.renderer.appendChild(dropdown, this.createDropdownMenuItem(dataset));
            }
        });
    }

    /**
     * Creates dropdown menu
     * @returns dropdown menu
     */
    createDropdownMenu() {
        const dropdown = this.renderer.createElement('div');
        this.renderer.addClass(dropdown, 'dropdown-menu');
        this.renderer.addClass(dropdown, 'show');
        this.renderer.appendChild(this.elementRef.nativeElement.parentElement, dropdown);

        return dropdown;
    }

    /**
     * Removes dropdown menu
     */
    removeDropdownMenu() {
        const dropdownMenu = this.elementRef.nativeElement.parentElement.querySelector('.dropdown-menu');

        if (dropdownMenu) {
            this.renderer.removeChild(this.elementRef.nativeElement.parentElement, dropdownMenu);
        }
    }

    /**
     * Creates dropdown menu item
     * @param dataset
     * @returns dropdown menu item
     */
    createDropdownMenuItem(dataset): any {
        // button element
        const button = this.renderer.createElement('button');
        this.renderer.setProperty(button, 'type', 'button');
        this.renderer.addClass(button, 'dropdown-item');

        // button text
        dataset.attributes.title = StringHelper.stripHtmlTags(dataset.attributes.title);
        const buttonText = this.renderer.createText(dataset.attributes.title);
        this.renderer.appendChild(button, buttonText);

        // button click event
        const itemClickListener = this.renderer.listen(button, 'click', () => {
            this.renderer.setProperty(this.elementRef.nativeElement, 'value', dataset.attributes.title);
            this.renderer.setAttribute(this.elementRef.nativeElement, 'readonly', 'readonly');
            this.renderer.addClass(this.elementRef.nativeElement, 'form-control-plaintext');
            this.renderer.setStyle(this.elementRef.nativeElement, 'border', 0);

            this.datasetSelected.next(dataset);
        });

        this.dropdownItemClickListeners.push(itemClickListener);

        return button;
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.searchChanged.unsubscribe();

        if (this.dropdownItemClickListeners) {
            this.dropdownItemClickListeners.forEach(listener => listener());
        }
    }
}
