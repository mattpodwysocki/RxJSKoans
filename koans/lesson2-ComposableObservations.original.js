module('Lesson 2 - Composable Observations');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */
 
test('ComposableAddition', function() {
    var received = 0;
    var numbers = [10, 100, _______];
    numbers
        .toObservable()
        .Sum()
        .Subscribe(function(x) { received = x; });
    equals(received, 1110);
 });
  
 test('ComposeableBeforeAndAfter', function() {
    var names = Range.create(1, 6),
        a = '',
        b = '';
        
    names
        .toObservable()
        .Do(function(n) { a += n.toString(); })
        .Where(function(n) { return n % 2 === 0; })
        .Do(function(n) { b += n.toString(); })
        .Subscribe();
        
    equals(a, _______);
    equals(b, '246');
 });
 
 test('WeWroteThis', function() {
    var received = [];
    var names = ['Bart', 'Wes', 'Erik', 'Matthew'];
    names.toObservable().Where(function(n) { return n.length <= _______; }).Subscribe(function(x) { received.push(x); });
    equals(received.toString(), 'Bart,Wes,Erik');    
 });
 
 test('ConvertingEvents', function() {
    var received = '';
    var names = ['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS' ];
    names.toObservable().Select(function(x) { return x._______; }).Subscribe(function(x) { received += x + ' '; });
    equals(received, 'we hope you are enjoying this ');
 });
 
 test('CreatingAMoreRelevantEventStream', function() {
    var received = '',
        mouseXMovements = [100, 200, 150],
        windowTopX = 50,
        relativemouse = mouseXMovements.toObservable().Select(function(x) {
            return x - _______;
        });
    relativemouse.Subscribe(function(x) {
        received += x + ', ';
    });
    equals(received, '50, 150, 100, ');
 });
 
 test('CheckingEverything', function() {
    var received = null;
    var numbers = [ 2, 4, 6, 8 ];
    numbers.toObservable().All(function(x) { return x % 2 === 0; }).Subscribe(function(x) { received = x; });
    equals(received, _______);
 });
 
 test('CompositionMeansTheSumIsGreaterThanTheParts', function() {
    var numbers = Rx.Observable.Range(1, 10);
    numbers.Where(function(x) { return x > _______; }).Sum().Subscribe(function(x) { equals(19, x); });
 });
