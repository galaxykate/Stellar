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
                this.radius = Math.random() * 50 + 10;

            },
            
            drawBackground: function(g, options) {
				this.idColor.fill(g, -.8, .2);
                g.noStroke();
                g.ellipse(0, 0, this.radius, this.radius);
            },
            
            drawMain : function(g, options) {
                // Do all the other drawing
                if (stellarGame.drawElements) {
                    this.elements.drawAsDustCloud(g, this.radius);
                }
            },
            
            drawOverlay : function(g, options) {
            	
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
