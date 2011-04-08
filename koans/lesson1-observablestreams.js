module('Lesson 1 - Observable Streams');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */
 
test('SimpleSubscription', function() {
    Rx.Observable.Return(42).Subscribe(function(x) { equals(x, ___); });	
});

test('SimpleReturn', function() {
    var received = '';
    Rx.Observable.Return('Foo').Subscribe(function(x) { received = x; });
    equals(___, received);
});

test('TheLastEvent', function() {
    var received = '';
    var numbers = ['Foo','Bar'];
    Rx.Observable.FromArray(numbers).Subscribe(function(x) { received = x; });
    equals(___, received);
});

test('EveryThingCounts', function() {
	var received = 0;
	var numbers = [3, 4 ];
	Rx.Observable.FromArray(numbers).Subscribe(function(x) { received += x; });
	equals(___, received);	
});

test('DoingInTheMiddle', function() {
	var status = [];
	var daysTillTest = Range.create(1, 4).reverse().toObservable();
	daysTillTest.Do(function(d) { status.push(d + '=' + (d === 1 ? 'Study Like Mad' : ___)); }).Subscribe();
	equals('4=Party,3=Party,2=Party,1=Study Like Mad', status.toString());
});

test('NothingListensUntilYouSubscribe', function() {
	var sum = 0;
	var numbers = Range.create(1,10).toObservable();
	var observable = numbers.Do(function(n) { sum += n; });
	equals(0, sum);
	observable.___();	
	equals(1+2+3+4+5+6+7+8+9+10, sum); 
});
