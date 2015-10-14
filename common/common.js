
var errors = require('../error/errors');


/**
 * 处理远程API错误
 * @param data
 */
exports.handleRemoteAPIError = function(data) {
  data = data === undefined ? {} : data;
  if (data.hasOwnProperty('error')) {
    if (data.error) {
      throw new errors.RemoteAPIInternalError(data.errorMsg);
      // {errorCode:, errorMsg:, errorType:}

    }
  }
  console.log(JSON.stringify(data));
};
