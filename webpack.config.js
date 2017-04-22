const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        'chrome': 'chrome'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new CopyWebpackPlugin([
            {from: './popup.html'},
            {from: './manifest.json'},
            {from: './assets/', to: './assets/'},
            {from: './assets/icon/', to: './assets/icon/'}
        ])
    ]
};
