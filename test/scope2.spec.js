require('chai/register-expect');
var Scope = require("../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("digest", function() {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  /**
   * @title if the digest loop is huge too many watchers
   * if 100 watchers , the first is dirty , the others is clean
   * if directly loop , it cost too much
   * so optimize this
   */


  it("ends the digest when the last watch is clean ", function() {

    // this returns [1,2,3...100]
    scope.array = _.range(100);


    var watchExecutions = 0;


    // 给scope注册100个watcher
    _.times(100, function(i) {
      scope.$watch(
        function(scope) {
          watchExecutions++;
          return scope.array[i];
        },
        function(newValue, oldValue, scope) {
        }
      );
    });

    expect(watchExecutions).to.equal(0);      // 0
    scope.$digest();
    //console.log(scope.$$lastDirtyWatch) // { watchFn: [Function], listenerFn: [Function], last: 99 }

    expect(watchExecutions).to.equal(200);
    // it executes 200 times
    // 200 the first time index not equal initFn , the second all is clean


    scope.array[0] = 420;
    scope.$digest();
    expect(watchExecutions).to.equal(301);
  });

})
