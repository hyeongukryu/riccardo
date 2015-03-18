var path = require('path');
var callsite = require('callsite');
var capitalizer = require('./capitalizer')();
var glob = require('glob');

module.exports = function Riccardo() {

  var annotate = require('./annotate');
  var store = {};
  var factories = {};

  var riccardo = this;

  function set(key, value) {
    if (store[key] === undefined) {
      store[key] = value;
    }
    return riccardo;
  }

  function get(key) {
    if (store[key] !== undefined) {
      return store[key];
    }
    if (factories[key] !== undefined) {
      var value = factories[key];
      if (value === false) {
        throw new Error(key + '에 연관된 순환 의존성이 있습니다.');
      }
      factories[key] = false;
      value = inject(value);
      factories[key] = undefined;
      var obj = value();
      set(key, obj);
      return obj;
    }
    return undefined;
  }

  function factory(key, value) {
    if (factories[key] === undefined) {
      factories[key] = value;
    }
    return riccardo;
  }

  function inject(func, names) {
    names = names || annotate(func);
    var lazyArgs = [], args = [];

    for (var i = 0; i < names.length; i++) {
      var value = get(names[i]);
      if (value !== undefined) {
        args.push(value);
      } else {
        lazyArgs.push(i);
        args.push(undefined);
      }
    }

    var addArg = function (value) {
      if (lazyArgs.length) {
        args[lazyArgs[0]] = value;
        lazyArgs.shift();
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
  }

  function lazy(func) {
    var names = annotate(func);
    return function () {
      return inject(func, names).apply(this, arguments);
    };
  }

  function scan(dir, namespace) {
    if (namespace === undefined) {
      namespace = dir;
    }
    if (namespace !== '') {
      namespace = capitalizer.toPascalCase(namespace);
    }

    var caller = callsite()[1].getFileName();
    var parent = path.dirname(caller);
    dir = path.join(parent, dir);

    var files = glob.sync(dir + '/**/*.js');
    files.forEach(function (file) {
      var key = path
        .relative(dir, file)
        .split('.js')
        .join('')
        .split(path.sep)
        .reverse()
        .map(function (component) {
          return capitalizer.toPascalCase(component);
        })
        .join('');
      key = capitalizer.toCamelCase(key) + namespace;
      factory(key, require(file));
    });

    return riccardo;
  }

  this.get = get;
  this.set = set;
  this.factory = factory;
  this.inject = inject;
  this.scan = scan;
  this.$ = this.lazy = lazy;
};
