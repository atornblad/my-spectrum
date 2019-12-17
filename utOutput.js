(function (window) {

    var utOutput = {};

    utOutput.targetDiv = null;
    utOutput.groupStart = false;
    utOutput.altGroup = false;

    utOutput.ensureDiv = function () {
        if (!utOutput.targetDiv) {
            var div = document.createElement("DIV");
            div.className = "utOutput";
            document.body.appendChild(div);
            utOutput.targetDiv = div;

            utOutput.add("H1", "info", "Unit test output");
        }
    };

    /**
      * @param {string} tag HTML tag
      * @param {string} className Element class name
      * @param {string} text Test
      * @param {boolean=} isGroupStart Element is start of new test group (optional)
      */
    utOutput.add = function (tag, className, text, isGroupStart) {
        utOutput.ensureDiv();
        var element = document.createElement(tag);
        if (isGroupStart) {
            utOutput.altGroup = !utOutput.altGroup;
            element.className = className + " newGroup";
            utOutput.groupStart = false;
        } else {
            element.className = className;
        }
        if (utOutput.altGroup) {
            element.className += " altGroup";
        }
        var textNode = document.createTextNode(text);
        element.appendChild(textNode);
        utOutput.targetDiv.appendChild(element);
    };

    utOutput.infoHeading = function (text) {
        utOutput.add("H2", "success", text);
    };

    utOutput.errorHeading = function (text) {
        utOutput.add("H2", "error", text);
    };

    utOutput.info = function (text) {
        utOutput.add("P", "success", text, utOutput.groupStart);
    };

    utOutput.error = function (text) {
        utOutput.ensureDiv();

        utOutput.add("P", "error", text);
    };

    utOutput.testGroupSeparator = function () {
        utOutput.groupStart = true;
    };

    window["utOutput"] = {
        /** @expose */
        infoHeading: utOutput.infoHeading,
        /** @expose */
        errorHeading: utOutput.errorHeading,
        /** @expose */
        info: utOutput.info,
        /** @expose */
        error: utOutput.error,
        /** @expose */
        testGroupSeparator: utOutput.testGroupSeparator
    };

})(window);