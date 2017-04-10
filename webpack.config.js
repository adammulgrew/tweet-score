const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HOST = '0.0.0.0';
const PORT = 8080;
const ASSET_PATH = path.resolve('src/')
const APP_FILE_PATH = `${ASSET_PATH}/js/index.js`

module.exports = {
	entry: {
		app: APP_FILE_PATH,
	},
	devtool: 'source-map',
	output: {
		path: path.resolve('public/js'),
		filename: 'index.js',
		sourceMapFilename: '[file].map',
	},
  	devServer: {
    	port: process.env.PORT || 8080,
      	host: HOST,
		port: PORT,
      	publicPath: '/',
      	contentBase: './src',
  	},
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [ASSET_PATH, 'node_modules']
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: { presets: ['es2015'] }
			}],
		}],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
};