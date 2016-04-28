var doAnnotate = require('function-args');

module.exports = function annotate(fn) {
  return doAnnotate(fn).map(function (a) { return a.trim(); });
};
