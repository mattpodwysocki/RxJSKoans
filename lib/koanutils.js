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
	return Rx.Observable.FromArray(this);
};