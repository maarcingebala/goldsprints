var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var extractTextPlugin = new ExtractTextPlugin(
  '[name].css'
);


configuration = {
  contex: __dirname,
  devtool: 'source-map',
  entry: [
    './assets/js/main',
  ],

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name].js',
    publicPath: ''
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass'])},
      {test: /\.woff$/, loader: "file?name=[name].[ext]"},
      {test: /\.(png|jpg)$/, loader: 'url-loader'},
      {
        test: /\.(eot|otf|png|svg|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
        loader: 'file?name=[name].[hash].[ext]',
        include: [
          path.resolve(__dirname, 'node_modules')
        ]
      }
    ]
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    extractTextPlugin
  ],

  sassLoader: {
    sourceMap: true
  },

  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8000',
        secure: false
      }
    }
  }
};

module.exports = configuration;
