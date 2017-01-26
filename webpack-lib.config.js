'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'plugin': './src/index.js'
  },
  output: {
    library: 'SimpleVueValidator',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      /*
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
      */
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    hot: true,
    inline: true,
    // https: true,
    port: 8080,
    contentBase: path.resolve(__dirname, 'test/web')
  },
  devtool: '#source-map'
};

module.exports.plugins = [];

if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
