import { AppPage } from './app.po';

describe('Users Module', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });

    describe('Register Page', () => {
        beforeEach(() => {
            page.navigateTo('/user/register?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Zarejestruj się - Otwarte Dane');
            });
        });

        it('should display header', () => {
            page.getParagraphText().then(text => {
                expect(text).toEqual('Rejestracja');
            });
        });
    });

    describe('Login Page', () => {
        beforeEach(() => {
            page.navigateTo('/user/login?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('Zaloguj się - Otwarte Dane');
            });
        });

        it('should display header', () => {
            page.getParagraphText().then(text => {
                expect(text).toEqual('Logowanie');
            });
        });
    });
});
