export interface LicenseRule {
    name: string;
    description: string;
}

export interface License {
    link: string;
    secondLink: string;
}

export interface ZeroLicense extends License {
    description: LicenseRule;
}

export interface LicenseWithRules extends License {
    allowed: Array<LicenseRule>;
    conditions: Array<LicenseRule>;
}
