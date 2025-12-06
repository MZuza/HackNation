import { AppPage } from './app.po';

describe('Application Module', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });
    describe('Application Page', () => {
        beforeEach(() => {
            page.navigateTo('/application');
        });

        it('should have good page url', function () {
            expect(page.getPageUrl()).toMatch(/application/gi);
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Aplikacje - Otwarte Dane');
            });
        });

        it('should display correct header', () => {
            page.getParagraphText().then(text => {
                expect(text).toContain('Aplikacje');
            });
        });

        it('should have results list', function () {
            expect(page.getResultList().count()).toBeGreaterThan(0);
        });

        it('should navigate to details', function () {
            let title = '';
            page.getFirstResultLink().getText().then(text => title = text);
            page.getFirstResultLink().click();
            expect(page.getPageUrl()).toMatch(/application\/\d*/gi);
            page.getParagraphText().then((detailsTitle) => {
                expect(detailsTitle).toBe(title);
            });
        });

    });
});
