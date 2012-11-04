(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports &&
    (typeof root == 'object' && root && root == root.global && (window = root), exports);

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['l2o', 'exports'], function (L2O, exports) {
            root.L2O = factory(root, exports, L2O);
            return root.L2O;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('./l2o'));
    } else {
        root.Rx = factory(root, {}, root.L2O);
    }
}(this, function (global, exp, root, undefined) {

    function noop () { }
    function identity (x) { return x; }
    function defaultComparer (x, y) { return x > y ? 1 : x < y ? -1 : 0; }

    var seqNoElements = 'Sequence contains no elements.';
    var slice = Array.prototype.slice;

    var Enumerable = root.Enumerable,
        EnumerablePrototype = Enumerable.prototype,
        enumerableConcat = Enumerable.concat,
        enumerableEmpty = Enumerable.empty,
        enumerableFromArray = Enumerable.fromArray,
        enumerableRepeat = Enumerable.repeat,
        enumeratorCreate = root.Enumerator.create;

    EnumerablePrototype.bufferWithCount = function (count, skip) {
        var parent = this;
        if (skip === undefined) { skip = count; }
        return new Enumerable(function () {
            var buffers = [], i = 0, e, current;
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        if (e.moveNext()) {

                            if (i % skip === 0) {
                                buffers.push([]);
                            }

                            for (var idx = 0, len = buffers.length; idx < len; idx++) {
                                buffers[idx].push(e.getCurrent());
                            }

                            if (buffers.length > 0 && buffers[0].length === count) {
                                current = Enumerable.fromArray(buffers.shift());
                                ++i;
                                return true;
                            }

                            ++i;
                        } else {
                             if (buffers.length > 0) {
                                current = Enumerable.fromArray(buffers.shift());
                                return true;
                            }
                            return false; 
                        }
                    }
                },
                function () {
                    return current;
                },
                function () {
                    e.dispose();
                });
        });
    };

    function catchExceptionHandler (source, handler) {
        return new Enumerable(function () {
            var current, enumerator, errEnumerator;
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = source.getEnumerator());

                    while (true) {
                        var b, c;
                        try {
                            b = enumerator.moveNext();
                            c = enumerator.getCurrent();
                        } catch (e) {
                            errEnumerator = handler(e);
                            break;
                        }

                        if (!b) {
                            break;
                        }

                        current = c;
                        return true;
                    }

                    if (errEnumerator) {
                        if (!errEnumerator.moveNext()) {
                            return false;
                        }
                        current = errEnumerator.getCurrent();
                        return true;
                    }
                }, 
                function () {
                    return current;
                }, 
                function () {
                    enumerator.dispose();
                    if (errEnumerator) {
                        errEnumerator.dispose();
                    }
                });
        });
    }

    EnumerablePrototype.catchException = function (secondOrHandler) {
        if (typeof secondOrHandler === 'function') {
            return catchExceptionHandler(this, secondOrHandler);
        }
        return enumerableCatch(this, secondOrHandler);
    };

    Enumerable.catchException = function () {
        var array = arguments;
        return new Enumerable(function () {
            var index = 0, current, enumerator, error;
            return enumeratorCreate(
                function () {
                    if (index < array.length) {
                        enumerator || (enumerator = array[index++].getEnumerator());
                        while (true) {
                            var b, c;
                            try {
                                b = enumerator.moveNext();
                                c = enumerator.getCurrent();
                            } catch (e) {
                                error = e;
                                break;
                            }

                            if (!b) {
                                enumerator.dipose();
                                enumerator = null;
                                break;
                            }

                            current = c;
                            return true;
                        }

                        if (!error) {
                            return false;
                        }
                    }

                    if (error) {
                        throw error;
                    }

                    return false;
                },
                function () { return current; },
                function () { enumerator.dispose(); }
            );
        });        
    };

    Enumerable.cases = function (selector, sources, defaultSource) {
        defaultSource || (defaultSource = enumerableEmpty());
        return enumerableDefer(function () {
            var result = sources[selector()]
            if (!result) {
                result = defaultSource;
            }
            return result;
        });
    };  

    var enumerableDefer = Enumerable.defer = function (enumerableFactory) {
        return new Enumerable(function () {
            var enumerator;
            return enumeratorCreate(function () {
                enumerator || (enumerator = enumerableFactory().getEnumerator());
                return enumerator.moveNext();
            }, function () {
                return enumerator.getCurrent();
            }, function () {
                enumerator.dispose();
            });
        });
    };

    EnumerablePrototype.distinctUntilChanged = function (selector, comparer) {
        comparer || (comparer = defaultComparer);
        var parent = this;
        return new Enumerable(function () {
            var current, index = 0, enumerator;
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = parent.getEnumerator());
                    while (true) {
                        if (!enumerator.moveNext()) {
                            return false;
                        }
                        var next = enumerator.getCurrent();
                        if (!defaultComparer(current, next)) {
                            current = next;
                            return true;
                        }
                    }
                },
                function () {
                    return current;
                },
                function () {
                    enumerator.dispose();
                });
        });
    };    

    EnumerablePrototype.doAction = function (action) {
        var parent = this;
        return new Enumerable(function () {
            var current, enumerator;
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = parent.getEnumerator());
                    if (!enumerator.moveNext()) {
                        return false;
                    }
                    current = enumerator.getCurrent();
                    action(current);
                    return true;
                },
                function () {
                    return current;
                },
                function () {
                    enumerator.dispose();
                }
            );
        });
    };

    Enumerable.doWhile = function (source, condition) {
        return source.concat(enumerableWhile(condition, source));
    };

    EnumerablePrototype.expand = function(selector) {
        var parent = this;
        return enumerableCreate(function () {
            var current, q = [parent], innerEnumerator;
            return enumeratorCreate(
                function () {
                    while (true) {
                        if (!innerEnumerator) {
                            if (q.length === 0) {
                                return false;
                            }
                            innerEnumerator = q.shift().getEnumerator();
                        }
                        if (innerEnumerator.moveNext()) {
                            current = innerEnumerator.getCurrent();
                            q.push(selector(current));
                            return true;
                        } else {
                            innerEnumerator.dispose();
                            innerEnumerator = null;
                        }
                    }
                },
                function () { return current; },
                function () {
                    if (innerEnumerator) {
                        innerEnumerator.dispose();
                    }
                }
            );
        });
    };

    EnumerablePrototype.finallyDo = function (finallyAction) {
        var parent = this;
        return new Enumerable(function () {
            var enumerator = parent.getEnumerator();
            return enumeratorCreate(
                function () {
                    return enumerator.moveNext();
                },
                function () {
                    return enumerator.getCurrent();
                },
                function () {
                    enumerator.dispose();
                    finallyAction();
                }
            );
        });
    };

    Enumerable.forLoop = function (source, resultSelector) {
        return source.select(resultSelector).selectMany(identity);
    };    

    Enumerable.generate = function (initialState, condition, iterate, resultSelector) {
        return new Enumerable(function () {
            var state, current, initialized = false;
            return enumeratorCreate(function () {
                if (!initialized) {
                    state = initialState;
                    initialized = true;
                } else {
                    state = iterate(state);
                    if (!condition(state)) {
                        return false;
                    }
                }
                current = resultSelector(state);
                return true;
            }, function () { return current; });
        });
    };

    Enumerable.ifThen = function (condition, thenSource, elseSource) {
        elseSource || (elseSource = enumerableEmpty());
        return enumerableDefer(function () { return condition() ? thenSource : elseSource; });
    };

    EnumerablePrototype.ignoreElements = function() {
        var parent = this;
        return new Enumerable(function () {
            var enumerator;
            return enumeratorCreate(
                function () {
                    enumerator = parent.getEnumerator();
                    while (enumerator.moveNext()) {
                    }
                    return false;
                },
                function () {
                    return undefined;
                },
                function () {
                    enumerator.dispose();
                }
            );
        });
    };

    EnumerablePrototype.isEmpty = function () {
        return !this.any();
    };

    function extremaBy (source, keySelector, comparer) {
        var result = [], e = source.getEnumerator();
        try {
            if (!e.moveNext()) {
                throw new Error(seqNoElements);
            }

            var current = e.getCurrent(),
                resKey = keySelector(current);
            result.push(current);

            while (e.moveNext()) {
                var cur = e.getCurrent(),
                    key = keySelector(cur),
                    cmp = comparer(key, resKey);
                if (cmp === 0) {
                    result.push(cur);
                } else if (cmp > 0) {
                    result = [cur];
                    resKey = key;
                }
            }
        } finally {
            e.dispose();
        }

        return enumerableFromArray(result);
    }

    EnumerablePrototype.maxBy = function (keySelector, comparer) {
        comparer || (comparer = defaultComparer);
        return extremaBy(this, keySelector, comparer);        
    };

    EnumerablePrototype.minBy = function(keySelector, comparer) {
        comparer || (comparer = defaultComparer);
        return extremaBy(this, keySelector, function (key, minValue) {
            return -comparer(key, minValue);
        });
    };     

    Enumerable.onErrorResumeNext = function () {
        var sources = arguments;
        return new Enumerable(function () {
            var current, index = 0, innerEnumerator;
            return enumeratorCreate(function () {
                while (index < sources.length) {
                    innerEnumerator || (innerEnumerator = sources[index++].getEnumerator());
                    try {
                        var result = innerEnumerator.moveNext();
                        if (result) {
                            current = innerEnumerator.getCurrent();
                            return true;
                        }
                    }
                    catch (e) {
                    }
                    innerEnumerator.dispose();
                    innerEnumerator = null;
                }
                return false;
            },
            function () {
                return current;
            },
            function () {
                if (innerEnumerator) {
                    innerEnumerator.dispose();
                }
            });
        });
    };

    EnumerablePrototype.repeat = function (count) {
        var parent = this;
        return enumerableRepeat(0, count).selectMany(function () { return parent; });
    };    

    EnumerablePrototype.retry = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, enumerator, myCount = count;
            if (myCount === undefined) {
                myCount = -1;
            }
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = parent.getEnumerator());
                    while (true) {
                        try {
                            if (enumerator.moveNext()) {
                                current = enumerator.getCurrent();
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch (e) {
                            if (myCount-- === 0) {
                                throw e;
                            }
                        }
                    }
                },
                function () {
                    return current;
                },
                function () {
                    enumerator.dispose();
                }
            );
        });
    };

    function scan (source, seed, accumulator) {
        var source = this;
        return enumerableDefer(function () {
            var accumulation, hasAccumulation = false;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = accumulator(seed, x);
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    }

    function scan1 (accumulator) {
        var source = this;
        return enumerableDefer(function () {
            var accumulation, hasAccumulation = false;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = x;
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    };    

    EnumerablePrototype.scan = function (/* seed, accumulator */) {
        var f = arguments.length === 1 ? scan1 : scan;
        return f.apply(this, args);
    };    

    EnumerablePrototype.skipLast = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, enumerator, q = [];
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = parent.getEnumerator());
                    while (true) {
                        if (!enumerator.moveNext()) {
                            return false;
                        }
                        q.push(enumerator.getCurrent());
                        if (q.length > count) {
                            current = q.shift();
                            return true;
                        }
                    }
                },
                function () {
                    return current;
                },
                function () {
                    enumerator.dispose();
                });
        });
    };    

    EnumerablePrototype.startWith = function () {
        return enumerableConcat(enumerableFromArray(slice.call(arguments)), this);
    };

    EnumerablePrototype.takeLast = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, enumerator, q;
            return enumeratorCreate(
                function () {
                    enumerator || (enumerator = parent.getEnumerator());
                    if (!q) {
                        q = [];
                        while (enumerator.moveNext()) {
                            q.push(enumerator.getCurrent());
                            if (q.length > count) {
                                q.shift();
                            }
                        }
                    }
                    if (q.length === 0) {
                        return false;
                    }
                    current = q.shift();
                    return true;
                },
                function () {
                    return current;
                },
                function () {
                    enumerator.dispose();
                }
            );
        });
    };    

    Enumerable.throwException = function (value) {
        return new Enumerable(function () {
            return enumeratorCreate(
                function () { throw value; },
                noop);
        });
    };

    Enumerable.using = function (resourceSelector, enumerableFactory) {
        return new Enumerable(function () {
            var current, first = true, enumerator, res;
            return enumeratorCreate(function () {
                if (first) {
                    res = resourceSelector();
                    enumerator = enumerableFactory(res).getEnumerator();
                    first = false;
                }

                if (!enumerator.moveNext()) {
                    return false;
                }

                current = enumerator.getCurrent();
                return true;
            }, function () {
                return current;
            }, function () {
                if (enumerator) { enumerator.dispose(); }                
                if (res) { res.dispose(); }
            });
        });
    };

    var enumerableWhileDo = Enumerable.whileDo = function (condition, source) {
        return enumerableRepeat(source).takeWhile(condition).SelectMany(identity);
    }; 

    /* Memoize */
    function RefCountList(readerCount) {
        this.readerCount = readerCount;
        this.list = {};
        this.count = 0;
    }

    var RefCountListPrototype = RefCountList.prototype;
    RefCountListPrototype.clear = function () {
        this.list = {};
    };
    RefCountListPrototype.get = function (index) {
        var res = this.list[index]
        if (!res) {
            throw new Error('Elemented no longer in the buffer');
        }
        var val = res.value;
        if (--res.count === 0) {
            delete this.list[index];
        }

        return val;
    };
    RefCountListPrototype.add = function (item) {
        this.list[this.count] = { count: this.readerCount, value: item };
        ++this.count;
    };
    RefCountListPrototype.done = function (index) {
        for (var i = 0; i < this.count; i++) {
            this.get(i);
        }
        this.readerCount--;
    };

    MaxRefCountList = function () {
        this.list = [];
        this.count = 0;
    }

    var MaxRefCountListPrototype = MaxRefCountList.prototype;
    MaxRefCountListPrototype.get = function (index) {
        return this.list[index];
    };
    MaxRefCountListPrototype.clear = function () {
        this.list = [];
        this.count = 0;
    };
    MaxRefCountListPrototype.add = function (item) {
        this.list[this.index++] = item;
    };
    MaxRefCountListPrototype.done = noop;

    return root;

}));
