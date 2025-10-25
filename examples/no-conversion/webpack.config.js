const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AwakeJsPlugin = require('../../dist/index.js');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new AwakeJsPlugin({
      convertSrcToDataSrc: false, // Don't convert src attributes
      timeout: 3000
    })
  ]
};
