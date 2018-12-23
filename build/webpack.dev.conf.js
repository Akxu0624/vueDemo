'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const pg = require('pg'); // 引入连接postgreSql的pg模块
var url = require('url');
var util = require('util');

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before (app) {
      const conStr = "postgres://postgres:123456@127.0.0.1:5432/postgres";
      app.get('/api/json/data', (req, res) => {
        res.send(require('../src/api/json/data.json'));
      });
      app.get('/api/server/storyList', (req, res) => {
        var client = new pg.Client(conStr);
        var query = url.parse(req.url, true).query;
        var sql = 'SELECT * FROM storyList';
        if (query.id) {
          sql = `SELECT * FROM storyList WHERE id ='${query.id}'`;
        }
        client.connect((isErr) => {
            if (isErr) {
              console.log('connect error:' + isErr.message);
              client.end();
              return;
            }
            client.query(sql, [], function (isErr, data) {
              res.send(JSON.stringify({
                data: data.rows,
                total: data.rowCount
              }));
              client.end()
            })
        })
      });
      app.post('/api/server/storyList/add', (req, res) => {
        var client = new pg.Client(conStr);
        // 定义了一个post变量，用于暂存请求体的信息
        var params = '';
        var sql = '';   
    
       // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到params变量中
        req.on('data', function(chunk){    
            params += chunk;
        });
    
       // 在end事件触发后，通过querystring.parse将params解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function(){
          params = JSON.parse(params)
          sql = `INSERT INTO public.storylist (title,details,url,id)
          VALUES ('${params.title}','${params.details}','${params.url}',${params.id})`;
          client.connect((isErr) => {
              if (isErr) {
                console.log('connect error:' + isErr.message);
                client.end();
                return;
              }
  
              client.query(sql, [], function (isErr, data) {
                res.end();
                client.end();
              })
          })
        });
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
