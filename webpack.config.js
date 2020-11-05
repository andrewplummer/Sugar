const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { version } = require('./package.json');

const { NODE_ENV = 'development' } = process.env;
const PROD = NODE_ENV === 'production';

module.exports = {
  mode: NODE_ENV,
  devtool: PROD ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    filename: 'sugar.js',
    library: 'Sugar',
    libraryExport: 'default',
  },
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd(),
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(PROD ? version : 'edge'),
    }),
  ],
};
