/**
 * @author Kate Compton
 */

// Organize the game
// Singleton pattern from here: http://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-singleton-in-javascript
var stellarGame;
var utilities = {
	// put noise in here too?
	
	constrain : function (val, lowerBound, upperBound){
    	if(Math.max(val, upperBound) === val)
    		val = upperBound;
    	if(Math.min(val, lowerBound) === val)
    		val = lowerBound;
    }
};

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
