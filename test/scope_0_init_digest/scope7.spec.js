require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope - $apply", function () {
  var scope;

  beforeEach(function () {
    scope = new Scope();
  });

  it("executes $apply'ed function and starts the digest", function () {
    scope.aValue = 'someValue';
    scope.counter = 0;
    scope.$watch(
      function (scope) {
        return scope.aValue;
      },
      function (newValue, oldValue, scope) {
        scope.counter++;
      }
    );
    scope.$digest();
    expect(scope.counter).to.eql(1);
    scope.$apply(function (scope) {
      scope.aValue = 'someOtherValue';
    });
    expect(scope.counter).to.eql(2);
  })


  // when defer doing sth, $timeout service integrate width $apply
  // here , we define a $evalAsync

  // what's the difference between  $evalAsync  and $timeout
  // $timeout , give the control to the browser so you don't know the time to run
  // but the $evalAsync still run in the digest
  it("executes $evalAsync'ed function later in the same cycle", function() {
    scope.aValue = [1, 2, 3];
    scope.asyncEvaluated = false;
    scope.asyncEvaluatedImmediately = false;
    scope.$watch(
      function(scope) { return scope.aValue; },
      function(newValue, oldValue, scope) {
        scope.$evalAsync(function(scope) {
          scope.asyncEvaluated = true;
        });
        scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
      }
    );
    scope.$digest();
    expect(scope.asyncEvaluated).to.eql(true);
    expect(scope.asyncEvaluatedImmediately).to.eql(false);
  });


})