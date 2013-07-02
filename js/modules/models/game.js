/**
 * @author Kate Compton
 */

// Organize the game
// Singleton pattern from here: http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript

define(['modules/views/game_view', 'modules/controllers/game_controller', 'modules/models/universe', 'modules/models/inventory'], function(gameView, gameController, universe, Inventory) {
    var game = {};

    var startGame = function() {
        // Make this into a global object

        game.view = gameView;
        console.log("START GAME");
        game.inventory = new Inventory();
        game.inventory.createPaletteDiv($("#controls"));

        // Hook the universe view to the universe, so it knows what to draw
        gameView.universeView.addDrawable(universe);

        gameView.universeView.onUpdate(function(time) {
            universe.update(time);

        });

        gameView.universeView.setCamera(universe.camera);

        // Give the game controller access to the universe view so that it
        //  can find objects by screen position
        gameController.universeController.setUniverseView(gameView.universeView);

        gameController.universeController.onControl(function(mouse) {
            universe.gestureUpdate(mouse);

        });
    };

    return {
        startGame : startGame,
    };

});
