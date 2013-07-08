/**
 * @author Kate Compton
 */

// Organize the game
// Singleton pattern from here: http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript

define(['modules/views/game_view', 'modules/controllers/game_controller', 'modules/models/universe', 'modules/models/inventory'], function(gameView, gameController, universe, Inventory) {
    var game = {};

    var startGame = function() {
        // Make this into a global object

        universe.init();
        stellarGame.universe = universe;

        game.view = gameView;
        console.log("START GAME");

        // Hook the universe view to the universe, so it knows what to draw
        gameView.universeView.setUniverse(universe);

        gameView.universeView.onUpdate(function(time) {
            universe.update(time);

        });

        // Give the game controller access to the universe view so that it
        //  can find objects by screen position
        gameController.universeController.setUniverseView(gameView.universeView);
        gameController.universeController.init();

        game.inventory = new Inventory(universe);
        game.inventory.createPaletteDiv($("#controls"));

        stellarGame.ready = true;

    };

    return {
        startGame : startGame,
    };

});
