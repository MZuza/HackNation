import { ResourceTableColumn } from '../resource-table/ResourceTableColumn';

/**
 * Resource Helper
 */
export class ResourceHelper {

    /**
     * Gets resource table columns
     * @param {any} response
     * @returns {ResourceTableColumn[]} table columns
     */
    static getTableColumns(response: any): ResourceTableColumn[] {
        const headers = {...response['meta']['headers_map']};
        const columns = Object.keys(headers).map(key => ({name: key, description: headers[key]}));

        const fields = [...response['meta']['data_schema']['fields']];
        const schema = fields.reduce((items, item) => {
            items[item.name] = item;
            return items;
        }, {});

        return columns.map(column => ({...column, ...schema[column.name]}));
    }

    /**
     * Gets Resource column data
     * @param rawData
     * @param key
     * @returns {string}
     */
    static getResourceColumnData(rawData: any, key: 'val' | 'repr'): any {
        if (rawData === null) {
            return null;
        }
        return (typeof rawData === 'object' ? rawData[key] : rawData) + '';
    }
}
