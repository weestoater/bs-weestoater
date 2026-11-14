// immediately invoked function expression (IIFE)
(function() {

    // set up utils class
    var utils = {
        // test function to log a message to the console
        test: function(msg) {
            console.log('This is an IIFE: ' + msg);
        }
    };

    utils.test('Hello World');
})();