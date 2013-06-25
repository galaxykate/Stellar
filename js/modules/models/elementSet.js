/**
 * @author Kate Compton
 */

// Reusable Vector class

define(["modules/models/elements"], function(Elements) {
    return (function() {

        // Private functions

        // Make the Vector class
        function ElementSet() {
            console.log("Create element set");
        }

        return {
            // public interface
            ElementSet : ElementSet,

        };
    })();

});
