import { Injectable } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { enGbLocale, plLocale } from 'ngx-bootstrap/locale';

const localName = 'bootstrap-language';

/**
 * Language Service for Bootstrap
 */
@Injectable()
export class LanguageBootstrapService {

    constructor(private ngxBootstrapLocalService: BsLocaleService) {
    }

    setBootstrapLanguage(language: string) {
        if (language === 'pl') {
            plLocale.invalidDate = '';
            defineLocale(localName, plLocale);
        } else {
            enGbLocale.invalidDate = '';
            defineLocale(localName, enGbLocale);
        }
        this.ngxBootstrapLocalService.use(language);
        this.ngxBootstrapLocalService.use(localName);
    }

}
