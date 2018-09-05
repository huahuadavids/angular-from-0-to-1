require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope", function() {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  it("spec3 does not end digest so that new watches are not run", function () {
    scope.aValue = 'abc';
    scope.counter = 0;
    scope.$watch(
      function (scope) {
        return scope.aValue;
      },
      function (newValue, oldValue, scope) {
        scope.$watch(
          function (scope) {
            return scope.aValue;
          },
          function (newValue, oldValue, scope) {
            scope.counter++;
          }
        );
      }
    );
    scope.$digest();
    expect(scope.counter).to.eql(1);
  });

})