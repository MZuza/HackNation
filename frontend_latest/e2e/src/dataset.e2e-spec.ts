import { AppPage } from './app.po';

describe('Dataset Module', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });
    describe('Dataset Page', () => {
        beforeEach(() => {
            page.navigateTo('/dataset?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Zbiory danych - Otwarte Dane');
            });
        });

        it('should display correct header', () => {
            page.getParagraphText().then(text => {
                expect(text).toContain('Zbiory danych');
            });
        });

        it('should have results list', function () {
            expect(page.getResultList().count()).toBeGreaterThan(0);
        });

        it('should navigate to details', function () {
            let title = '';
            page.getFirstResultLink().getText().then(text => title = text);
            page.getFirstResultLink().click();
            expect(page.getPageUrl()).toMatch(/dataset\/\d*/gi);
            page.getParagraphText().then((detailsTitle) => {
                expect(detailsTitle).toBe(title);
            });
        });

    });
});
