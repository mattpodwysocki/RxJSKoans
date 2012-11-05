module('Lesson 3 - Time');

/*
 * Step 1: find the 1st method that fails
 * Step 2: Fill in the blank ____ to make it pass
 * Step 3: run it again
 * Note: Do not change anything other than the blank
 */

asyncTest('LaunchingAnActionInTheFuture', function() {
    var received = '';
    var delay = 250/*_______*/;
    Rx
        .Scheduler
        .immediate
        .schedule(function() { received = 'Finished'; }, delay);

    setTimeout(function() { equals(received, 'Finished'); start(); }, 500);
});

asyncTest('LaunchingAnEventInTheFuture', function() {
    var received = '',
        time = 250/*_______*/;
        
    Rx
        .Observable
        .returnValue('Godot', Rx.Scheduler.Immediate)
        .delay(time)
        .subscribe(function(x) { received = x; });
    
    setTimeout(function() { equals(received, 'Godot'); start(); }, 500);
});

asyncTest('AWatchedPot', function() {
    var received = '',
        delay = 500,
        timeout = 650/*_______*/,
        timeoutEvent =
            Rx  .Observable
                .returnValue('Tepid');
        
    Rx
        .Observable
        .returnValue('Boiling')
        .delay(delay)
        .timeout(timeout, timeoutEvent)
        .subscribe(function(x) { received = x; });
    
    setTimeout(function() { equals(received, 'Boiling'); start(); }, 500);
});
 
