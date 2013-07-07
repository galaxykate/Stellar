/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "uparticle"], function(Vector, UParticle) {
    return (function() {

        var MyParticle = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.radius = Math.random() * 20 + 10;

            },

            drawBackground : function(g, options) {
                this.idColor.fill(g, -.8, .5);
                g.noStroke();
                g.ellipse(0, 0, this.radius, this.radius);

            },

            drawMain : function(g, options) {
                this.elements.drawAsDustCloud(g, this.radius, this.hacktime);

            },

            drawOverlay : function(g, options) {

            },

            update : function(time) {
                this._super(time);
            }
        });

        return MyParticle;
    })();

});
