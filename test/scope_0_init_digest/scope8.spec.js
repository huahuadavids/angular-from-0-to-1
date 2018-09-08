require('chai/register-expect');
var Scope = require("../../src/Scope")
var _ = require("lodash");

// describe is test suite
describe("$Scope - $phase", function () {

    it("has a $$phase field whose value is the current digest phase", function () {
        var scope = new Scope();
        scope.aValue = [1, 2, 3];
        scope.phaseInWatchFunction = undefined;
        scope.phaseInListenerFunction = undefined;
        scope.phaseInApplyFunction = undefined;
        scope.$watch(
            function (scope) {
                scope.phaseInWatchFunction = scope.$$phase;
                return scope.aValue;
            },
            function (newValue, oldValue, scope) {
                scope.phaseInListenerFunction = scope.$$phase;
            }
        );
        scope.$apply(function (scope) {
            scope.phaseInApplyFunction = scope.$$phase;
        });
        expect(scope.phaseInWatchFunction).to.eql('$digest');
        expect(scope.phaseInListenerFunction).to.eql('$digest');
        expect(scope.phaseInApplyFunction).to.eql('$apply');
    });

    it("schedules a digest in $evalAsync", function (done) {
        var scope = new Scope();
        scope.aValue = "abc";
        scope.counter = 0;
        scope.$watch(
            function (scope) { return scope.aValue; },
            function (newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        scope.$evalAsync(function (scope) {
        });
        expect(scope.counter).to.eql(0);
        setTimeout(function () {
            expect(scope.counter).to.eql(1);
            done();
        }, 50);
    });

})