/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1698131541708_5505';

  // CSRF
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.static = {
    prefix: '/images/', // 访问静态资源的 URL 前缀
    dir: path.join(appInfo.baseDir, 'app/public'), // 静态资源文件夹的绝对路径
  };

  config.jwt = {
    secret: '123',
  };

  // add your middleware config here
  config.middleware = [ 'parseUid' ];

  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [ 'connection' ],
        packetMiddleware: [],
      },
    },
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    mysql: {
      client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '149517',
        // 数据库名
        database: 'chat-data',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
