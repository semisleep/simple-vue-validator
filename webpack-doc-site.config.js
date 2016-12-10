'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'examples': './doc-site/examples.js'
  },
  output: {
    path: path.resolve(__dirname, 'doc-site/dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      /*
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      */
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    hot: true,
    inline: true,
    // https: true,
    port: 8080,
    contentBase: path.resolve(__dirname, 'doc-site')
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
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
