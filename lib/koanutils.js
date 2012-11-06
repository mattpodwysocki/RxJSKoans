var Range = {
    create : function (start, count) {
        var values = [];
        for(var i = 0; i < count; i++) {
            values.push(i + start);
        }
        
        return values;
    }
}; 

Array.prototype.toObservable = function() {
    return Rx.Observable.fromArray(this);
};

var Ix = L2O;

Array.prototype.toEnumerable = function() {
    return Ix.Enumerable.fromArray(this);
};

Rx.Subject.prototype.onNextAll = function() {
    var subject = this;
    for(var arg in arguments) {
        subject.onNext(arguments[arg]);
    }
};
