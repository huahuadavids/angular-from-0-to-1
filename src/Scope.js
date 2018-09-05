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
 * $scope_0_init_digest 是继承于一个构造函数
 * 内部维护一个watchers数组
 */
function Scope(){

  // $$ is private
  // store all the registered watchers
  this.$$watchers = [];

  // this is a optimize
  // digest loop if have a dirty watcher just return it ,stop the $digest
  this.$$lastDirtyWatch = null;

  // here to store the scheduled $evalAsync jobs
  this.$$asyncQueue = [];
}

// initialize the last value , because a function (a reference value) not equal to others except it self
function initWatchVal() { }

Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var watcher = {
    // if this function return nothing
    // that will in $digest undefined !== last
    watchFn: watchFn,

    // if the listenerFn is undefined we should pass a noop function
    listenerFn: listenerFn || noop,

    // if not init this value ,this is undefined , when the scope_0_init_digest variety is not defined
    // in the $digest , (newValue !== oldValue) is ( undefined !== undefined ) is false
    // then never change the value
    // no matter what the watchFn return , the listener will invoked
    last: initWatchVal,

    // deep compare not only compare strict equal (primitive (string,boolean,number) refer values ) and
    // but also compare value in Object and Arrays !!!
    // this calls Value-based dirty-checking
    // If objects or arrays we have to iterate through everything contained in them
    valueEq: !!valueEq
  };
  this.$$watchers.push(watcher);


  // if put a new watcher in the listerFn, if has not this , the added new watcher can not be invoked
  // because $$lastDirtyWatch  refers to a watcher and return false
  this.$$lastDirtyWatch = null;
};

//  when the data change invoke the listenerFn，this called (dirty-checking)
//  when invoked $digest，all the watch will be invoked
//  controls the amounts of watcher , is a optimize method
Scope.prototype.$$digestOnce = function() {
  var self = this;
  var newValue, oldValue, dirty;

  _.forEach(this.$$watchers, function(watcher) {

    // get the oldValue and the newValue
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;

    // compare the value
    if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
      self.$$lastDirtyWatch = watcher;

      // if use the deep compare , then deepClone the value
      watcher.last =  (watcher.valueEq ? _.cloneDeep(newValue) : newValue);;
      watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
      dirty = true;
    } else if (self.$$lastDirtyWatch === watcher) {
      // lodash exit the loop
      return false;
    }
  });
  return dirty;
};

/**
 * @name $$areEqual
 * @Test test/scope_0_init_digest/scope5.spec.js
 * @description compare two args by value or by reference
 * @param newValue
 * @param oldValue
 * @param valueEq
 * @returns {boolean}
 */
Scope.prototype.$$areEqual = function(newValue, oldValue, valueEq) {
  if (valueEq) {
    return _.isEqual(newValue, oldValue);
  } else {
    return newValue === oldValue ||
      (typeof newValue === 'number' && typeof oldValue === 'number' &&
        isNaN(newValue) && isNaN(oldValue));
  }
};



Scope.prototype.$digest = function() {
  var ttl = 10;  // This maximum amount of iterations is called the TTL (short for “Time To Live”)
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.shift();
      asyncTask.scope.$eval(asyncTask.expression);
    }
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      throw "10 digest iterations reached";
    }
  } while (dirty);
};


/**
 * @name $eval
 * @Test test/scope_0_init_digest/scope6.spec.js
 * @type function
 * @description execute some code in the context of a scope_0_init_digest ,
 * It takes a function as an argument and immediately executes
 * that function giving it the scope_0_init_digest itself as an argument
 * @param fn
 * @param args
 * @returns fn
 */

Scope.prototype.$eval = function(fn, args) {
  return fn(this, args);
};


Scope.prototype.$evalAsync = function(expr) {
  // The reason we explicitly store the current scope in the queued object is related to scope inheritance
  this.$$asyncQueue.push({scope: this, expression: expr});
};



/**
 * @description  Integrating External Code With The Digest Cycle
 * @Test test/scope_0_init_digest/scope7.spec.js
 * @param expr
 * @returns {fn}
 */
Scope.prototype.$apply = function(expr) {
  try {
    return this.$eval(expr);
  } finally {
    this.$digest();
  }
};

module.exports = Scope;