const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const nodeEnv = process.env.ENV || 'development';

const basePlugins = [
    new CopyWebpackPlugin([
        {from: './package-base.json', to: 'package.json'},
    ]),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': `'${nodeEnv}'`,
    })
];

module.exports = {
    target: 'node',
    entry: {
        server: [
            './server/server.js',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
/*          { test: /\.txt$/, use: 'raw-loader' },
          { test: /\.json$/, use: 'raw-loader' },
          { test: /\.js$/, use: [
              { loader: 'babel-loader', options: { presets: ['@babel/preset-env']} }
            ],
            exclude: [
                /node_modules/,
            ]
          }*/
        ]
    },
    plugins: basePlugins
}