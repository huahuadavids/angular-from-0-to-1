require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope - NaN ", function () {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  it("correctly handles NaNs", function() {
    scope.number = 0/0; // NaN
    scope.counter = 0;
    scope.$watch(
      function(scope) { return scope.number; },
      function(newValue, oldValue, scope) {
        scope.counter++;
        console.log(scope.counter)
      }
    );
    scope.$digest();
    expect(scope.counter).to.eql(1);
    scope.$digest();
    expect(scope.counter).to.eql(1);
  });

})