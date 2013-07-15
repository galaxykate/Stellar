/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "uparticle"], function(Vector, UParticle) {
    return (function() {

        var Spring = UParticle.extend({

            init : function(p0, p1) {
                this._super();
                this.p0 = p0;
                this.p1 = p1;

                this.calculatePosition();
                this.drawUntransformed = false;
                this.strength = .8;

            },

            calculatePosition : function() {
                this.position.setToLerp(this.p0.position, this.p1.position, .5);
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {
                this.idColor.stroke(g);
                g.strokeWeight(1);
                var center = new Vector();
                center.drawLerpedLineTo(g, this.offset, -.5, .5);
            },

            drawOverlay : function(g, options) {

            },

            beginUpdate : function(time) {
                this.offset = this.p1.position.getOffsetTo(this.p0.position);
            },

            finishUpdate : function(time) {
                this.calculatePosition();
            },

            addForces : function(time) {
                this.p0.totalForce.addMultiple(this.offset, -this.strength);
                this.p1.totalForce.addMultiple(this.offset, this.strength);
            }
        });

        return Spring;
    })();

});
