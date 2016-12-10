var webpack = require('webpack');
var postcssImport = require('postcss-import');
var postcssUrl = require('postcss-url');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

module.exports = {
  plugins: [
    postcssImport({ addDependencyTo: webpack }),
    postcssUrl(),
    autoprefixer({ browsers: ['last 2 versions', '> 5%', 'Explorer >= 10', 'Android >= 2.3'] }),
    csswring()
  ]
};
