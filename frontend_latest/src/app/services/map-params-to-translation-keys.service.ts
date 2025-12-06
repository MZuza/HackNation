import {Injectable} from '@angular/core';
import {Params} from '@angular/router';

/**
 * Service for mapping filter params names to translation keys
 */
@Injectable({
    providedIn: 'root'
})
export class MapParamsToTranslationKeysService {

    /**
     * Translations map
     */
    readonly filterParamsTranslations = {
        'category[id][terms]': 'Attribute.CategoryLong',
        'institution[id][terms]': 'Attribute.InstitutionLong',
        'format[terms]': 'Attribute.FormatLong',
        'openness_score[terms]': 'Attribute.OpennessScore',
        'types[terms]': 'Attribute.ResourceType',
        'visualization_types[terms]': 'Attribute.VisualizationType',
        'date[gte]': 'Attribute.DateRange',
        'date[lte]': 'Attribute.DateRange'
    };

    /**
     * Returns array with filters translations (only one date translation), skipp basicParams such as per_page etc.
     * @param {Params} filters
     * @return {string[]}
     */
    getFiltersTranslations(filters: Params): string[] {

        let hasAlreadyDateParamOnList = false;
        const translationsList = [];

        for (const paramName in filters) {
            const isDataParam = (/^date/).test(paramName);
            const translationsHasPropertyParamName = this.filterParamsTranslations.hasOwnProperty(paramName);

            if (translationsHasPropertyParamName && !(hasAlreadyDateParamOnList && isDataParam)) {
                hasAlreadyDateParamOnList = hasAlreadyDateParamOnList || isDataParam;
                translationsList.push(this.filterParamsTranslations[paramName]);
            }
        }
        return translationsList;
    }
}
