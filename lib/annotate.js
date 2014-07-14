var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

module.exports = function annotate(fn) {
  var list = [];
  var fnText = fn.toString().replace(STRIP_COMMENTS, '');
  var argDecl = fnText.match(FN_ARGS);

  var args = argDecl[1].split(FN_ARG_SPLIT);
  args.forEach(function (arg) {
    arg.replace(FN_ARG, function (all, underscore, name) {
      list.push(name);
    });
  });
  
  return list;
};