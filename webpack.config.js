const path = require('path');
const VERSION = require('./package.json').version;
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'sugar.js',
    library: 'Sugar',
    libraryExport: 'Sugar',
  },
  optimization: {
    usedExports: true
  },
  // This can't be an array: https://webpack.js.org/guides/author-libraries/
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: path.resolve(__dirname, './src/core/index.js'),
        loader: 'string-replace-loader',
        options: {
          search: "'edge'",
          replace: JSON.stringify(VERSION)
        }
      }
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd(),
    }),
  ],
};
