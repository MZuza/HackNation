const pluginName = 'VersionOutputWebpackPlugin';
const fs = require('fs');
const path = require('path');

class VersionOutputWebpackPlugin {

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.assetEmitted.tapPromise(pluginName,
            file => {
                return this.saveStylesHashToFile(file);
            });
    }

    saveStylesHashToFile(file) {
        return new Promise((resolve, reject) => {
            const isMainStyleFile = file.startsWith('styles') && file.endsWith('.css');
            if (!isMainStyleFile) {
                resolve()
                return;
            }
            const hash = file.split('.')[1];
            fs.writeFile(path.resolve(__dirname, this.options.outputPath), hash, err => {
                if (err) reject(err);
                resolve();
            });
        })
    }
}

module.exports = VersionOutputWebpackPlugin;
