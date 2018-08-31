/**
 * $watch and $digest 是硬币的两面
 *
 * 使用$watch可以给scope加一个观察者(当数据变化被通知
 * $watch有两个函数,watch,就是要观察的数据，listener ，数据改变时，调用的函数
 *
 * $digest遍历scope所有的观察者，在某种情况执行watch和listener
 *
 * @constructor
 */


var _ = require("lodash");
var noop = function(){}

/**
 * $scope 是 继承于一个构造函数
 * 内部维护一个watchers数组
 */
function Scope(){

  // $$ is private
  // store all the registered watchers
  this.$$watchers = [];

}

// init the last value , because it is not equal to others except it self
function initWatchVal() { }

Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {


    // if this function return nothing
    // that will in $digest undefined !== last
    watchFn: watchFn,


    // if the listenerFn is undefined we should pass a noop function
    listenerFn: listenerFn || noop,

    // if not init this value ,this is undefined , when the scope variety is not defined
    // in the $digest , (newValue !== oldValue) is ( undefined !== undefined ) is false
    // then never change the value
    // no matter what the watchFn return , the listener will invoked
    last: initWatchVal
  };
  this.$$watchers.push(watcher);
};

//  watch函数的数据发生变化后，调用listener函数，叫做脏检查 (dirty-checking)
//  当调用 $digest时，所有的watch都被调用，因为控制watch数量，优化性能

Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach(this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      watcher.last = newValue;
      watcher.listenerFn(newValue,
        (oldValue === initWatchVal ? newValue : oldValue),
        self);
      dirty = true;
    }
  });
  return dirty;
};

Scope.prototype.$digest = function() {
  var dirty;
  do {
    dirty = this.$$digestOnce();
  } while (dirty);
};


module.exports = Scope;