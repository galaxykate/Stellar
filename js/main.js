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
    
    noiseInstance : undefined,
    // Takes up to 4 arguments and picks the correct 1D - 4D noise if those variables are defined
    // Refines the simplex noise to be 0-1 rather than -1 to 1
    pnoise : function(x, y, z, w) {
    	var result;
    	//utilities.debugOutput("x, y, z, w: " + x + ", " + y + ", " + z + ", " + w);
    	// May want to add an extra parameter for the random seed
    	if(w !== undefined){
    		result = utilities.noiseInstance.noise4D(x, y, z, w);
    	} else if (y !== undefined) {
    		result = utilities.noiseInstance.noise3D(x, y, z);
    	} else if (z !== undefined) {
    		result = utilities.noiseInstance.noise2D(x, y);
    	} else if (x !== undefined) {
    		result = utilities.noiseInstance.noise2D(x, x);
    	} else {
    		console.log("*** WARNING *** Called noise function without any parameters");
    	}
    	
    	return (result + 1)/2;
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

require(['modules/models/game', 'jQuery', 'noise'], function(GAME, $, Noise) {

	utilities.noiseInstance = new Noise();
    GAME.startGame();

});
