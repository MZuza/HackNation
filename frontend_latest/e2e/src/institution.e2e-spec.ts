import { AppPage } from './app.po';

describe('Institution Module', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });
    describe('Institution Page', () => {
        beforeEach(() => {
            page.navigateTo('/institution?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Instytucje - Otwarte Dane');
            });
        });

        it('should display correct header', () => {
            page.getParagraphText().then(text => {
                expect(text).toContain('Instytucje');
            });
        });

        it('should have category list', function () {
            expect(page.getCategoryList().count()).toBeGreaterThan(0);
        });

        it('should navigate to details', function () {
            let title = '';
            page.getCategoryList().first().$$('.heading').getText().then(text => title = text[0]);
            page.getCategoryList().first().$$('a').click();
            expect(page.getPageUrl()).toMatch(/institution\/\d*/gi);
            page.getParagraphText().then((detailsTitle) => {
                expect(title).toBe(detailsTitle);
            });
        });

    });
});
