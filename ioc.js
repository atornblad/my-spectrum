(function (window) {

    var ioc = {};

    /** 
    * @param {string} name
    * @param {Object|Function} value
    */
    ioc.register = function (name, value) {
        if (typeof value == "function") {
            this.constructors[name] = value;
            delete this.instances[name];
        }
        else {
            this.instances[name] = value;
            delete this.constructors[name];
        }
    };

    ioc.buildup = function (target) {
        var dependencies = target["__dependencies"];
        if (!dependencies) return;
        for (var key in dependencies) {
            target[key] = this.resolve(dependencies[key]);
        }
    };

    /** 
    * @param {string|Function} nameOrObject
    */
    ioc.resolve = function (nameOrObject) {
        var temp;
        if (typeof nameOrObject == "string") {
            if (this.instances[nameOrObject]) {
                temp = this.instances[nameOrObject];
            }
            else {
                temp = new this.constructors[nameOrObject]();
            }
        }
        else {
            temp = nameOrObject;
        }
        ioc.buildup.call(this, temp);
        return temp;
    };

    /**
    * @constructor
    */
    ioc.Engine = function () {
        this.instances = {};
        this.constructors = {};
    };

    ioc.Engine.prototype = {
        /** @expose */
        register: ioc.register,
        /** @expose */
        resolve: ioc.resolve
    };

    /** @expose */
    window.ioc = {
        /** @expose */
        Engine: ioc.Engine
    };
})(window);