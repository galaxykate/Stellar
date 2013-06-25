/**
 * @author Kate Compton
 */

var stellarGame = {};
var utilities = {
    // put noise in here too?

    constrain : function(val, lowerBound, upperBound) {
        if (Math.max(val, upperBound) === val)
            return upperBound;
        if (Math.min(val, lowerBound) === val)
            return lowerBound;
        return val;
    },

    lerp : function(start, end, percent) {
        return (start + percent * (end - start));
    },

    debugOutput : function(output) {
        $("#debug_output").append(output + "<br>");
    },

    clearDebugOutput : function() {
        $("#debug_output").html("");
    },
    
    pnoise : function() {
    	
    }
};

require.config({
    paths : {
        'jQuery' : 'libs/jquery-1.10.1',
        'underscore' : 'libs/underscore',
        'processing' : 'libs/processing-1.4.1',
        'inheritance' : 'libs/inheritance',
        'noise' : 'libs/simplex_noise'
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
        },

    }
});

require(['modules/models/game', 'jQuery'], function(GAME, $) {

    GAME.startGame();

});
