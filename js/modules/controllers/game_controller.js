/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(['modules/controllers/universe_controller'], function(UNIVERSE_CONTROLLER) {
    // Return the singleton here:
    return (function() {

        console.log("Init singleton game controller");
        var privateVar = '';

        function privateMethod() {
            // ...
        }

        return {

            // public interface
            publicMethod1 : function() {
                // all private members are accesible here
            },
            publicMethod2 : function() {
            }
        };
    })();

});
