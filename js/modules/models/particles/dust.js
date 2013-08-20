/**
 * @author April Grow
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "uparticle"], function(Inheritance, Vector, ElementSet, UParticle) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Dust = UParticle.extend({

            init : function(universe, parent) {

                this._super(universe);
                this.initAsElementContainer();
                this.siphonable = true;

                if (parent !== undefined) {
                    this.parent = parent;
                }
                stellarGame.statistics.numberOfDust++;
                this.type = "dust";
            },

            drawBackground : function(context) {
                this._super(context);
                var g = context.g;
                if (context.mode.index <= 2) {
                    if (stellarGame.drawDust) {
                        this.idColor.fill(g, -.8, .5);
                        g.noStroke();
                        g.ellipse(0, 0, this.radius, this.radius);
                    }
                }
            },

            drawMain : function(context) {
                this._super(context);

                var g = context.g;
                // Only draw for closest
                if (context.mode.index <= 1) {
                    if (this.scale === undefined) {
                        this.scale = 1;
                    }
                    g.pushMatrix();
                    g.scale(this.scale);
                    this.elements.drawAsDustCloud(g, this.radius, this.hacktime);
                    g.popMatrix();
                }
            },

            drawOverlay : function(context) {
                this._super(context);

            },

            update : function(time) {
                this._super(time);
            }
        });

        return Dust;
    })();

});
