
require('chai/register-expect');
var Scope = require("../../src/Scope")

/**
 * @ this condition , the digest runs forever
 */
// describe is test suite
describe("$Scope", function() {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });
  // it => is a test case  the smallest unit of testing
  it("gives up on the watches after 10 iterations", function() {
    // this two watchers depends on each other  they never finish
    // so we should set the counts of  the iterate (default 10)

    scope.counterA = 0;
    scope.counterB = 0;
    scope.$watch(
      function(scope) { return scope.counterA; },
      function(newValue, oldValue, scope) {
        scope.counterB++;
      }
    );
    scope.$watch(
      function(scope) { return scope.counterB; },
      function(newValue, oldValue, scope) {
        scope.counterA++;
      }
    );
    expect((function() { scope.$digest(); })).throw();
  });

});
