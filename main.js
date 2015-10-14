
/* import */
var restify = require('restify');
var Logger = require('bunyan');
var CookieParser = require('restify-cookies');
var _ = require("underscore");
var querystring = require('querystring');
var cookie = require('cookie');
var Promise = require("bluebird");
var nconf = require('nconf').argv().env();
var uuid = require('uuid');
require('gm-open-api')({
  channelId: Math.floor(nconf.get('GM_CHANNEL_ID') || 15)
});

var config = require('./conf/config');
var routes = require('./routes');
var gmfw = require('./common/gmframework');
var i18n = require('./i18n/i18n');
var packageInfo = require('./package.json');

function startServer() {

  // create Logger
  var log = new Logger({
    name       : packageInfo.name,
    streams    : [
      {
        level : 'info',
        path  : 'logs/info.log',
        type  : 'rotating-file',
        period: '1d',
        count : 7
      },
      {
        level : 'error',
        path  : 'logs/error.log',
        type  : 'rotating-file',
        period: '1d',
        count : 7
      }
    ],
    serializers: restify.bunyan.serializers
  });

  // create openapi server
  var server = restify.createServer({
    name: packageInfo.name,
    log : log
  });

  // server pre
  server.pre(function(req, res, next) {

    req.url = req.url.replace('buyer/', '');
    req.url = req.url.replace(/(buyerRestService\/)|(commonRestService\/)/, '');

    // handle app version no
    var qs = querystring.parse(req.getQuery());
    if (qs.v) {
      req.headers['accept-version'] = qs.v;
    }
    // record start time
    req.startTime = new Date().getTime();
    return next();
  });

  // server use
  server.use(CookieParser.parse);
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.gzipResponse());
  server.use(restify.jsonp());
  server.use(restify.bodyParser()); // 使得body参数,即用post时的参数也可以通过req.params取得,这样取参数时就不用区分get和post,都是用req.params来取得参数
  server.use(restify.queryParser()); // 使得query参数,即用get时的参数也可以通过req.params取得,这样取参数时就不用区分get和post,都是用req.params来取得参数

  // server after
  server.on('after', function(req, res, next, error) {
    var duration = new Date().getTime() - req.startTime;
    req.log.info({req: req}, {duration: duration, params: JSON.stringify(req.params)});
  });

  // 静态文件
  server.get(/\/$|\/index.html$|(\/version[0-9a-zA-Z]{6})?\/(js|assets)/, function(req, res, next) {

    req.url = req.url.replace(/\/version[0-9a-zA-Z]{6}/, '');

    if (req.url.indexOf('assets/') >= 0 || req.url.indexOf('js/') >= 0) {
      req.url = req.url.replace(/(assets\/|js\/)/, 'dist/$1');
    }

    if (req.url == '/') { // 根目录
      req.url = '/dist/index.html';
    } else if (req.url.indexOf('/index.html') === 0) {
      req.url = '/dist' + req.url;
    }

    next();
  }, restify.serveStatic({
    directory: './public'
  }));

  // mapping path and handler, all methods support GET, POST and JSONP
  _.each(routes.Routes, function(services, version) {
    _.each(services, function(handlers) {
      _.each(handlers, function(handleFn, path) {
        server.get({path: path, version: version}, function(req, res, next) {
          gmfw.fw.commonHandler.call(this, req, res, next, handleFn['handelFn']);
        });
        server.post({path: path, version: version}, function(req, res, next) {
          gmfw.fw.commonHandler.call(this, req, res, next, handleFn['handelFn']);
        });
      });
    });
  });

  server.get('user/i18n.gm', function(req, res, next) {
    var cookies = cookie.parse(req.headers.cookie || '');
    var language = cookies ? cookies['language'] : 'en';
    res.header('content-type', 'application/javascript');
    res.write('window.i18n = ' + JSON.stringify(i18n.getI18NContent(language)));
    res.end();
    res.send();
    return next();
  });

  // listen
  server.listen(nconf.get('PORT') || config.Server.port, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

module.exports = {
  startServer: startServer
};
