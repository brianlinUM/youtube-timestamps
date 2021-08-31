const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    // prevent webpack from using unsafe eval, violating chrome CSP.
    // https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
    // needs to be inline since chrome extension won't load
    // file source map.
    // https://stackoverflow.com/questions/61462586/can-i-enable-sourcemaps-in-a-chrome-extension
    devtool: 'inline-source-map',
});
