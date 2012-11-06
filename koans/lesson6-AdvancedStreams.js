module('Lesson 6 - Advanced Streams');

test('Merging', function() {
    var easy = [],
        you = [1,2,3].toObservable(),
        me = ['A','B','C'].toObservable();
    you
        .merge(me)
        .subscribe(function(a) { easy.push(a); });

    // equals(easy === '1 A 2 B 3 C ' || easy === '1 2 3 A B C ', _______);
    
    // Actually, this is not so easy! The result could be any arbitrary
    // riffle of the original two streams.  

    riffles([1, 2, 3].toEnumerable(), ['A', 'B', 'C'].toEnumerable())
        .forEach(function(riffle) {
            console.log("riffle: ", riffle.toArray());
        });
    
    console.log("easy: ", easy);

    equals(
        riffles([1, 2, 3].toEnumerable(), ['A', 'B', 'C'].toEnumerable())
        .select(function (riffle) {return riffle.toArray();})
        ._______(easy, arrayComparer),
        true);
});

// A function that compares arrays for equality given an optional
// elementComparer. Be aware that this is not sufficiently flexible 
// to work on arrays of arbitrary nesting.
var arrayComparer = function (xs, ys, elementComparer) {
    if ( (! (xs instanceof Array)) || (! (ys instanceof Array)) )
        return false;
    var xl = xs.length;
    var yl = ys.length;
    if (xl != yl)
        return false;
    elementComparer || (elementComparer = function(x, y) { return x === y; });
    var i;
    for (i = 0; i < xl; i++) 
        if (! elementComparer(xs[i], ys[i]))
            return false;
    return true;
};

// Produces an Enumerable of all splits of another Enumerable, as an 
// Enumerable of pairs of left and right after the splits. A more 
// sophisticated implementation would build the nested enumerators.
var splits = function(xs) {
    var c = xs.count();
    var ys = [];
    for (var i = 0; i <= c; i++)
        ys.push( [xs.take(i), xs.skip(i)].toEnumerable() );
    return ys.toEnumerable();
};

// Produces an Enumerable of all riffles of two other Enumerables.  A more
// sophisticated implementation would build the nested enumerators.
var riffles = function(left, right) {
    if (left.count() === 0)
        return Ix.Enumerable.returnValue(right);
    if (right.count() === 0)
        return Ix.Enumerable.returnValue(left);
    var ys = [];
    
    splits(right).skip(1).take(1).forEach( function(r) 
    {   splits(left).forEach( function(l) 
        {   riffles(l.elementAt(1), r.elementAt(1)).forEach( function(f) 
            {   ys.push(l.first().concat(r.first()).concat(f));
    }); }); });

    return ys.toEnumerable();                                           
};

var floatingEquals = function (a, b, digits) {
    var exponent = Math.abs( digits || 12 );
    var multiplier = Math.pow(10, exponent);
    return Math.round( multiplier * a ) === Math.round( multiplier * b);
};

test('DescriptiveStatistics', function () {
    var e = [1, 2, 3].toEnumerable();
    equals(e.standardDeviation(), _______);

    equals(floatingEquals(
        [1, 2].toEnumerable().standardDeviation(),
        1 / Math.sqrt(2)), true);

    // Should be sqrt ( (1^2 + 2^2 + 4^2 - 7^2 / 3) / 2 )
    // = sqrt( (1 + 4 + 16 - 49 / 3) / 2 )
    // = sqrt( (21 - 49 / 3) / 2 )
    // = sqrt( (63 - 49) / 6 )
    // = sqrt( 14 / 6 )
    // = sqrt( 7 / 3 )

    equals(floatingEquals(
        [1, 2, 4]
            .toEnumerable()
            .standardDeviation(),
        Math.sqrt(7 / 3)), true);

    [1, 2, 4]
        .toObservable()
        .standardDeviation()
        .subscribe(function (s) {
            console.log(s);
            equals(floatingEquals(s, Math.sqrt(7 / 3)), true); });
});


test('Splitting Up', function() {
    var oddsAndEvens = ['',''];
        numbers = Rx.Observable.range(1, 9),
        split = numbers
            .groupBy(function(n) { return n % _______; });

    split.subscribe(function (g) {
        console.log(g, "key: ", g.key);
        return g.subscribe(
            function (i) {
                return console.log(i);
            });
        });

    split
        .subscribe(function(group) {
            group
                .subscribe(function(n) { oddsAndEvens[group.key] += n; });
    });
    
    var evens = oddsAndEvens[0],
        odds = oddsAndEvens[1];
        
    equals(evens, '2468');
    equal(odds, '13579');
});


test('Subscribe Imediately When Splitting', function() {
    var averages = [0.0,0.0],
        numbers = [22,22,99,22,101,22].toObservable(),
        split = numbers
        .groupBy(function(n) { return n % 2; });
    split
        .subscribe(function(g) {
            g
                .average()
                ._______(function(a) { averages[g.key] = a; });
    });
    equals(22, averages[0]);
    equals(100, averages[1]);
});

test('Multiple Subscriptions', function() {
    var numbers = new Rx.Subject(),
        sum = 0,
        average = 0;
        
    numbers
        .sum()
        .subscribe(function(n) { sum = n; });
    numbers.onNext(1);
    numbers.onNext(1);
    numbers.onNext(1);
    numbers.onNext(1);
    numbers.onNext(1);
    
    numbers
        .average()
        .subscribe(function(n) {
            average = n;
            // Bug, not called?
        });
    numbers.onNext(2);
    numbers.onNext(2);
    numbers.onNext(2);
    numbers.onNext(2);
    numbers.onNext(2);

    numbers.onCompleted();

    equals(sum, 15);
    equals(average, _______);
});




