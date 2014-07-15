var annotate = require('./annotate');

var store = {};
var riccardo = {};
riccardo.set = function (key, value) {
  store[key] = value;
};
riccardo.get = function (key) {
  return store[key];
};
riccardo.inject = function (func, names) {
  names = names || annotate(func);
  var lazy = [], args = [];

  for (var i = 0; i < names.length; i++) {
    var value = riccardo.get(names[i]);
    if (value !== undefined) {
      args.push(value);
    } else {
      lazy.push(i);
      args.push(undefined);
    }
  }

  var addArg = function (value) {
    if (lazy.length) {
      args[lazy[0]] = value;
      lazy.shift();
    } else {
      args.push(value);
    }
  };

  return function () {
    var argsRun = Array.prototype.slice.call(arguments);
    argsRun.forEach(function (arg) {
      addArg(arg);
    });
    return func.apply(this, args);
  };
};
riccardo.lazy = function (func) {
  var names = annotate(func);
  return function () {
    return riccardo.inject(func, names).apply(this, arguments);
  };
};
riccardo.$ = riccardo.lazy;
module.exports = riccardo;