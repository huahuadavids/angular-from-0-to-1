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
  /**
   * @steps
   * 1. scope.$watch
   * 2. scope.watchList.push (
   *   watchfn,listenFn
   * )
   * 3. scope.$digest();
   * 4. this.$$asyncQueue === 0
   * 5. loop
   * 6. the aValue
   * 7. $$asyncQueue.push()
   * 8. asyncEvaluatedImmediately = false
   * 9. call the evalAsync queue
   * 10 asyncEvaluated = true;
   * 11 dirty = false
   * 12 end $digest
   *
   */

  it("executes $evalAsync'ed functions added by watch functions", function() {
    scope.aValue = [1, 2, 3];
    scope.asyncEvaluated = false;
    // watch function are supposed to be side-effect free
    // we should not do this
    scope.$watch(
      function(scope) {
        if (!scope.asyncEvaluated) {
          scope.$evalAsync(function(scope) {
            scope.asyncEvaluated = true;
          });
        }
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    scope.$digest();
    expect(scope.asyncEvaluated).to.eql(true);
  });


  it("executes $evalAsync'ed functions even when not dirty", function() {
    scope.aValue = [1, 2, 3];
    scope.asyncEvaluatedTimes = 0;
    scope.$watch(
      function(scope) {
        if (scope.asyncEvaluatedTimes < 2) {
          scope.$evalAsync(function(scope) {
            scope.asyncEvaluatedTimes++;
          });
        }
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    scope.$digest();
    expect(scope.asyncEvaluatedTimes).to.eql(2);
  });


  it("eventually halts $evalAsyncs added by watches", function() {
    scope.aValue = [1, 2, 3];
    scope.$watch(
      function(scope) {
        // if this , the digest runs forever so added the following code
        //   if ((dirty || this.$$asyncQueue.length) && !(ttl--)) {
        //       throw "10 digest iterations reached";
        //     }
        scope.$evalAsync(function(scope) { });
        return scope.aValue;
      },
      function(newValue, oldValue, scope) { }
    );
    expect(function() { scope.$digest(); }).throw();
  });



})