module('Lesson 1 - Observable Streams');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */
 
test('ObjectsFirst', function () {
    var xs = L2O.Enumerable.fromArray([1, 2, 3]);
    equals(xs.first(), _______);

    var itsOk = L2O.Enumerable
        .returnValue(42);
    equals(itsOk.first(), _______);
});

test('SimpleSubscription', function() {
    Rx.Observable
        .returnValue(42)
        .subscribe(function(x) { equals(x, _______); });	
});

test('SimpleReturn', function() {
    var received = '';
    Rx.Observable
        .returnValue('Foo')
        .subscribe(function(x) { received = x; });
    equals(received, _______);
});

test('TheLastEvent', function() {
    var received = '';
    var numbers = ['Foo','Bar'];
    Rx.Observable
        .fromArray(numbers)
        .subscribe(function(x) { received = x; });
    equals(received, _______);
});

test('EveryThingCounts', function() {
    var received = 0;
    var numbers = [3, 4 ];
    Rx.Observable
        .fromArray(numbers)
        .subscribe(function(x) { received += x; });
    equals(received, _______);	
});

test('DoingInTheMiddle', function() {
    var status = [];
    var daysTillTest = Range.create(1, 4).reverse().toObservable();
    daysTillTest
        .doAction(
            function(d) { status.push(
                d + '=' + (d === 1 ? 'Study Like Mad' : _______));
            })
        .subscribe();
	equals(
            status.toString(),
            '4=Party,3=Party,2=Party,1=Study Like Mad');
});

test('NothingListensUntilYouSubscribe', function() {
    var sum = 0;
    var numbers = Range.create(1,10).toObservable();
    var observable = numbers
        .doAction(function(n) { sum += n; });

    equals(0, sum);
    
    observable._______();	

    equals(55, sum); 
});
