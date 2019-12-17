(function (window) {

    var tests = [];

    tests.push(function (assert) {
        assert.name = "mock.create(void) should return some mock";
        // Arrange

        // Act
        var m = mock.create();

        // Assert
        assert.check(m);
    });

    tests.push(function (assert) {
        assert.name = "mock.proxy() should return some proxy";
        // Arrange
        var m = mock.create();

        // Act
        var p = m.proxy();

        // Assert
        assert.check(p);
    });

    tests.push(function (assert) {
        assert.name = "mock.setup('name') should enable proxy.name";
        // Arrange
        var m = mock.create();

        // Act
        m.setup("funcName", 1);
        var p = m.proxy();

        // Assert
        assert.check(p.funcName);
    });

    tests.push(function (assert) {
        assert.name = "mock.setup('name') and then proxy.name() should add to mock.name.callCount";
        // Arrange
        var m = mock.create();
        m.setup("funcName", function () { });
        var p = m.proxy();

        // Act
        p.funcName();

        // Assert
        assert.exact(1, m.funcName.callCount);
    });

    tests.push(function (assert) {
        assert.name = "mock.setup('name', func) should make proxy.name() call func";
        // Arrange
        var m = mock.create();
        var called = false;
        m.setup("funcName", function () { called = true; });
        var p = m.proxy();

        // Act
        p.funcName();

        // Assert
        assert.check(called);
    });

    tests.push(function (assert) {
        assert.name = "mock.create(obj) where obj has func and then proxy.func() should add to mock.func.callCount";
        // Arrange
        var obj = { func: function () { } };
        var m = mock.create(obj);
        var p = m.proxy();

        // Act
        p.func();

        // Assert
        assert.exact(1, m.func.callCount);
    });

    tests.push(function (assert) {
        assert.name = "mock.create(obj) where obj has func and then proxy.func() should not call obj.func()";
        // Arrange
        var called = false;
        var obj = { func: function () { called = true; } };
        var m = mock.create(obj);
        var p = m.proxy();

        // Act
        p.func();

        // Assert
        assert.check(!called);
    });

    tests.push(function (assert) {
        assert.name = "mock.create(obj) where obj has nonFuncProperty should replicate to mock.nonFuncProperty";
        // Arrange
        var obj = {
            func: function () { },
            nonFuncProperty : 123
        };
        var m = mock.create(obj);

        // Act
        var p = m.proxy();

        // Assert
        assert.check(obj !== p);
        assert.exact(123, p.nonFuncProperty);
    });

    window.mock.tests = tests;

})(window);