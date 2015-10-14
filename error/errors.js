
var gmfw = require('../common/gmframework').fw;

gmfw.regError('OtherError', 400, module);
gmfw.regError('RemoteAPIInternalError', 500, module); // 远程API内部执行错误

