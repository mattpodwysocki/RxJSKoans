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

Rx.Subject.prototype.OnNextAll = function() {
    var subject = this;
    for(var arg in arguments) {
        subject.onNext(arguments[arg]);
    }
};
