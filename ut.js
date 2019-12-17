(function (window) {

    var ut = {};

    ut.extend = function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
    };

    ut.add = function (testOrTests, fromRecursion) {
        if (!fromRecursion && this.tests.length > 0) {
            this.groupStartIndices.push(this.tests.length);
        }

        if ([].constructor == testOrTests.constructor) {
            for (var i = 0; i < testOrTests.length; ++i) {
                this.add(testOrTests[i], true);
            }
        }
        else if (typeof testOrTests == "function") {
            this.tests.push(testOrTests);
        }
        else {
            throw "Invalid operation";
        }
    };

    ut.doActAndWait = function (ms, actFunc) {
        this._engine.actAndWaitFunc = actFunc;
        this._engine.actAndWaitMs = ms;
        return {
            /** @expose */
            engine: this._engine,
            /** @expose */
            thenAssert: function (assertFunc) {
                this.engine.thenAssertFunc = assertFunc;
            }
        };
    };

    ut.doActDone = function () {
        if (this._engine.thenAssertTimeoutId) {
            window.clearTimeout(this._engine.thenAssertTimeoutId);
            delete this._engine.thenAssertTimeoutId;
            ut.queueThenAssertRun.call(this._engine, 1);
        }
    };

    ut.assert = {
        /** @expose */
        fail: function (message) { throw "Fail" + (message ? " - " + message : ""); },
        /** @expose */
        equal: function (expected, actual, message) { if (!(expected == actual)) { throw "Actual value not equal to expected value. Expected: " + expected + ", actual: " + actual + (message ? " - " + message : ""); } },
        /** @expose */
        exact: function (expected, actual, message) { if (!(expected === actual)) { throw "Actual value not exactly equal to expected value. Expected: " + expected + ", actual: " + actual + (message ? " - " + message : ""); } },
        /** @expose */
        approx: function (expected, lambda, actual, message) { if (Math.abs(actual - expected) / expected > lambda)  { throw "Actual value not approximately equal to expected value. Expected: " + expected + " (within " + (lambda * 100) + " %), actual: " + actual + (message ? " - " + message : ""); } },
        /** @expose */
        check: function (boolish, message) { if (!boolish) { throw "Actual value is not trueish" + (message ? " - " + message : ""); } },
        /** @expose */
        actAndWait: function (ms, func) { return ut.doActAndWait.call(this, ms, func); },
        /** @expose */
        actDone: function () { return ut.doActDone.call(this); },
        toString: function () { return "ut.assert object"; }
    };

    ut.displayResults = function () {
        var successCount = 0;
        var errorCount = 0;
        var i, result;
        var gsiIndex = 0;
        var nextSuccessIsGroup = false;
        for (i = 0; i < this.results.length; ++i) {
            if (i === this.groupStartIndices[gsiIndex]) {
                nextSuccessIsGroup = true;
                ++gsiIndex;
            }

            result = this.results[i];
            if (result.success) {
                ++successCount;
                if (nextSuccessIsGroup) {
                    result.addGroupSeparator = true;
                    nextSuccessIsGroup = false;
                }
            }
            else {
                ++errorCount;
            }
        }

        if (errorCount == 0) {
            this.output.infoHeading("Results: all " + successCount + " test(s) succeeded:");
        }
        else {
            this.output.errorHeading("Results: " + errorCount + "/" + (successCount + errorCount) + " test(s) failed:");
        }

        for (i = 0; i < this.results.length; ++i) {
            result = this.results[i];
            if (!result.success) {
                this.output.error(result.index + ": " + result.name + " FAILED: " + result.message);
            }
        }

        for (i = 0; i < this.results.length; ++i) {
            result = this.results[i];
            if (result.success) {
                if (result.addGroupSeparator) {
                    this.output.testGroupSeparator();
                }
                this.output.info(result.index + ": " + result.name + " SUCCEEDED");
            }
        }
    };

    ut.performTestFunc = function (engine, testFunc, innerAssert, testResults) {
        try {
            testFunc.call(engine, innerAssert);

            if (innerAssert.expectException) {
                testResults.hasError = true;
                testResults.message = "Expected an exception";
            }
            else {
                testResults.hasSuccess = true;
            }
        }
        catch (error) {
            if (innerAssert.expectException) {
                testResults.hasSuccess = true;
            }
            else {
                testResults.hasError = true;
                testResults.message = error;
            }
        }
    };

    ut.createInnerAssert = function (engine) {
        var innerAssert = {
            name: "Test " + engine.nextRunIndex,
            _engine: engine
        };
        ut.extend(innerAssert, ut.assert);

        return innerAssert;
    };

    ut.queueThenAssertRun = function (ms) {
        var func = (function (engine) {
            return function () {
                delete engine.thenAssertTimeoutId;
                var testFunc = engine.thenAssertFunc;
                var testResults = { hasError: false, hasSuccess: false, message: "" };

                ut.performTestFunc(engine, testFunc, engine.originalAssert, testResults);

                engine.thenAssertFunc = null;

                if (testResults.hasSuccess) {
                    engine.results.push({ name: engine.originalAssert.name, index: engine.nextRunIndex, success: true });
                }
                else if (testResults.hasError) {
                    engine.results.push({ name: engine.originalAssert.name, index: engine.nextRunIndex, message: testResults.message });
                }

                ++engine.nextRunIndex;
                ut.queueNextRun.call(engine);
            };
        })(this);

        this.thenAssertTimeoutId = window.setTimeout(func, ms || 1);
    };

    ut.queueActAndWaitRun = function () {
        var func = (function (engine) {
            return function () {
                var testFunc = engine.actAndWaitFunc;
                var testResults = { hasError: false, hasSuccess: false, message: "" };

                ut.performTestFunc(engine, testFunc, engine.originalAssert, testResults);

                engine.actAndWaitFunc = null;

                var doNext = false;
                if (testResults.hasSuccess && !engine.thenAssertFunc) {
                    engine.results.push({ name: engine.originalAssert.name, index: engine.nextRunIndex, success: true });
                    doNext = true;
                }
                else if (testResults.hasError) {
                    engine.results.push({ name: engine.originalAssert.name, index: engine.nextRunIndex, message: testResults.message });
                    doNext = true;
                }

                if (doNext) {
                    ++engine.nextRunIndex;
                    ut.queueNextRun.call(engine, engine.actAndWaitMs);
                }
                else if (engine.thenAssertFunc) {
                    ut.queueThenAssertRun.call(engine, engine.actAndWaitMs);
                }
            };
        })(this);

        window.setTimeout(func, 1);
    };

    ut.callThenFunc = function () {
        var data = {
            testCount: this.results.length,
            success: [],
            fail: []
        };
        for (var i = 0; i < this.results.length; ++i) {
            var result = this.results[i];
            if (result.success) {
                data.success.push({ name: result.name });
            }
            else {
                data.fail.push({ name: result.name, message: result.message });
            }
        }
        this.thenFunc.call(null, data);
    };

    /**
    * @param {number=} ms Milliseconds (optional)
    */
    ut.queueNextRun = function (ms) {
        if (this.nextRunIndex >= this.tests.length) {
            ut.displayResults.apply(this);
            if (this.thenFunc) {
                ut.callThenFunc.apply(this);
            }
        }
        else {
            var func = (function (engine) {
                return function () {
                    var innerAssert = ut.createInnerAssert(engine);
                    var testFunc = engine.tests[engine.nextRunIndex];
                    var testResults = { hasError: false, hasSuccess: false, message: "" };

                    ut.performTestFunc(engine, testFunc, innerAssert, testResults);

                    var doNext = false;
                    if (testResults.hasSuccess && !engine.actAndWaitFunc) {
                        engine.results.push({ name: innerAssert.name, index: engine.nextRunIndex, success: true });
                        doNext = true;
                    }
                    else if (testResults.hasError) {
                        engine.results.push({ name: innerAssert.name, index: engine.nextRunIndex, message: testResults.message });
                        doNext = true;
                    }

                    if (doNext) {
                        ++engine.nextRunIndex;
                        ut.queueNextRun.apply(engine);
                    }
                    else if (engine.actAndWaitFunc) {
                        engine.originalAssert = innerAssert;
                        ut.queueActAndWaitRun.apply(engine);
                    }
                };
            })(this);

            window.setTimeout(func, ms || 1);
        }
    };

    /** @expose */
    ut.run = function () {
        this.nextRunIndex = 0;
        this.results = [];
        var self = this;
        window.setTimeout(function() {
            ut.queueNextRun.call(self);
        }, 1);
        return this;
    };

    /** @expose */
    ut.then = function (func) {
        this.thenFunc = func;
    };

    ut.output = {
        infoOutput: function (text) { console.log(text); },
        errorOutput: function (text) { console.error(text); },
        /** @expose */
        testGroupSeparator: function () { }
    };

    /** @expose */
    ut.output.infoHeading = ut.output.infoOutput;
    /** @expose */
    ut.output.errorHeading = ut.output.errorOutput;
    /** @expose */
    ut.output.info = ut.output.infoOutput;
    /** @expose */
    ut.output.error = ut.output.errorOutput;

    /**
    * @expose
    * @constructor
    */
    ut.Engine = function (options) {
        this.tests = [];
        this.output = (options && options.output) || ut.output;
        this.groupStartIndices = [];
    };

    ut.Engine.prototype = {
        /** @expose */
        add: ut.add,
        /** @expose */
        run: ut.run,
        /** @expose */
        then: ut.then,
        toString: function () { return "ut.Engine object"; }
    };

    window["ut"] = {
        /** @expose */
        Engine: ut.Engine,
        /** @expose */
        defaultOutput: ut.output
    };

})(window);