(function (window) {

    var mock = {};

    mock.wrapFunc = function (theMockery, name, func) {
        var result = function () {
            ++theMockery[name].callCount;
            return func.apply(theMockery.__setups, [].splice.apply(arguments));
        };
        return result;
    };

    /** @constructor */
    var mockery = function (source) {
        this.__setups = {};

        if (source) {
            for (var key in source) {
                if (typeof source[key] == "function") {
                    this.setup(key, function () {
                    });
                } else {
                    this.__setups[key] = source[key];
                }
            }
        }

    };

    /** @expose */
    mockery.prototype.setup = function (name, func) {
        this.__setups[name] = mock.wrapFunc(this, name, func);
        if (!this[name]) this[name] = {
            /** @expose */
            callCount: 0
        };
        return this;
    };

    /** @expose */
    mockery.prototype.proxy = function () {
        return this.__setups;
    };

    mock.create = function (source) {
        return new mockery(source);
    };

    window["mock"] = {
        /** @expose */
        create: mock.create
    };

})(window);