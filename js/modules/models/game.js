/**
 * @author Kate Compton
 */

// Organize the game
// Singleton pattern from here: http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript

define(['modules/views/game_view', 'modules/controllers/game_controller', 'modules/models/universe', 'modules/models/ui/uiManager', 'modules/models/quests/questManager', "modules/models/player"], function(GameView, GameController, Universe, uiManager, QuestManager, Player) {

    var startGame = function() {
        // Make this into a global object
        console.log("Start game");
        //============================================================
        //============================================================
        //============================================================
        //============================================================
        stellarGame.player = new Player();

        var universe = new Universe();

        // Hook the universe view to the universe, so it knows what to draw
        var gameView = new GameView();

        // Give the game controller access to the universe view so that it
        //  can find objects by screen position
        var gameController = new GameController();
        
       

        uiManager.init();
        QuestManager.init();

        stellarGame.ready = true;

    };

    return {
        startGame : startGame,
    };

});
