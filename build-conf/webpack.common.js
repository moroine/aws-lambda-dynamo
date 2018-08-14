const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '..', 'build')]),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '..', 'package.json'), to: path.resolve(__dirname, '..', 'build')}
    ])
  ],
  target: 'node',
  externals: [ nodeExternals() ]
};
