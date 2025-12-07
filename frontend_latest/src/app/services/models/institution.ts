export enum InstitutionSourceType {
    XML = 'xml',
    CKAN = 'ckan'
}

export interface IInstitutionSource {
    title: string;
    url: string;
    source_type: InstitutionSourceType;
}

export interface IInstitution {
    attributes: {
        city: string;
        created: string;
        description: string;
        email: string;
        epuap: string;
        fax: string;
        flat_number: string;
        image_url: string;
        institution_type: string;
        modified: string;
        postal_code: string;
        regon: string;
        slug: string;
        street: string;
        street_number: string;
        street_type: string;
        tel: string;
        title: string;
        website: string;
        notes: string;
        resources_count: number;
        datasets_count: number;
        sources?: IInstitutionSource [];
        source?: IInstitutionSource;
        abbreviation?: string;
        electronic_delivery_address: string;
    };
    count: number;
    id: string;
    links: any;
    relationships?: {
        datasets: {
            meta: {
                count: number
            };
            links: {
                related: string;
            }
        }
    };
    type: string;
}
