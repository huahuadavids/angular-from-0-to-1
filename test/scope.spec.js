require('chai/register-expect');
var Scope = require("../src/Scope")
describe("Scope", function() {
  it("Step01: can be constructed and used as an object", function() {
    var scope = new Scope();
    scope.name = 1;
    expect(scope.name).to.equal(1);
    expect(scope).to.be.a("Object");
    expect(scope).to.have.property('name');
    expect(scope).to.be.an.instanceof(Scope);
  });
});

describe("digest", function(){
  var scope;

  beforeEach(function() {
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
      scope.$watch(watchFn, listenerFn);
      scope.$digest();

    });
  */

  it("step 03: calls the listener function when the watched value changes", function() {
    scope.someValue = 'a';
    scope.counter = 0;
    scope.$watch(
      function(scope) {
        return scope.someValue;
      },
      function(newValue, oldValue, scope) {
        scope.counter++;
      }
    );

    // int counter === 0
    expect(scope.counter).to.equal(0);

    // invoke $digest counter === 1
    scope.$digest();
    expect(scope.counter).to.equal(1);

    // invoke $digest but someValue not changed $digest counter === 1
    scope.$digest();
    expect(scope.counter).to.equal(1);

    // change the someValue
    scope.someValue = 'b';
    // no invoke the $digest counter === 1
    expect(scope.counter).to.equal(1);


    scope.$digest();
    //  invoke the $digest counter === 2
    expect(scope.counter).to.equal(2);

  });


  // there is no listenFn
  it("may have watchers that omit the listener function", function() {
    var watchFn = function(){
      return "huahuadavids"
    }
    scope.$watch(watchFn);
    scope.$digest();

  });


})




