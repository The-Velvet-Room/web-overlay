var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = [
{
    name: 'client',
    target: 'web',
    entry: './client/index',
    output: {
        path: path.resolve(__dirname, 'build/dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
        ]
    }
},
{
    name: 'server',
    entry: './bin/www',
    target: 'node',
    plugins: [
        new webpack.DefinePlugin({
            __dirname_webpack: JSON.stringify(path.resolve(__dirname, 'build'))
        })
    ],
    externals: nodeModules,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ]
    }
}];