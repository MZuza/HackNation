import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SparqlExample } from '@app/pages/dataset/sparql/domain/SparqlExample';
import { ApiConfig } from '@app/services/api';
import { RestService } from '@app/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class SparqlService extends RestService {
  /**
   * Gets Examples
   * @returns Array<SparqlExample>}
   */
  getExamples(type: string): Array<SparqlExample> {
    if (type === 'dane') {
      return this.getExamplesForDane();
    } else {
      return this.getExamplesForKronika();
    }
  }

  getExamplesForDane(): Array<SparqlExample> {
    return [
      {
        displayName: {
          pl: 'Liczba rekordów danych',
          en: 'Number records of data',
        },
        codeSnippet: 'SELECT (count(?s) AS ?count)\n' + 'WHERE\n' + '{\n' + '   ?s a dcat:Dataset\n' + '}',
      },
      {
        displayName: {
          pl: 'Wszystkie rekordy URls',
          en: 'All URls records',
        },
        codeSnippet: 'SELECT * WHERE\n' + '{\n' + '   ?s a dcat:Dataset\n' + '} LIMIT 100',
      },
      {
        displayName: {
          pl: 'Zebrane katalogi',
          en: 'Collected catalogues',
        },
        codeSnippet:
          'SELECT ?title ?language ?homepage ?description ?harvestEndpoint ?publishername\n' +
          'WHERE\n' +
          '{\n' +
          '  ?catalogue a dcat:Catalog;\n' +
          'dct:title ?title;\n' +
          'dct:language ?language;\n' +
          'dct:description ?description;\n' +
          'dct:publisher ?publisher .\n' +
          '?publisher <http://xmlns.com/foaf/0.1/name> ?publishername .\n' +
          'OPTIONAL {\n' +
          '?catalogue <https://europeandataportal.eu/voc#harvestEndpoint> ?harvestEndpoint .\n' +
          '} OPTIONAL {\n' +
          '?catalogue <http://xmlns.com/foaf/0.1/homepage> ?homepage .\n' +
          '}}\n' +
          'LIMIT 100',
      },
    ];
  }

  getExamplesForKronika(): Array<SparqlExample> {
    return [
      {
        displayName: {
          pl: 'Dane udostępnione przez Narodowe Muzeum w Krakowie',
          en: 'Data published by the National Museum in Krakow',
        },
        codeSnippet:
          'SELECT ?o2\n' +
          'WHERE\n' +
          '{\n' +
          '?s dct:title ?o . ?s dcat:distribution ?o2\n' +
          ' . FILTER( CONTAINS(str(?o),"Zdigitalizowane%20zasoby%20Narodowego%20Muzeum%20w%20Krakowie" ) )\n' +
          '}',
      },
      {
        displayName: {
          pl: 'Lista instytucji udostępniających zbiory danych',
          en: 'List of institutions sharing datasets',
        },
        codeSnippet:
          'SELECT DISTINCT ?o2 WHERE\n' +
          '{\n' +
          '?s dct:publisher ?o . ?o foaf:name ?o2\n' +
          ' . FILTER(str(?s) != "http://kronik.gov.pl/gov_integr/KRONIK@")}',
      },
      {
        displayName: { pl: 'Liczba wszystkich danych', en: 'Total number of data' },
        codeSnippet: 'SELECT (count(?s) AS ?count)\n' + 'WHERE {?s a dcat:distribution}',
      },
      {
        displayName: {
          pl: 'Lista danych zawierających jedną z fraz „książek | książki | ksiąg | księga | książka”',
          en: 'List of data containing one of the phrases „książek | książki | ksiąg | księga | książka”',
        },
        codeSnippet:
          'SELECT ?s ?p ?o2\n' +
          'WHERE\n' +
          ' { ?s rdf:type dcat:distribution . ?s dct:description ?o . FILTER(regex(str(?o),\n' +
          ' "(książek|książki|ksiąg|księga|książka)", "i" ) || regex(str(?s),\n' +
          ' "(książek|książki|ksiąg|księga|książka)", "i" )) . OPTIONAL{ ?s ?p ?o2}}',
      },
    ];
  }

  /**
   * Gets default prefixes
   * @returns {string}
   */
  getDefaultPrefixes(): Observable<string> {
    return this.get(ApiConfig.sparql).pipe(
      map(({ data }) => {
        return data.map(({ attributes: item }) => {
          return `PREFIX ${item.prefix}: <${item.url}>`;
        });
      }),
    );
  }

  /**
   * Performs sparql search
   * @param sparql
   * @param format
   * @param externalSparql
   * @param page
   * @returns {Observable<{data: string, meta: {count: number}}> | Observable<{data: string, meta: {count: number}}>}
   */
  search(sparql: string, format: string, page: number, externalSparql: string): Observable<any> {
    const data = {
      data: {
        type: 'sparql',
        attributes: {
          q: sparql,
          format: format,
          external_sparql_endpoint: externalSparql === 'kronika' ? externalSparql : null,
          per_page: 100,
          page: page,
        },
      },
    };
    return this.post(ApiConfig.sparql, data, undefined);
  }
}
