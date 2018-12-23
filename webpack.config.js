
const path = require('path');
const VERSION = require('./package.json').version;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'sugar.js',
    library: 'Sugar',
    libraryExport: 'default'
  },
  optimization: {
    usedExports: true
  },
  // This can't be an array: https://webpack.js.org/guides/author-libraries/
  entry: './src/all',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  targets: [
                    '> 1%',
                    'not dead',
                    'last 2 versions',
                    'ie >= 9',
                  ]
                }
              ],
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
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
  }
};
