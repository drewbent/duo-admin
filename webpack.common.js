const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const DotEnvPlugin = require('dotenv-webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const PostCSSFlexbugsFixes = require('postcss-flexbugs-fixes')
const PostCSSNormalize = require('postcss-normalize')
const PostCSSPresetEnv = require('postcss-preset-env')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

/**
 * Config options that apply to both prod & dev
 */
module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                PostCSSFlexbugsFixes,
                PostCSSPresetEnv({
                  stage: 3,
                }),
                PostCSSNormalize,
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: 'public',
        to: '',
      },
    ]),
    new DotEnvPlugin(),
    new ManifestPlugin(),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
}
