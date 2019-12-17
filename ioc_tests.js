(function (window) {

    var tests = [];

    tests.push(function (assert) {
        assert.name = "ioc.Engine ctor should not crash";
        // Act
        var e = new ioc.Engine();

        // Assert
        assert.check(e);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine should have register function";
        // Arrange
        var e = new ioc.Engine();

        // Act

        // Assert
        assert.check(e.register);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine should have resolve function";
        // Arrange
        var e = new ioc.Engine();

        // Act

        // Assert
        assert.check(e.resolve);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine.resolve() should return object passed to ioc.Engine.register()";
        // Arrange
        var e = new ioc.Engine();

        // Act
        e.register("dummy.dependency", { a: 123 });
        var result = e.resolve("dummy.dependency");

        // Assert
        assert.equal(123, result.a);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine.resolve() should process dependencies";
        // Arrange
        var e = new ioc.Engine();
        var outer = {
            __dependencies: {
                oneDep: "one.dependency"
            },
            oneDep: null
        };
        var inner = {
            value: 999
        };

        // Act
        e.register("outer", outer);
        e.register("one.dependency", inner);
        var result = e.resolve("outer");

        // Assert
        assert.equal(999, result.oneDep.value);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine.resolve() should process dependencies for given object";
        // Arrange
        var e = new ioc.Engine();
        var outer = {
            __dependencies: {
                oneDep: "one.dependency"
            },
            oneDep: null
        };
        var inner = {
            value: 999
        };

        // Act
        e.register("one.dependency", inner);
        var result = e.resolve(outer);

        // Assert
        assert.equal(999, result.oneDep.value);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine.resolve() should return object created by ctor passed to ioc.Engine.register()";
        // Arrange
        var e = new ioc.Engine();
        var ctor = function () {
            this.foo = "bar";
        };

        // Act
        e.register("dummy.ctor", ctor);
        var result = e.resolve("dummy.ctor");

        // Assert
        assert.equal("bar", result.foo);
    });

    tests.push(function (assert) {
        assert.name = "ioc.Engine.resolve() should return deep objects";
        // Arrange
        var e = new ioc.Engine();
        var foo = function () {
            this.bar = null;
            this.__dependencies = { bar: "barDependency" };
        };
        var bar = function () {
            this.zing = null;
            this.__dependencies = { zing: "zingDependency" };
        };
        e.register("foo", foo);
        e.register("barDependency", bar);
        e.register("zingDependency", "zong");

        // Act
        var result = e.resolve("foo");

        // Assert
        assert.equal("zong", result.bar.zing);
    });

    window.ioc.tests = tests;

})(window);

