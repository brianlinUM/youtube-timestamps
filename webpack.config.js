const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
    entry: {
        content: path.resolve(__dirname, "src/content.js"),
        popup: path.resolve(__dirname, "src/popup.js"),
        background: path.resolve(__dirname, "src/background.js"),
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].bundle.js',
    },
    mode: 'production',
    // fix webpack using unsafe eval, violating chrome CSP.
    // https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
    // needs to be inline since chrome extension won't load
    // file source map.
    // https://stackoverflow.com/questions/61462586/can-i-enable-sourcemaps-in-a-chrome-extension
    // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader'
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],
}
