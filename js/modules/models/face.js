/**
 * @author April Grow
 */

// The facial expression on top of stars

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {

        // Private functions

        function testDraw(g, faceWidth, faceHeight) {
            //var h = (.212 + .6) % 1;
            g.noStroke();
            g.fill(0.621, .1, 1);
            g.ellipse(0, 0, faceWidth, faceHeight);
        };

        // Make the Face class
        var Face = Class.extend({
            init : function() {
            	// Any defaults we need
            },

            update : function(time) {
				// blink, change facial expression
            },

            draw : testDraw,
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
