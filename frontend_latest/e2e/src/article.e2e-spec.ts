import { AppPage } from './app.po';

describe('Articles Module', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });
    describe('Articles Page', () => {
        beforeEach(() => {
            page.navigateTo('/article?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Aktualności - Otwarte Dane');
            });
        });

        it('should display correct header', () => {
            page.getParagraphText().then(text => {
                expect(text).toContain('Aktualności');
            });
        });

        it('should have results list', function () {
            expect(page.getResultList().count()).toBeGreaterThan(0);
        });

        it('should navigate to details', function () {
            let title = '';
            page.getFirstResultLink().getText().then(text => title = text);
            page.getFirstResultLink().click();
            expect(page.getPageUrl()).toMatch(/article\/\d*/gi);
            page.getParagraphText().then((detailsTitle) => {
                expect(detailsTitle).toBe(title);
            });
        });

    });
});
