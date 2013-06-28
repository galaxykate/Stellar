/**
 * @author Kate Compton
 */

// It's using a singleton pattern

define(["modules/views/universe_view"], function(universeView) {
    return (function() {

        console.log("Init game view");
        // Private functions

        function initializeUI() {

        };
        initializeUI();

        return {
            // public interface: these attributes are visible in the returned object
            universeView : universeView,
        };
    })();

});

