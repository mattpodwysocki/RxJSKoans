module('Lesson 6 - Advanced Streams');

test('Merging', function() {
    var easy = '',
        you = [1,2,3].toObservable(),
        me = ['A','B','C'].toObservable();
        
    you
        .Merge(me)
        .Subscribe(function(a) { easy += a + ' '; });
    
    equals(_______, easy);
});

test('Splitting Up', function() {
    var oddsAndEvens = ['',''];
        numbers = Rx.Observable.Range(1, 9),
        split = numbers.GroupBy(function(n) {
            return _______;
        });
    split.Subscribe(function(group) {
        group.Subscribe(function(n) { oddsAndEvens[group.Key] += n; });
    });
    
    var evens = oddsAndEvens[0],
        odds = oddsAndEvens[1];
        
    equals('2468', evens);
    equal('13579', odds);
});

test('Need To Subscribe Imediately When Splitting', function() {
    var averages = [0.0,0.0],
        numbers = [22,22,99,22,101,22].toObservable(),
        split = numbers.GroupBy(function(n) { return n % 2; });
    split.Subscribe(function(g) {
        g.Average()._______(function(a) { averages[g.Key] = a; });
    });
    equals(averages[0], 22);
    equals(averages[1], 100);
});

test('Multiple Subscriptions', function() {
    var numbers = new Rx.Subject(),
        sum = 0,
        average = 0;
        
    numbers.Sum().Subscribe(function(n) {
        sum = n;
    });
    numbers.OnNextAll(1, 1, 1, 1, 1);
    numbers.Average().Subscribe(function(n) {
        average = n;
        // Bug, not called?
    });
    numbers.OnNextAll(2, 2, 2, 2, 2);
    numbers.OnCompleted();
    equals(sum, 15);
    equals(average, _______);
});

