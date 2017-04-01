var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var resolve = path.resolve.bind(path, __dirname);

configuration = {
  contex: __dirname,
  devtool: 'source-map',
  entry: './assets/js/main',

  output: {
    path: resolve('assets/bundles/'),
    filename: '[name].js',
    publicPath: '/static/bundles/'
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass'])},
      {test: /\.woff$/, loader: "file?name=[name].[ext]"},
      {test: /\.mp3$/, loader: 'file?name=[name].[ext]'},
      {test: /\.(png|jpg)$/, loader: 'url-loader'},
      {
        test: /\.(eot|otf|png|svg|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
        loader: 'file?name=[name].[hash].[ext]',
        include: [
          resolve('node_modules')
        ]
      }
    ]
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new ExtractTextPlugin('[name].css')
  ],

  sassLoader: {
    sourceMap: true
  }
};

module.exports = configuration;
