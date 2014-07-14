var annotate = require('./annotate');

var store = {};
var riccardo = {
  set: function (key, value) {
    store[key] = value;
  },
  get: function (key) {
    return store[key];
  },
  inject: function (func) {
    var names = annotate(func);
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
      func.apply(this, args);
    };
  }
};

riccardo.$ = riccardo.inject;
module.exports = riccardo;