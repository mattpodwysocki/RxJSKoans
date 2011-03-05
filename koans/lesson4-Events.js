module('Lesson 4 - Events');

test('listening to events', function() {
	var received = '';
	var subscription = $(document).toObservable('foo').Subscribe(function(e) { received += e.payload; });
	$(document).trigger({ type: 'foo', payload : 'M'});
	$(document).trigger({ type: 'foo', payload : 'A'});
	$(document).trigger({ type: 'foo', payload : 'T'});
	subscription.Dispose();
	$(document).trigger({ type: 'foo', payload : 'T'});
	
	equals(received, ___);
});