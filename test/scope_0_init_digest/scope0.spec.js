require('chai/register-expect');
const Scope = require("../../src/Scope");

describe("$Scope", function () {
  it("Step01: can be constructed and used as an object", function () {
    var scope = new Scope();
    scope.name = 1;
    expect(scope.name).to.equal(1);
    expect(scope).to.be.a("Object");
    expect(scope).to.have.property('name');
    expect(scope).to.be.an.instanceof(Scope);
  });
});

describe("$Scope", function () {
  let scope;

  beforeEach(function () {
    scope = new Scope();
  });

  /*@step 01
   it("step 02: calls the listener function of a watch on first $digest", function() {
   var watchFn = function() {
   return 'wat';
   };
   var listenerFn = function(){
   return 1;
   };
   //$watch方法注册两个函数
   scope_0_init_digest.$watch(watchFn, listenerFn);
   scope_0_init_digest.$digest();

   });
   */

  it("step 03: calls the listener function when the watched value changes", function () {
    // scope_0_init_digest.someValue = 'a';
    // scope_0_init_digest.counter = 0;
    // scope_0_init_digest.$watch(
    //   function(scope_0_init_digest) {
    //     return scope_0_init_digest.someValue;
    //   },
    //   function(newValue, oldValue, scope_0_init_digest) {
    //     scope_0_init_digest.counter++;
    //   }
    // );

    // int counter === 0
    //expect(scope_0_init_digest.counter).to.equal(0);

    // invoke $digest counter === 1
    // scope_0_init_digest.$digest();
    // expect(scope_0_init_digest.counter).to.equal(1);

    // invoke $digest but someValue not changed $digest counter === 1
    //  scope_0_init_digest.$digest();
    // expect(scope_0_init_digest.counter).to.equal(1);

    // change the someValue
    // scope_0_init_digest.someValue = 'b';
    // // no invoke the $digest counter === 1
    //expect(scope_0_init_digest.counter).to.equal(1);


    // scope_0_init_digest.$digest();
    //  invoke the $digest counter === 2
    //  expect(scope_0_init_digest.counter).to.equal(2);

  });


  // there is no listenFn
  it("may have watchers that omit the listener function", function () {
    // var watchFn = function(){
    //   return "huahuadavids"
    // }
    // scope_0_init_digest.$watch(watchFn);
    // scope_0_init_digest.$digest();

  });


  it("triggers chained watchers in the same digest", function () {
    /**
     * @description
     * scope_0_init_digest = new Scope()
     * // $$watcher as array in this;
     */
    scope.name = 'Jane';


    // watcher1 push a watcher in the arrayList
    scope.$watch(
      function (scope) {
        return scope.nameUpper; //undefined
      },
      function (newValue, oldValue, scope) {
        if (newValue) {
          scope.initial = newValue.substring(0, 1) + '.';
        }
      }
    );
    // watcher2 push a watcher in the arrayList
    scope.$watch(
      function (scope) {
        return scope.name;
      },
      function (newValue, oldValue, scope) {
        if (newValue) {
          scope.nameUpper = newValue.toUpperCase();
        }
      }
    );

    /**
     * loop 1
     * watcher1
     *
     * {
     *    last: undefined
     * }
     * dirty = true;
     * watch 2
     *
     * {
     *    last: 'Jane'
     * }
     * dirty = true;
     * scope_0_init_digest.nameUpper = 'JANE'
     *
     *  loop 2
     *  watch1
     *  {
     *    last: 'JANE'
     *  }
     *  scope_0_init_digest.initial = J.
     *  dirty = true;
     *
     *   dirty = undefined;
     *   loop 3
     *   dirty = undefined;
     *   dirty = undefined;
     *   end loop
     */


    // the scope_0_init_digest has 2 watcher in array-list
    scope.$digest();
    // invoke the $digest
    // iterate the list

    /**
     * for the watcher1
     * newValue = watchFn = scope_0_init_digest.nameUpper = undefined;
     * oldValue = watcher1.last = initFn;
     * newValue not equal newValue
     * watcher1.last = undefined
     * listenerFn(undefined, undefined,self)
     *
     *
     *
     */




    expect(scope.initial).to.eql('J.');
    scope.name = 'Bob';
    scope.$digest();
    expect(scope.initial).to.eql('B.');

    /**
     * if change the order of the registered watcher , the test will pass
     * then realize this
     * this digest is running until there is no watched values changed
     *
     *
     *
     */


  });


})




