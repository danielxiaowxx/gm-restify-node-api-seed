
var demo = require('../api/demo');

exports.Routes = {
    '1.0.0': {
        'Demo': {
            'demo/sayHello': {handleFnName:'demo.sayHello', handelFn:demo.sayHello}
        }
    }
};
