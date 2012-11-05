module('Lesson 2 - Composable Observations');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */
 
test('ComposableAddition', function() {
    var received = 0;
    var numbers = [10, 100, 1000/*_______*/];
    numbers
        .toObservable()
        .sum()
        .subscribe(function(x) { received = x; });
    equals(received, 1110);
});
  
 test('ComposeableBeforeAndAfter', function() {
    var names = Range.create(1, 6),
        a = '',
        b = '';
    names
        .toObservable()
        .doAction(function(n) { a += n.toString(); })
        .where(function(n) { return n % 2 === 0; })
        .doAction(function(n) { b += n.toString(); })
        .subscribe();
    equals(a, '123456'/*_______*/);
    equals(b, '246');
});
 
test('WeWroteThis', function() {
    var received = [];
    var names = ['Bart', 'Wes', 'Erik', 'Matthew', 'Brian'];
    names
        .toObservable()
        .where(function(n) { return n.length <= 4/*_______*/; })
        .subscribe(function(x) { received.push(x); });
    equals(received.toString(), 'Bart,Wes,Erik');    
});
 
test('ConvertingEvents', function() {
    var received = '';
    var names = ['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS' ];
    names
        .toObservable()
        .select(function(x) { return x.toLowerCase()/*_______*/; })
        .subscribe(function(x) { received += x + ' '; });
    equals(received, 'we hope you are enjoying this ');
});
 
test('CreatingAMoreRelevantEventStream', function() {
    var received = '',
        mouseXMovements = [100, 200, 150],
        windowTopX = 50,
        relativemouse = mouseXMovements
            .toObservable()
            .select(function(x) { return x - windowTopX/*_______*/; });
    
    relativemouse.subscribe(function(x) { received += x + ', '; });
    equals(received, '50, 150, 100, ');
});
 
test('CheckingEverything', function() {
    var received = null;
    var numbers = [ 2, 4, 6, 8 ];
    numbers
        .toObservable()
        .all(function(x) { return x % 2 === 0; })
        .subscribe(function(x) { received = x; });
    equals(received, true/*_______*/);
});
 
test('CompositionMeansTheSumIsGreaterThanTheParts', function() {
    var numbers = Rx.Observable.range(1, 10);
    numbers
        .where(function(x) { return x > 8/*_______*/; })
        .sum()
        .subscribe(function(x) { equals(19, x); });
 });
