(function(window){
    
    var keydownFunc = function(event) {
        event.preventDefault();
        console.log(event);
    };
    
    var keypressFunc = function(event) {
        event.preventDefault();
        console.log(event);
    };
    
    var run = function() {
//        this.addEventListener("keydown", keydownFunc);
        this.addEventListener("keypress", keypressFunc);
        
        this.appendChild(document.createTextNode("> "));
    };
    
    var createRunFunc = function(textarea) {
        return function() {
            run.apply(textarea);
        };
    };
    
    var init = function init(textarea) {
        if (!textarea) {
            textarea = document.createElement("TEXTAREA");
            textarea.className = "cli";
        }
        
        textarea.run = createRunFunc(textarea);
        
        return textarea;
    };
    
    window.cli = {
        init : init
    };
    
})(window);

