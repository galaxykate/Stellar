/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {

        var Popup = Class.extend({

            init : function() {
				console.log("Init a popup!!!");
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {

            },

            drawOverlay : function(g, options) {

            },

            update : function(time) {
            	
            }
        });

        return Popup;
    })();

});
