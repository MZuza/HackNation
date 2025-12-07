import { AppPage } from './app.po';

describe('od2018 App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });

    describe('Home Page', () => {
        beforeEach(() => {
            page.navigateTo('/');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Strona główna - Otwarte Dane');
            });
        });

        it('should display welcome message', () => {
            page.getParagraphText().then(text => {
                expect(text).toEqual('Korzystaj z danych!');
            });
        });
    });
});
