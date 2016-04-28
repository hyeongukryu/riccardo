var doAnnotate = require('get-parameter-names');

module.exports = function annotate(fn) {
  return doAnnotate(fn);
};
