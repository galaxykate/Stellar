/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "modules/models/uparticle"], function(Inheritance, Vector, ElementSet, UParticle) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Dust = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.radius = Math.random() * 30 + 30;

            },
            
            drawMain : function(g, options) {
                // Do all the other drawing
                this._super(g, options);

            },
            update : function(time) {
                this._super(time);
            }
        });

        return {
            // public interface
            Dust : Dust,
            // Star creation

        };
    })();

});
