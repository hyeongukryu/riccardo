var fnArgs = require('function-arguments');

module.exports = function annotate(fn) {
  return fnArgs(fn);
};
