var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var extractTextPlugin = new ExtractTextPlugin(
  '[name].css'
);

var providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  '_': 'underscore',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
});

configuration = {
  entry: {
    main: './goldsprint/assets/js/main.js',
    vendor: [
      'bootstrap-sass',
      'jquery'
    ]
  },

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'goldsprint/assets/dist/'),
    publicPath: '',
    filename: '[name].js'
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass'])},
      {test: /\.woff$/, loader: "file?name=[name].[ext]"}
    ]
  },

  plugins: [
    extractTextPlugin,
    providePlugin
  ],

  sassLoader: {
    sourceMap: true
  }
};

module.exports = configuration;
