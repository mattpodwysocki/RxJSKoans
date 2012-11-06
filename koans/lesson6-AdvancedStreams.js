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
        return g.subscribe(
            function (i) {
                return console.log(i, g.key, g);
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

test('Tally', function()
{   
var alice = [
"Alice", "was", "beginning", "to", "get", "very", "tired", "of", "sitting", "by", "her", "sister", "on", "the",
"bank", "and", "of", "having", "nothing", "to", "do", "once", "or", "twice", "she", "had", "peeped", "into", "the",
"book", "her", "sister", "was", "reading", "but", "it", "had", "no", "pictures", "or", "conversations", "in",
"it", "and", "what", "is", "the", "use", "of", "a", "book", "thought", "Alice", "without", "pictures", "or",
"conversation",
"So", "she", "was", "considering", "in", "her", "own", "mind", "as", "well", "as", "she", "could", "for", "the",
"hot", "day", "made", "her", "feel", "very", "sleepy", "and", "stupid", "whether", "the", "pleasure",
"of", "making", "a", "daisy", "chain", "would", "be", "worth", "the", "trouble", "of", "getting", "up", "and",
"picking", "the", "daisies", "when", "suddenly", "a", "White", "Rabbit", "with", "pink", "eyes", "ran",
"close", "by", "her",

"There", "was", "nothing", "so", "VERY", "remarkable", "in", "that", "nor", "did", "Alice", "think", "it", "so",
"VERY", "much", "out", "of", "the", "way", "to", "hear", "the", "Rabbit", "say", "to", "itself", "Oh", "dear",
"Oh", "dear", "I", "shall", "be", "late", "when", "she", "thought", "it", "over", "afterwards", "it",
"occurred", "to", "her", "that", "she", "ought", "to", "have", "wondered", "at", "this", "but", "at", "the", "time",
"it", "all", "seemed", "quite", "natural", "but", "when", "the", "Rabbit", "actually", "TOOK", "A", "WATCH",
"OUT", "OF", "ITS", "WAISTCOAT", "POCKET", "and", "looked", "at", "it", "and", "then", "hurried", "on",
"Alice", "started", "to", "her", "feet", "for", "it", "flashed", "across", "her", "mind", "that", "she", "had",
"never", "before", "seen", "a", "rabbit", "with", "either", "a", "waistcoat", "pocket", "or", "a", "watch",
"to", "take", "out", "of", "it", "and", "burning", "with", "curiosity", "she", "ran", "across", "the", "field",
"after", "it", "and", "fortunately", "was", "just", "in", "time", "to", "see", "it", "pop", "down", "a", "large",
"rabbit", "hole", "under", "the", "hedge",

"In", "another", "moment", "down", "went", "Alice", "after", "it", "never", "once", "considering", "how",
"in", "the", "world", "she", "was", "to", "get", "out", "again",

"The", "rabbit", "hole", "went", "straight", "on", "like", "a", "tunnel", "for", "some", "way", "and", "then",
"dipped", "suddenly", "down", "so", "suddenly", "that", "Alice", "had", "not", "a", "moment", "to", "think",
"about", "stopping", "herself", "before", "she", "found", "herself", "falling", "down", "a", "very", "deep",
"well",

"Either", "the", "well", "was", "very", "deep", "or", "she", "fell", "very", "slowly", "for", "she", "had",
"plenty", "of", "time", "as", "she", "went", "down", "to", "look", "about", "her", "and", "to", "wonder", "what", "was",
"going", "to", "happen", "next", "First", "she", "tried", "to", "look", "down", "and", "make", "out", "what",
"she", "was", "coming", "to", "but", "it", "was", "too", "dark", "to", "see", "anything", "then", "she",
"looked", "at", "the", "sides", "of", "the", "well", "and", "noticed", "that", "they", "were", "filled", "with",
"cupboards", "and", "book", "shelves", "here", "and", "there", "she", "saw", "maps", "and", "pictures",
"hung", "upon", "pegs", "She", "took", "down", "a", "jar", "from", "one", "of", "the", "shelves", "as",
"she", "passed", "it", "was", "labelled", "ORANGE", "MARMALADE", "but", "to", "her", "great",
"disappointment", "it", "was", "empty", "she", "did", "not", "like", "to", "drop", "the", "jar", "for", "fear",
"of", "killing", "somebody", "so", "managed", "to", "put", "it", "into", "one", "of", "the", "cupboards", "as",
"she", "fell", "past", "it"
];

    alice
        .toObservable()
        .select(function(s) {return s.toLowerCase();})
        .tally()
        .subscribe(function (s) {console.log(s);})
        ;
    });


