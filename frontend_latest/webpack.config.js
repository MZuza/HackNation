const VersionOutputWebpackPlugin = require('./webpack.version.plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    plugins: [
        new VersionOutputWebpackPlugin({outputPath: 'dist/frontend/version.txt'}),
        new MomentLocalesPlugin({
            localesToKeep: ['en', 'pl'],
        })
    ]
};
