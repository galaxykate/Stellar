/**
 * @author Kate Compton
 */

var stellarGame = {
    drawFaces : false,
    drawElements : true,
    drawDust : true, // usually true
    drawStars : true, // usually true
    drawCritters : true,

    time : {
        universeTime : 0,
        gameTime : 0,
        updateCount : 0,
    },

    // For display purposes!
    statistics : {
        numItemsInQuadTree : 0,
    },

    player : {

    },

    options : {},
    tunings : {},

    addOption : function(key, defaultValue) {

        this.options[key] = defaultValue;

        // add a div for the checkbox
        var div = $('<div/>', {
            id : key + '_checkbox',
            "class" : "option_checkbox_holder",
            text : key
        });

        var checkbox = $('<input/>', {
            type : "checkbox",
            name : key,
        });
        checkbox.appendTo(div);
        checkbox.prop('checked', defaultValue);

        checkbox.change(function() {
            stellarGame.options[key] = this.checked;
        });

        div.appendTo("#options_panel");

    },

    addTuning : function(key, defaultValue, min, max) {

        this.tunings[key] = defaultValue;

        // add a div for the checkbox
        var div = $('<div/>', {
            id : key + '_checkbox',
            "class" : "option_checkbox_holder",
            text : key
        });

        var checkbox = $('<input/>', {
            type : "checkbox",
            name : key,
        });
        checkbox.appendTo(div);
        checkbox.prop('checked', defaultValue);

        checkbox.change(function() {
            stellarGame.options[key] = this.checked;
        });

        div.appendTo("#options_panel");

    },
};

var utilities = {
    // put noise in here too?

    sCurve : function(v, iterations) {
        for (var i = 0; i < iterations; i++) {
            var v2 = .5 - .5 * Math.cos(v * Math.PI);
            v = v2;
        }
        return v;
    },

    within : function(val, min, max) {
        return (val >= min) && (val <= max);
    },

    // Inefficient, fix someday
    // the weight is determined by the function getWeight(index, item, list)
    getWeightedRandom : function(array) {
        var totalWeight = 0;
        var length = array.length;

        for (var i = 0; i < length; i++) {

            totalWeight += array[i];
        };

        var randomNumber = Math.floor(Math.random() * totalWeight);
        var cumWeight = 0;

        for (var i = 0; i < length; i++) {

            cumWeight += array[i]
            if (randomNumber < cumWeight) {
                return i;
            }
        };

    },

    getRandom : function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

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
    touchOutput : function(output) {
        $("#touch_output").append(output + "<br>");
    },
    clearTouchOutput : function() {
        $("#touch_output").html("");
    },
    debugArrayOutput : function(outputArray) {
        $.each(outputArray, function(index, output) {
            $("#debug_output").append(output + "<br>");

        });
    },
    clearDebugOutput : function() {
        $("#debug_output").html("");
    },
    noiseInstance : undefined,
    // Takes up to 4 arguments and picks the correct 1D - 4D noise if those variables are defined
    // Refines the simplex noise to be 0-1 rather than -1 to 1
    pnoise : function(x, y, z, w) {
        var result;
        // May want to add an extra parameter for the random seed
        if (w !== undefined) {
            result = utilities.noiseInstance.noise4D(x, y, z, w);
        } else if (z !== undefined) {
            result = utilities.noiseInstance.noise3D(x, y, z);
        } else if (y !== undefined) {
            result = utilities.noiseInstance.noise2D(x, y);
        } else if (x !== undefined) {
            result = utilities.noiseInstance.noise2D(x, x);
        } else {
            console.log("*** WARNING *** Called noise function without any parameters");
        }

        return (result + 1) / 2;
    },
    random : function() {
        if (arguments.length === 0)
            return Math.random();
        if (arguments.length === 1)
            return Math.random() * arguments[i];
        if (arguments.length === 2)
            return Math.random() * (arguments[1] - arguments[0]) + arguments[0];

        return Math.random();
    },
    roundNumber : function(num, places) {
        // default 2 decimal places
        if (places === undefined) {
            return parseFloat(Math.round(num * 100) / 100).toFixed(2);
        } else {
            return parseFloat(Math.round(num * 100) / 100).toFixed(places);
        }
    }
};

require.config({
    paths : {
        'three' : 'libs/three',
        'jQuery' : 'libs/jquery-1.10.1',
        'jQueryUI' : 'libs/jquery-ui',
        'jQueryUITouchPunch' : 'libs/jquery.ui.touch-punch',
        'jQueryHammer' : 'libs/jquery.hammer',
        'mousewheel' : 'libs/jquery.mousewheel',
        'voronoi' : 'libs/rhill-voronoi-core',
        'underscore' : 'libs/underscore',
        'processing' : 'libs/processing-1.4.1',
        'inheritance' : 'libs/inheritance',
        'noise' : 'libs/simplex_noise',
        'quadtree' : 'modules/models/quadtree',
        'particleTypes' : 'modules/models/particles/particle_types',
        'toolTypes' : 'modules/models/tools/tool_types',
        'tool' : 'modules/models/tools/tool',
        'uparticle' : 'modules/models/particles/uparticle',
        'chanceTable' : 'modules/models/chanceTable',

        'spring' : 'modules/models/particles/spring',
        'kcolor' : 'modules/models/kcolor',
        'edge' : 'modules/models/edge',

        'lifespan' : 'modules/models/lifespan',

    },
    shim : {
        'jQueryUITouchPunch' : {
            exports : '$',
            deps : ['jQueryUI']
        },
        'jQueryHammer' : {
            exports : '$',
            deps : ['jQueryUI']
        },
        'jQueryUI' : {
            exports : '$',
            deps : ['jQuery']
        },

        'mousewheel' : {
            exports : 'mousewheel',
            deps : ['jQuery']
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
        'three' : {
            exports : 'THREE'
        },

        'voronoi' : {
            exports : 'Voronoi'
        },

    }
});

require(['jQueryUI', 'noise', 'modules/models/game'], function(JQUERY, Noise, GAME) {

    utilities.noiseInstance = new Noise();
    GAME.startGame();

});
