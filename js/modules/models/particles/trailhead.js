/*
* @author Stellar
*/

// UParticle-inherited class

define(["modules/models/vector", "uparticle", particleTypePath + "dust"], function(Vector, UParticle, Dust) {
    return (function() {

        var Trailhead = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.radius = Math.random() * 20 + 10;

            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {
                this.idColor.fill(g, .9, 1);

            },

            drawOverlay : function(g, options) {

            },

            initialUpdate : function() {
                var useSpiralDistribution = false;
                var p = this.position.clone();
                var v = new Vector();
                var f = new Vector();
                v.setToPolar(30, 100 * Math.random());

                var count = Math.floor(Math.random() * 10) + 2;
                for (var i = 0; i < count; i++) {

                    if (useSpiralDistribution) {
                        var r = 20 * Math.pow(i, .6) + 10;
                        var theta = 1.8 * Math.pow(i, .7);
                        p.setToPolarOffset(this.position, r, theta);
                    } else {
                        f.setToPolar(10, .2 * (p.x + p.y));
                        v.addMultiple(f, 1);
                        v.constrainMagnitude(30, 40);
                        p.addMultiple(v, 1);
                    }

                    var dust = new Dust();
                    dust.setRadius(10);
                    dust.position.setTo(p);
                    stellarGame.universe.spawn(dust);
                }
                // create stars around
            },

            update : function(time) {
                this._super(time);
            },
        });

        return Trailhead;
    })();

});
