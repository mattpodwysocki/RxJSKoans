module('issue -- possible bug for investigation');

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

    equals( arrayComparer(riffles(e, Ix.Enumerable.empty()).first().toArray(),
                          e.toArray()), true);
    equals( arrayComparer(riffles(Ix.Enumerable.empty(), e).first().toArray(),
                          e.toArray()), true);
    //equals( riffles([1,2,3].toEnumerable(), [4,5,6].toEnumerable())
      //  .contains([1,2,4,5,3,6].toEnumerable), true);
});

