export interface IFeatureFlag {
    name: string;
    enabled: boolean;
    description?: string;
    createdAt?: string;
    strategies?: IStrategy[];
}

export interface IStrategy {
    name: string;
    parameters: {
        envNames?: string;
        hostNames?: string;
    };
}
