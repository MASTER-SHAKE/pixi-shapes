const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'vendor': './src/js/vendor.js',
        'app': './src/js/app.js',
        'style': './src/scss/style.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },

    resolve: {
        extensions: ['.js', '.css', '.scss', '.html'],
        modules: ['./src', './node_modules']
    },

    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader'
            }]
        },
        { // regular css files
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                loader: 'css-loader?importLoaders=1'
            })
        },
        { // sass / scss loader for webpack
            test: /\.(sass|scss)$/,
            loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
        }
        ]
    },
    devServer: {
        port: 9000
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
};
