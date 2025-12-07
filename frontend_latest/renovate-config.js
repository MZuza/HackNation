module.exports = {
    endpoint: 'https://gitlab.dane.gov.pl/api/v4/',
    platform: 'gitlab',
    logLevel: 'debug',
    baseBranches: ['develop'],
    minor: true,
    major: false,
    assignees: ['jan.kruczkowski'],
    enabledManagers: ["npm"],
    labels: ['renovate'],
    onboardingConfig: {
        extends: ['config:base'],
    },
    repositories: ['mcod/frontend'],
};
