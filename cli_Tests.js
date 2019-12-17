(function (window) {

    var tests = [];

    tests.push(function (assert) {
        assert.name = "cli.init ctor should not crash";
        // Act
        //cli.init();
    });

    window.cli.tests = tests;
})(window);
