/**
 * @author Kate Compton
 */

var stellarGame = {};

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
