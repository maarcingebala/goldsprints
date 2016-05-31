var path = require('path');
var webpack = require('webpack');
var sourceDir = './goldsprint/static/js/';
var distDir = './goldsprint/static/dist/js/';

configuration = {
  watch: true,
  devtool: '#source-map',
  progress: true,
  entry: {
    main: sourceDir + 'main.jsx'
  },
  output: {
    filename: distDir + '[name].js'
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: "babel-loader"},
      {test: /\.js$/, include: /node_modules\/foundation-sites/, loader: "babel-loader"},
      {test: /\.json$/, loader: 'json'},
      //{test: require.resolve("jquery"), loader: "expose?jQueryDebug"},
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
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
