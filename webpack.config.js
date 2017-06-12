var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

module.exports = {
  entry: "./src/js/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.(css|scss)$/,
      use: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: ['css-loader', 'postcss-loader', 'sass-loader'],
        publicPath: '/dist'
      })
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.pug$/,
      loader: ['html-loader', 'pug-html-loader']
    }, {
      test: /\.(png|jpg|ico|json|svg)$/,
      use: "file-loader?name=[path][name].[ext]?[hash]&publicPath=./&outputPath=./"
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    stats: "errors-only",
    open: true
  },
  resolve: {
    alias: {
      'img': path.resolve(__dirname, './src/img')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: './index.html',
      template: './src/pug/index.pug'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: './pie.html',
      template: './src/pug/page/pie.pug'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: './donut.html',
      template: './src/pug/page/donut.pug'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: './line.html',
      template: './src/pug/page/line.pug'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: './bar.html',
      template: './src/pug/page/bar.pug'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: './barp.html',
      template: './src/pug/page/barp.pug'
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    })
  ]
};
