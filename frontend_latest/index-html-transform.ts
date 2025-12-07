import { TargetOptions } from '@angular-builders/custom-webpack';

export default (targetOptions: TargetOptions, indexHtml: string) => {
    if (targetOptions.configuration === 'int' || targetOptions.configuration === 'pwa') {
        const i = indexHtml.indexOf('</head>');
        const config = `<link rel="manifest" href="manifest.webmanifest">`;
        return `${indexHtml.slice(0, i)}
            ${config}
            ${indexHtml.slice(i)}`;
    }
    return indexHtml;
};
