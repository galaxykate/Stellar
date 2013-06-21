/**
 * @author Kate Compton
 */

// Organize the game

define(['modules/views/game_view', 'modules/controllers/game_controller'], function(GAME_VIEW, GAME_CONTROLLER) {
    var startGame = function() {
        console.log("START GAME");
        GAME_VIEW.init();
        GAME_CONTROLLER.init();

    };

    return {
        startGame : startGame,
    };

});
