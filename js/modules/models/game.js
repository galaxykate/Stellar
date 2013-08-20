/**
 * @author Kate Compton
 */

// Organize the game
// Singleton pattern from here: http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript


define(['modules/views/game_view', 'modules/controllers/game_controller', 'modules/models/universe',  'modules/views/universe_view', 'modules/models/inventory', 'modules/models/ui/uiManager'], function(gameView, gameController, Universe, UniverseView, Inventory, uiManager) {

    var game = {};

    var startGame = function() {
        // Make this into a global object
        
        var universe = new Universe();
        stellarGame.universe = universe;

        game.view = gameView;
        console.log("START GAME");

        // Hook the universe view to the universe, so it knows what to draw
        var universeView = new UniverseView(universe);
        gameView.universeView = universeView;

        // Give the game controller access to the universe view so that it
        //  can find objects by screen position
        gameController.universeController.setUniverseView(universeView);
        gameController.universeController.setUniverse(universe);
        gameController.universeController.init();

        game.inventory = new Inventory(universe);
        game.inventory.createPaletteDiv($("#controls"));
		
		uiManager.init();
		
        stellarGame.ready = true;

    };

    return {
        startGame : startGame,
    };

});
