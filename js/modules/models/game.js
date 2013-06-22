/**
 * @author Kate Compton
 */

// Organize the game
var stellarGame;

define(['modules/views/game_view', 'modules/controllers/game_controller', 'modules/models/universe'], function(gameView, gameController, universe) {
    var startGame = function() {
        // Make this into a global object
        stellarGame = this;
        this.view = gameView;
        console.log("START GAME");

        // Hook the universe view to the universe, so it knows what to draw
        gameView.universeView.addDrawable(universe);

        gameView.universeView.onUpdate(function(time) {
            universe.update(time);
        });
    };

    return {
        startGame : startGame,
    };

});
