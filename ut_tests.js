(function (window) {

    var tests = [];

    tests.push(function (assert) {
        assert.name = "ut.Engine ctor should create empty Engine";
        // Arrange

        // Act
        var e = new ut.Engine();

        // Assert
        assert.check(e);
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add for single test should not crash";
        // Arrange
        var e = new ut.Engine();

        // Act
        e.add(function () { });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add for single test in array should not crash";
        // Arrange
        var e = new ut.Engine();

        // Act
        e.add([function () { } ]);
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add for two tests should not crash";
        // Arrange
        var e = new ut.Engine();

        // Act
        e.add([function () { }, function () { } ]);
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add for two tests twice should not crash";
        // Arrange
        var e = new ut.Engine();

        // Act
        e.add([function () { }, function () { } ]);
        e.add([function () { }, function () { } ]);
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for empty engine should write header but no test info";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(1, output.infoHeading.callCount, "infoHeading");
            assert.exact(0, output.info.callCount, "info");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for one successful test should write header and test info";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function () { });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(1, output.infoHeading.callCount, "infoHeading");
            assert.exact(1, output.info.callCount, "info");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for two successful tests should write header and two test infos";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function () { });
        e.add(function () { });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(1, output.infoHeading.callCount, "infoHeading");
            assert.exact(2, output.info.callCount, "info");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for one failing test should write error header and test error";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function () {
            throw "BAD!";
        });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(1, output.errorHeading.callCount, "errorHeading");
            assert.exact(1, output.error.callCount, "error");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for failing test with expected exception should write header and test info";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function (ass) {
            ass.expectException = true;
            throw "BAD!";
        });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(0, output.errorHeading.callCount, "errorHeading");
            assert.exact(0, output.error.callCount, "error");
            assert.exact(1, output.infoHeading.callCount, "infoHeading");
            assert.exact(1, output.info.callCount, "info");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.run for one failing and one successful test should write error header and test error and test info";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function () {
            throw "BAD!";
        });
        e.add(function () {
            // good
        });

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(1, output.errorHeading.callCount, "errorHeading");
            assert.exact(1, output.error.callCount, "error");
            assert.exact(1, output.info.callCount, "info");
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.then should call then-func with correct data";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function (a) {
            a.name = "Bad foo test";
            throw "BAD FOO!";
        });
        e.add(function (a) {
            a.name = "Bad bar test";
            throw "BAD BAR!";
        });
        e.add(function (a) {
            a.name = "Good foo test";
        });
        var thenData = null;
        var thenFunc = function (data) {
            thenData = data;
            assert.actDone();
        };

        // Act
        assert.actAndWait(100, function () {
            e.run().
            then(thenFunc);
        }).

        // Assert
        thenAssert(function () {
            assert.exact(3, thenData.testCount, "testCount");
            assert.exact(1, thenData.success.length, "success.length");
            assert.exact(2, thenData.fail.length, "fail.length");
            assert.equal("Good foo test", thenData.success[0].name);
            assert.equal("Bad foo test", thenData.fail[0].name);
            assert.equal("BAD FOO!", thenData.fail[0].message);
            assert.equal("Bad bar test", thenData.fail[1].name);
            assert.equal("BAD BAR!", thenData.fail[1].message);
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add should divide tests into groups when called twice times";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add([function () { } ]); // Adding one test
        e.add([function () { }, function () { } ]); // Adding two tests - this should create a new group

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(3, output.info.callCount);
            assert.exact(1, output.infoHeading.callCount);
            assert.exact(1, output.testGroupSeparator.callCount);
        });
    });

    tests.push(function (assert) {
        assert.name = "ut.Engine.add should divide tests into groups when called multiple";
        // Arrange
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add([function () { } ]); // Adding one test
        e.add([function () { }, function () { } ]); // Adding two tests - this should create a new group
        e.add([function () { } ]); // Adding one test - this should create another group

        // Act
        assert.actAndWait(100, function (a) { e.run().then(function () { a.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.exact(4, output.info.callCount);
            assert.exact(1, output.infoHeading.callCount);
            assert.exact(2, output.testGroupSeparator.callCount);
        });
    });

    tests.push(function (assert) {
        assert.name = "assert.actAndWait should wait approximately the correct amount of milliseconds before calling thenAssertFunc";
        // Arrange
        var runTime = 0;
        var assertTime = 0;
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function (a) {
            a.actAndWait(100, function () {
                runTime = (new Date()).getTime();
            }).thenAssert(function () {
                assertTime = (new Date()).getTime();
            });
        });

        // Act
        assert.actAndWait(200, function (a) { e.run().then(function () { assert.actDone(); }); }).

        // Assert
        thenAssert(function () {
            var diff = assertTime - runTime;
            assert.approx(100, 0.5, diff);
        });
    });

    tests.push(function (assert) {
        assert.name = "assert.actDone should move on to thenAssertFunc directly";
        // Arrange
        var runTime = 0;
        var assertTime = 0;
        var output = mock.create(ut.defaultOutput);
        var e = new ut.Engine({ output: output.proxy() });
        e.add(function (a) {
            a.actAndWait(10000, function (aa) {
                runTime = (new Date()).getTime();
                window.setTimeout(function () { aa.actDone(); }, 50);
            }).thenAssert(function () {
                assertTime = (new Date()).getTime();
            });
        });

        // Act
        assert.actAndWait(200, function (a) { e.run().then(function () { assert.actDone(); }); }).

        // Assert
        thenAssert(function () {
            assert.check(assertTime, "Timeout wasn't aborted");
            var diff = assertTime - runTime;
            assert.check(diff >= 40, diff + " ms is less than 40 ms");
            assert.check(diff <= 80, diff + " ms is more than 80 ms (is this IE <10?)");
        });
    });
    
    tests.push(function (assert) {
        assert.name = "assert.approx should accept min and max limits";
        // Arrange
        var min = 80;
        var max = 120;
        
        // Act
        assert.approx(100, 0.2, min);
        assert.approx(100, 0.2, max);
    });
    
    tests.push(function (assert) {
        assert.name = "assert.approx should fail below limits";
        // Arrange
        assert.expectException = true;
        
        // Act
        assert.approx(100, 0.2, 79.99);
    });
    
    tests.push(function (assert) {
        assert.name = "assert.approx should fail above limits";
        // Arrange
        assert.expectException = true;
        
        // Act
        assert.approx(100, 0.2, 120.01);
    });

    window.ut.tests = tests;

})(window);

