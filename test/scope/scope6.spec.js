require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope - $eval", function () {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  it("executes $eval'ed function and returns result", function() {
    scope.aValue = 42;
    var result = scope.$eval(function(scope) {
      return scope.aValue;
    });
    expect(result).to.eql(42);
  });

  it("passes the second $eval argument straight through", function() {
    scope.aValue = 42;
    var result = scope.$eval(function(scope, arg) {
      return scope.aValue + arg;
    }, 2);
    expect(result).to.eql(44);
  });

})