module.exports = function (riccardo, namespace) {
  var sum = 0;
  sum += riccardo.get('oneInner' + namespace);
  sum += riccardo.get('two' + namespace);
  sum += riccardo.get('four' + namespace);
  sum += riccardo.get('eight' + namespace);
  return sum;
};