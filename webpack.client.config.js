const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

//const reactPatch = require.resolve('react-hot-loader/patch');
const babelPollyfill = require.resolve('babel-polyfill');

const nodeEnv = process.env.ENV || 'development';

const basePlugins = [
    new MiniCssExtractPlugin({
        filename: `css/[name].css`
    }),
    new CopyWebpackPlugin([
        {from: 'src/index.html'},
        {from: 'src/stub', to: 'stub'},
        {from: 'src/img', to: 'img'}
    ]),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': `'${nodeEnv}'`,
    })
];

module.exports = {
    mode: nodeEnv,
    entry: {
        client: [
            './src/index.js'
        ],
        init: [
            './src/initialize.js',
            babelPollyfill
        ],
        main: './src/css/main.css'
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'static'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
          { test: /\.txt$/, use: 'raw-loader' },
          { test: /\.(png|gif|jp?g)$/, use: [
              {
                  loader: 'file-loader', options: { name: 'images/[name].[ext]' }
              }
            ]    
          },
          { test: /\.css$/, use: [
              { loader: MiniCssExtractPlugin.loader, },
              "css-loader"
            ] 
          },
          { test: /\.js$/, use: [
              { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react']} }
            ],
            exclude: [
                /node_modules/,
                /server/
            ]
          },
          { test: /\.jsx$/, use: [
              { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react']} }
            ],
            exclude: /node_modules/
          }
        ]
    },
    plugins: basePlugins,
    devtool: nodeEnv === 'development' ? 'source-map' : '',
    devServer: {
        proxy: {
            '/api': {
                changeOrigin: true,
                secure: false,
                target: 'http://localhost:9000/',
                pathRewrite: {'^/api/': '/'},
            },
            '/**': {
                target: 'http://localhost:9000'
            }
        },
    },
}