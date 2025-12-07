import * as template from 'lodash.template';
import * as templateSettings from 'lodash.templatesettings';

const _ = {
    template: template,
    templateSettings: templateSettings
};

_.templateSettings = {
  interpolate: /{{([\s\S]+?)}}/g,
  evaluate: /<%([\s\S]+?)%>/g
};

/**
 * Template helper to parse templates and url string
 */
export class TemplateHelper {

    /**
     * Use Regular Expression to find and parse parameters in url patterns
     * @example
     * TemplateHelper.parseUrl(\'/applications/:id/follow\', {id: 5});
     * // returns \'/applications/5/follow\'
     * @param {string} url
     * @param params
     * @returns {string}
     */
    static parseUrl(url: string, params: any): string {
        let nextUrl = url;
        for (const param in params) {
            if (params[param]) {
                const regex = new RegExp('(:' + param + ')', 'g');
                nextUrl = nextUrl.replace(regex, params[param]);
            }
        }
        return nextUrl;
    }

    /**
     * Compiles template outside of html files. Used in breadcrumbs to compile variables in routing
     *
     * ```ts
        TemplateHelper.compileTemplate('Hello {{ foo }}', {foo: 'world'});
        // returns 'Hello world';
       ```
     *
     * @param templateSource
     * @param binding
     */
    static compileTemplate(templateSource: string, binding: any): string {
        const templateFn = typeof _.template === 'function' ? _.template : _.template.default;
        const compiled = templateFn(templateSource);
        return compiled(binding);
    }

}
