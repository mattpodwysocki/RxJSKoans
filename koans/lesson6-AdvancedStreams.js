module('Lesson 6 - Advanced Streams');

test('Merging', function() {
    var easy = '',
        you = [1,2,3].toObservable(),
        me = ['A','B','C'].toObservable();
        
    you
        .merge(me)
        .subscribe(function(a) { easy += a + ' '; });
    // Actually, this is not so easy! The result could be any arbitrary
    // riffle of the original two streams.  More later on Riffles in JS.

    equals(easy, '1 A 2 B 3 C '/*_______*/);
    equals(easy, '1 2 3 A B C '/*_______*/);
});

test('Riffles', function() {
    var e = [1, 2, 3].toEnumerable();
});

test('Splitting Up', function() {
    var oddsAndEvens = ['',''];
        numbers = Rx.Observable.range(1, 9),
        split = numbers
            .groupBy(function(n) { return n % 2 /*_______*/; });

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


