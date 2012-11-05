module('issue -- possible bug for investigation');

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
    // console.log("l, r: ", left.toArray(), right.toArray());
    if (left.count() === 0)
        return Ix.Enumerable.returnValue(right);
    if (right.count() === 0)
        return Ix.Enumerable.returnValue(left);
    var ys = [];
    
    var ra = splits(right).skip(1).take(1).toArray().slice(0);
    var rac = ra.length;
    // console.log("rac: ", rac);
    var la = splits(left).toArray().slice(0);
    var lac = la.length;
    // console.log("lac: ", lac);

    for (var i = 0; i < rac; i++) 
    {   var r = ra[i];
        // console.log("ra[" + i + "]: ",
        //             ra[i].toArray()[0].toArray(),
        //             ra[i].toArray()[1].toArray());
        for (var j = 0; j < lac; j++) 
        {   var l = la[j];
            // console.log("la[" + j + "]: ",
            //             la[j].toArray()[0].toArray(),
            //             la[j].toArray()[1].toArray());

            var l1a = l.toArray().slice(0)[1];
            var r1a = r.toArray().slice(0)[1];
            // console.log("lr1:  ",
            //             l1a.toArray().slice(0),
            //             r1a.toArray().slice(0));

            var fa = riffles(l1a, r1a).toArray().slice(0);
            var fac = fa.length;
            // console.log("fac", fac);
            for (var k = 0; k < fac; k++) 
            {   var l0 = l.toArray().slice(0)[0];
                var r0 = r.toArray().slice(0)[0];
                
                // console.log("l0 instanceof Array", l0 instanceof Array);
                // console.log("r0 instanceof Array", r0 instanceof Array);
                // console.log("fk instanceof Array", fa[k] instanceof Array);

                // console.log("rf: "
                //             , l0.toArray().slice(0)
                //             , r0.toArray().slice(0)
                //             , l0.concat(r0).toArray().slice(0)
                //             , fa[k].toArray().slice(0)
                //             , l0.concat(r0, fa[k]).toArray().slice(0)
                //            );

                ys.push(l0.concat(r0, fa[k]));
            }
        }
    }
    
    // splits(right).skip(1).take(1).forEach( function(r) {
    //     splits(left).forEach( function(l) {
    //         riffles(l.elementAt(1), r.elementAt(1)).forEach( function(f) {
    //             ys.push(l.first().concat(r.first()).concat(f));
    //         });
    //     });
    // });

    return ys.toEnumerable();                                           
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

test('Riffles', function() {
    // splits([1, 2, 3].toEnumerable()).forEach( function(s) {
    //     console.log("split: ",
    //         s.toArray().slice(0)[0].toArray().slice(0),
    //         s.toArray().slice(0)[1].toArray().slice(0));
    // });
    var e = [1, 2, 3].toEnumerable();
    // riffles([].toEnumerable(), [].toEnumerable());
    // riffles([1].toEnumerable(), [].toEnumerable());
    // riffles([].toEnumerable(), [4].toEnumerable());
    // riffles([1].toEnumerable(), [4].toEnumerable());
    riffles([1, 2].toEnumerable(), [4, 5].toEnumerable())
        .forEach(function(riffle) {
            console.log("riffle: ", riffle.toArray());
    });
    
    //riffles([1, 2, 3].toEnumerable(), [4].toEnumerable());

    equals( arrayComparer(riffles(e, Ix.Enumerable.empty()).first().toArray(),
                          e.toArray()), true);
    equals( arrayComparer(riffles(Ix.Enumerable.empty(), e).first().toArray(),
                          e.toArray()), true);
    // equals( riffles([1,2,3].toEnumerable(), [4,5,6].toEnumerable())
    //     .contains([1,2,4,5,3,6].toEnumerable()), true);
});

