import { browser, by, element } from 'protractor';

export class AppPage {

    navigateTo(dest: string = '/') {
        return browser.get(dest);
    }

    setRodoStorage() {
        browser.executeScript('localStorage.setItem(\'OD_isAcquintedWithRodo\', \'true\');');
    }

    getPageTitle() {
        return browser.getTitle();
    }

    async getPageUrl(): Promise<string> {
        return browser.getCurrentUrl();
    }

    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }

    getCategoryList() {
        return element.all(by.css('app-root ul.category-list > li'));
    }

    getResultList() {
        return element.all(by.css('app-root .result-item'));
    }

    getFirstResultLink() {
        // browser.wait(item, 5000, 'Item should be rendered within 5 seconds');
        return element.all(by.css('app-root .result-item > h2 > a')).first();
    }
}
