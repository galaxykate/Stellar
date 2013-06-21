/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(['modules/controllers/universe_controller'], function(UNIVERSE_CONTROLLER) {
    var init = function() {
        console.log("START GAME CONTROLLER");
        UNIVERSE_CONTROLLER.init();
    };

    return {
        init : init,
    };

});
