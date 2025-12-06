import { Directive, ElementRef, HostListener, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

import { StringHelper } from '@app/shared/helpers/string.helper';

/**
 * Schedule Custom Dropdown Directive
 */
@Directive({
    selector: '[appScheduleCustomDropdown]',
    standalone: true
})
export class ScheduleCustomDropdownDirective implements OnDestroy {

    /**
     * @ignore
     */
    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    /**
     * Gets dropdown menu node
     */
    get dropdownMenu(): any {
        return this.elementRef.nativeElement.parentElement.querySelector('.dropdown-menu');
    }

    /**
     * Dropdown items
     */
    @Input('dropdownItems') items: any[];

    /**
     * Property to display
     */
    @Input('dropdownItemsDisplayedProperty') displayedProperty: string;

    /**
     * Dropdown id
     */
    @Input('dropdownId') dropdownId: string;

    /**
     * Selected value (property value)
     */
    @Output() dropdownItemSelected = new Subject<string>();

    /**
     * Selected value (property value)
     */
    @Output() isDropdownExpanded = new Subject<boolean>();

    /**
     * Dropdown item event listeners
     */
    dropdownItemClickListeners: any[] = [];

    /**
     * Default index on init
     */
    defaultIndex = -1;

    /**
     * Active index
     */
    activeIndex = this.defaultIndex;

    /**
     * Previous active index
     */
    previousIndex = this.defaultIndex;

    /**
     * Listens on clicks outside the host (input) to remove dropdown
     * @param {Event} event
     */
    @HostListener('document:click', ['$event']) onDocumentClick(event: Event) {
        if (event.target !== this.elementRef.nativeElement) {
            this.removeDropdownMenu();
        }
    }

    /**
     * Enables keyboard navigation.
     * Performs actions on keyboard events.
     * @param {KeyboardEvent} event
     */
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                this.setNextActiveIndex();
                break;

            case 'ArrowUp':
                this.setPreviousActiveIndex();
                break;

            case 'Enter':
                this.dropdownMenuItemClick();
                break;

            case 'Tab':
                this.removeDropdownMenu();
                break;

            case 'Space':
                if (event.shiftKey) {
                    this.initDropdown();
                    event.preventDefault();
                }
                break;
        }
    }

    /**
     * Listens on focus events on hosted input to initialize dropdown
     * @param {FocusEvent} event
     */
    @HostListener('focus', ['$event']) onFocus(event: FocusEvent) {
        this.initDropdown();
    }

    /**
     * Sets next index on the list as active
     */
    setNextActiveIndex() {
        this.previousIndex = this.activeIndex;

        if (this.activeIndex === this.defaultIndex) {
            this.activeIndex = 0;
        } else if (this.activeIndex === this.items.length - 1) {
            this.activeIndex = this.defaultIndex;
        } else {
            this.activeIndex++;
        }

        this.markActiveItem(true);
    }

    /**
     * Sets previous index on the list as active
     */
    setPreviousActiveIndex() {
        this.previousIndex = this.activeIndex;

        if (this.activeIndex === this.defaultIndex) {
            this.activeIndex = this.items.length - 1;
        } else if (this.activeIndex === 0) {
            this.activeIndex = this.defaultIndex;
        } else {
            this.activeIndex--;
        }

        this.markActiveItem(true);
    }

    markActiveItem(scroll = false) {
        const buttons = this.dropdownMenu.querySelectorAll('button') as HTMLButtonElement[];

        if (this.previousIndex !== this.defaultIndex && this.previousIndex !== this.items.length) {
            this.renderer.removeClass(buttons[this.previousIndex], 'active');
        }

        if (this.activeIndex !== this.defaultIndex && this.activeIndex !== this.items.length) {
            this.renderer.addClass(buttons[this.activeIndex], 'active');

            if (scroll) {
                const activeButton = buttons[this.activeIndex];
                let offsetTop = 0;

                if ((activeButton.offsetTop + activeButton.offsetHeight) > (<HTMLDivElement>this.dropdownMenu).offsetHeight) {
                    offsetTop = activeButton.offsetTop - activeButton.offsetHeight;
                } else {
                    offsetTop = 0;
                }

                (this.dropdownMenu as HTMLDivElement).scroll({
                    top: offsetTop,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Initializes or recreates dropdown menu
     */
    initDropdown() {
        this.removeDropdownMenu();

        const dropdown = this.createDropdownMenu();
        const inputValue = (<HTMLInputElement>this.elementRef.nativeElement).value.trim();

        this.items.forEach((item, index) => {
            this.renderer.appendChild(dropdown, this.createDropdownMenuItem(item, index));

            if (inputValue === item[this.displayedProperty]) {
                this.activeIndex = index;
            }
        });

        this.markActiveItem(true);

        if (this.items?.length) {
            this.isDropdownExpanded.next(true);
        }
    }

    /**
     * Creates dropdown menu
     * @returns dropdown menu
     */
    createDropdownMenu(): any {
        const dropdown = this.renderer.createElement('div');
        this.renderer.addClass(dropdown, 'dropdown-menu');
        this.renderer.addClass(dropdown, 'show');
        this.renderer.setStyle(dropdown, 'max-height', '190px');
        this.renderer.setStyle(dropdown, 'overflow', 'auto');
        this.renderer.setAttribute(dropdown, 'tabindex', '-1');
        this.renderer.setAttribute(dropdown, 'id', this.dropdownId);
        this.renderer.appendChild(this.elementRef.nativeElement.parentElement, dropdown);

        return dropdown;
    }

    /**
     * Removes dropdown menu
     */
    removeDropdownMenu() {
        if (!this.dropdownMenu) {
            return;
        }

        this.activeIndex = this.defaultIndex;
        this.renderer.removeChild(this.elementRef.nativeElement.parentElement, this.dropdownMenu);
        this.isDropdownExpanded.next(false);
    }

    /**
     * Creates dropdown menu item
     * @param {any} item
     * @param {number} index
     * @returns dropdown menu item
     */
    createDropdownMenuItem(item: any, index: number): any {
        // button element
        const button = this.renderer.createElement('button');
        this.renderer.setProperty(button, 'type', 'button');
        this.renderer.setAttribute(button, 'tabindex', '-1');
        this.renderer.setAttribute(button, 'role', 'option');
        this.renderer.addClass(button, 'dropdown-item');

        // displayed text
        item[this.displayedProperty] = StringHelper.stripHtmlTags(item[this.displayedProperty]);
        const buttonText = this.renderer.createText(item[this.displayedProperty]);
        this.renderer.appendChild(button, buttonText);

        // click event
        const itemClickListener = this.renderer.listen(button, 'click', () => {
            this.dropdownMenuItemClick();
        });

        // mouseenter event
        const itemMouseEnterListener = this.renderer.listen(button, 'mouseenter', () => {
            this.previousIndex = this.activeIndex;
            this.activeIndex = index;
            this.markActiveItem();
        });

        // mouseleave event
        const itemMouseLeaveListener = this.renderer.listen(button, 'mouseleave', () => {
            this.previousIndex = this.activeIndex;
            this.activeIndex = this.defaultIndex;
            this.markActiveItem();
        });

        this.dropdownItemClickListeners.push(itemClickListener);
        this.dropdownItemClickListeners.push(itemMouseEnterListener);
        this.dropdownItemClickListeners.push(itemMouseLeaveListener);

        return button;
    }

    /**
     * Sets host (input) value. Emits value outside.
     */
    dropdownMenuItemClick() {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.items[this.activeIndex][this.displayedProperty]);
        this.dropdownItemSelected.next(this.items[this.activeIndex][this.displayedProperty]);
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        if (this.dropdownItemClickListeners) {
            this.dropdownItemClickListeners.forEach(listener => listener());
        }
    }
}
