(function (window) {

    function identity (x) { return x; }

    var root = window.L2O,
        Enumerable = root.Enumerable;

    QUnit.module('Aggregate Tests');

    test('IsEmpty_Empty', function () {
        ok(Enumerable.empty().isEmpty());
    });

    test('IsEmpty_Empty', function () {
        ok(!Enumerable.returnValue(1).isEmpty());
    }); 

    test('Min', function () {
        equal(3, Enumerable.fromArray([5,3,7]).minBy(identity, function (x, y) { return x % 3 - y % 3; }).first());
    });

    test('MinBy', function () {
        var res = Enumerable.fromArray([2, 5, 0, 7, 4, 3, 6, 2, 1]).minBy(function (x) { return x % 3; });
        ok(res.sequenceEqual(Enumerable.fromArray([ 0, 3, 6])));
    });

    test('MinBy_Empty', function () {
        raises(function () {
            Enumerable.empty().minBy(identity);
        });
    });

    test('Max', function () {
        equal(5, Enumerable.fromArray([2, 5, 3, 7]).maxBy(identity, function (x, y) { return x % 7 - y % 7; }).first());
    });

    test('MaxBy', function () {
        var res = Enumerable.fromArray([2, 5, 0, 7, 4, 3, 6, 2, 1]).maxBy(function (x) { return x % 3; });
        ok(res.sequenceEqual(Enumerable.fromArray([2, 5, 2 ])));
    });

    test('MinBy_Empty', function () {
        raises(function () {
            Enumerable.empty().maxBy(identity);
        });
    });


}(this));