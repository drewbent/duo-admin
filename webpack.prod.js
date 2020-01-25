const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: 'main',
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin(['API_URL']),
    new HtmlWebpackPlugin({
      inject: true,
      path: path.resolve(__dirname, 'dist'),
      filename: '../index.html',
      template: 'index.html',
    }),
    new InterpolateHtmlPlugin(
      {
        'STATIC_URL': '/static',
      },
    ),
  ],
  output: {
    globalObject: 'this',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist', 'static'),
    publicPath: '/static/',
  },
})
