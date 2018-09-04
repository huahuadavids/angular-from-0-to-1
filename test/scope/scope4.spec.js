require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope", function () {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  it("compares based on value if enabled", function () {
    scope.aValue = [ 1, 2, 3 ];
    scope.counter = 0;
    scope.$watch(
      function (scope) {
        return scope.aValue;
      },
      function (newValue, oldValue, scope) {
        scope.counter++;
      },
      true
    );

    scope.$digest();
    expect(scope.counter).to.eql(1);

    // push a item to the array , but it is a same array
    scope.aValue.push(4);
    scope.$digest();


    expect(scope.counter).to.eql(2);
  });

})