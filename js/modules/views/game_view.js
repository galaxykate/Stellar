/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["processing", "modules/views/universe_view"], function(PROCESSING, UNIVERSE_VIEW) {
    var init = function() {
        console.log("START GAME VIEW");

        // Make the playfield into a Processing sketch

        UNIVERSE_VIEW.init();
    };

    return {
        init : init,
    };

});
