module('issue -- possible bug for investigation');

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
    ys = [];
    
    // console.log(right.toArray());
    // console.log(right.skip(1).toArray());
    // console.log(right.skip(1).take(1).toArray());

    // console.log("s1: ", splits(right).skip(1).take(1).toArray());
    
    splits(right).skip(1).take(1).forEach( function(r) {
        splits(left).forEach( function(l) {
            console.log("lfst: ", l.first().toArray());
            console.log("lea1: ", l.elementAt(1).toArray());
            console.log("rfst: ", r.first().toArray());
            console.log("rea1: ", r.elementAt(1).toArray());
            console.log("riff: ", riffles(l.elementAt(1), r.elementAt(1)));
            riffles(l.elementAt(1), r.elementAt(1)).forEach( function(f) {
                console.log(l.first().concat(r.first()).concat(f).toArray());
                ys.push(l.first().concat(r.first()).concat(f));
            });
        });
    });

    return ys.toEnumerable();                                           
};

test('Riffles', function() {
    // riffles([].toEnumerable(), [].toEnumerable());
    // riffles([1].toEnumerable(), [].toEnumerable());
    // riffles([].toEnumerable(), [4].toEnumerable());
    // riffles([1].toEnumerable(), [4].toEnumerable());
    riffles([1, 2].toEnumerable(), [4, 5].toEnumerable());
    //riffles([1, 2, 3].toEnumerable(), [4].toEnumerable());

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
    //equals( riffles([1,2,3].toEnumerable(), [4,5,6].toEnumerable())
      //  .contains([1,2,4,5,3,6].toEnumerable), true);
});

