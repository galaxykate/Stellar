/**
 * @author April Grow
 */

// Spacey whaaaaaales

define(["inheritance", "modules/models/vector", "uparticle", "three"], function(Inheritance, Vector, UParticle, THREE) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Camera = UParticle.extend({

            init : function() {
this._super();
                this.zoom = 1;
                this.rotation = -Math.PI;
                this.name = "Camera";
                this.drawUntransformed = true;

            },

            drawBackground : function(context) {

            },

            drawMain : function(context) {
                if (stellarGame.options.drawCamera) {
                    g.noFill();
                    g.strokeWeight(1);
                    g.stroke(.55, 1, 1);
                    g.ellipse(0, 0, 50, 50);

                    var segments = 12;
                    var points = [];
                    for (var i = 0; i < segments; i++) {
                        points[i] = new Vector(this.position);
                        points[i].addPolar(30, i * 2 * Math.PI / segments);
                    }
                    context.universeView.drawShape(g, points);
                }
            },

            drawOverlay : function(context) {

            },
        });

        return Camera;
    })();

});
