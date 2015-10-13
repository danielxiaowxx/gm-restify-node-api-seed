/**
 * Author: Daniel
 * 单元测试用到了nodeunit，具体的测试API方法请参考https://github.com/caolan/nodeunit#api-documentation
 * http请求用到了request，具体的请求方法请参考https://github.com/mikeal/request#convenience-methods
 */

var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var reporter = require('./reporters/jsonReporter');

// 常规的测试，即每个Http请求单元测试都需要测试这些步骤
function commonHTTPTest(test, error, body) {
    var pass = true;
    if (error) {
        pass = false;
        test.ok(false, error);
    } else if (!body || body.code) {
        pass = false;
        test.ok(false, body ? JSON.stringify(body) : 'response body is null');
    }
    return pass;
}

exports.openapi_unittest = {
    setUp: function (callback) {

        // config
        this.server = 'http://localhost:8080';

        this.httpRequest = request.defaults({
            json: true
        });

        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    '1.0.0': {
    }
}


reporter.run(['unittest/unittest.js'], {}, function(err, result) {
    fs.writeFile(process.cwd() + '/unittest/report/data/data.json', 'var TEST_DATA = ' + JSON.stringify(result), function(err) {
        if (err) throw err;
        console.log('Generate test result data successful!');
        process.exit();
    });
});

