var assert = require('assert');

module.exports = {
  checkFunctionExists: function (obj, name, printName) {
    if (!printName) {
      printName = name;
    }
    it('함수 ' + printName + ' 있어야 합니다.', function () {
      assert.strictEqual(typeof obj[name], 'function');
    });
  }
};