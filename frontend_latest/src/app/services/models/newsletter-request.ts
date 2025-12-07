export interface NewsletterRequest {
    email: string;
    personal_data_processing: boolean;
    personal_data_use: boolean;
}

export interface NewsletterConsents {
    personal_data_processing: string;
    personal_data_use: string;
    personal_data_use_rules: string;
}
