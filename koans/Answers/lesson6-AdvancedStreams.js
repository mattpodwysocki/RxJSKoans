module('Lesson 6 - Advanced Streams');

test('Merging', function() {
    var easy = [],
        you = [1,2,3].toObservable(),
        me = ['A','B','C'].toObservable();
    you
        .merge(me)
        .subscribe(function(a) { easy.push(a); });

    // equals(easy === '1 A 2 B 3 C ' || easy === '1 2 3 A B C ', true/*_______*/);
    
    // Actually, this is not so easy! The result could be any arbitrary
    // riffle of the original two streams.  More later on Riffles in JS.

    riffles([1, 2, 3].toEnumerable(), ['A', 'B', 'C'].toEnumerable())
        .forEach(function(riffle) {
            console.log("riffle: ", riffle.toArray());
        });
    console.log("easy: ", easy);

    equals( riffles([1, 2, 3].toEnumerable(), ['A', 'B', 'C'].toEnumerable())
        .select(function (riffle) {return riffle.toArray();})
        .contains(easy, arrayComparer),
        true);


});

// Given a 1-based index n, produces a function that will pluck the n-th
// item from any Enumerable and return it. Pluck produces a function so
// that it can be mapped over Enumerables of Enumerables, say to produce
// a columnar slice from an array.  WARNING: these are 1-based indices!
var pluck = function (n) {
    return function(xs) {
        if (n <= 0 || n > xs.count)
            throw new Error('index out of range');
        return xs.elementAt(n - 1);
    };
};

// Given a 1-based index n, produces a function that will produce an 
// Enumerable with the n-th item missing.  WARNING: these are 1-based
// indices!
var coPluck = function(n) {
    return function(xs) {

        // is the following error-checking redundant?  The error-handling 
        // policy of Ix is not clear to me at this point! (4 Nov 12)

        // if (! (xs instanceof Ix.Enumerable) )
        //     throw new Error('xs must be an Ix.Enumerable');
        var c = xs.count();
        if (n <= 0 || n > c)
            throw new Error('index out of range');
        var ys = [];
        var i = 1;
        xs.forEach( function (x) {
            if (i != n)
                ys.push(x);
            i++;
        });
        return ys.toEnumerable();
    };
};    

// A function that compares arrays for equality given an optional
// elementComparer. Be aware that this is not sufficiently flexible 
// to work on arrayw of arbitrary nesting.
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
        // ys.push( [xs.take(i), xs.skip(i)].toEnumerable() );
        ys.push( [xs.take(i).toArray().slice(0).toEnumerable(),
                  xs.skip(i).toArray().slice(0).toEnumerable()]
             .toEnumerable() );
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

test('Riffles', function() {
    var e = [1, 2, 3].toEnumerable();

    equals(e.contains(2), true);
    equals(e.count(), 3);
    equals([[1, 2], [3, 4]].toEnumerable().contains([3, 4], arrayComparer), true);

    e.forEach(function (x) { equals( pluck(x)(e), x ); });
    
    // Expecting exceptions to be thrown
    try { pluck(0)(e); equals(false, true); }
    catch (exception) { equals(true, true); }

    try { pluck(4)(e); equals(false, true); }
    catch (exception) { equals(true, true); }
    
    try { pluck(-2)(e); equals(false, true); }
    catch (exception) { equals(true, true); }

    equals( arrayComparer(coPluck(2)(e).toArray(), [1, 3]), true );

    equals( arrayComparer(riffles(e, Ix.Enumerable.empty()).first().toArray(),
                          e.toArray()), true);
    equals( arrayComparer(riffles(Ix.Enumerable.empty(), e).first().toArray(),
                          e.toArray()), true);
    equals( riffles([1,2,3].toEnumerable(), [4,5,6].toEnumerable())
        .select(function (riffle) {return riffle.toArray();})
        .contains([1,2,4,5,3,6], arrayComparer),
        true);
});

var floatingEquals = function (a, b, digits) {
    var exponent = Math.abs( digits || 12 );
    var multiplier = Math.pow(10, exponent);
    return Math.round( multiplier * a ) === Math.round( multiplier * b);
};

test('DescriptiveStatistics', function () {
    var e = [1, 2, 3].toEnumerable();
    equals(e.standardDeviation(), 1);

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
            .groupBy(function(n) { return n % 2 /*_______*/; });

    split.subscribe(function (g) {
        return g.subscribe(
            function (i) {
                return console.log(i, g.key);
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
                .subscribe/*_______*/(function(a) { averages[g.key] = a; });
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
    equals(average, 2/*_______*/);
});


