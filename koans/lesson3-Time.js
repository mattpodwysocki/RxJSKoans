module('Lesson 3 - Time');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */

asyncTest('Wait for seconds', function() {
	var received = '';
	var delay = ___;
	Rx.Scheduler.Immediate.Schedule(function() { received = 'Finished'; }, delay);
	setTimeout(function() { equals(received, 'Finished'); start(); }, 2000);
});