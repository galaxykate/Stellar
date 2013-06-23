/**
 * @author Kate Compton
 */

var utilities = {
	// put noise in here too?
	
	constrain : function (val, lowerBound, upperBound){
    	if(Math.max(val, upperBound) === val)
    		val = upperBound;
    	if(Math.min(val, lowerBound) === val)
    		val = lowerBound;
   },
    
    lerp : function (start, end, percent) {
    	return (start + percent*(end-start));
    }
};

require.config({
    paths : {
        'jQuery' : 'libs/jquery-1.10.1',
        'underscore' : 'libs/underscore',
        'processing' : 'libs/processing-1.4.1',
        'inheritance' : 'libs/inheritance'
    },
    shim : {
        'jQuery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'processing' : {
            exports : 'Processing'
        },
        'inheritance' : {
            exports : 'Inheritance'
        }
    }
});

require(['modules/models/game', 'jQuery'], function(GAME, $) {

    GAME.startGame();

});
