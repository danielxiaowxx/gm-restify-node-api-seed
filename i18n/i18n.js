/**
 * Created by danielxiao on 15/4/10.
 */

var en = require('./en');
var zh_CN = require('./zh_CN');

exports.getI18NContent = function(language) {
    switch (language) {
        case 'en':
            return en.i18nData;
        case 'zh_CN':
            return zh_CN.i18nData;
        default:
            return en.i18nData;
    }
};
