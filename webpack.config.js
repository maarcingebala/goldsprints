var path = require('path');
var webpack = require('webpack');
var sourceDir = './goldsprint/static/js/';
var distDir = './goldsprint/static/dist/js/';

configuration = {
  watch: true,
  devtool: '#source-map',
  progress: true,
  entry: {
    main: sourceDir + 'main.js'
  },
  output: {
    filename: distDir + '[name].js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: "babel-loader"},
      {test: /\.json$/, loader: 'json'},
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      '_': 'underscore',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};

module.exports = configuration;
