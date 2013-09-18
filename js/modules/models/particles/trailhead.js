/*
* @author Stellar
*/

// UParticle-inherited class

define(["modules/models/vector", "uparticle", particleTypePath + "dust", particleTypePath + 'sparkle'], function(Vector, UParticle, Dust, Sparkle) {
    return (function() {

        var explode = function(trailhead) {
            var numOfSparkles = Math.random() * 10 + 10;
            trailhead.mySparkleCount = Math.floor(numOfSparkles);

            for (var i = 0; i < numOfSparkles; i++) {
                var newSparkle = new Sparkle(stellarGame.universe, trailhead);
                var SPARKLEEXPLOSIONVELOCITY = Math.random() * 1200 + 300;
                newSparkle.drag = .9999;
                newSparkle.position = trailhead.position.clone();

                // give it a velocity directly away from the explosion
                newSparkle.velocity.setTo(Math.random() * SPARKLEEXPLOSIONVELOCITY - (SPARKLEEXPLOSIONVELOCITY / 2), Math.random() * SPARKLEEXPLOSIONVELOCITY - (SPARKLEEXPLOSIONVELOCITY / 2));

                stellarGame.universe.spawn(newSparkle);
            }
        };

        var Trailhead = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.radius = Math.random() * 20 + 10;
                stellarGame.statistics.numberOfTrails++;
                this.exploding = false;
                this.myDust = [];
                this.dustGoneCounter = 0;
                this.sparkleGoneCounter = 0;
                this.minLOD = 2;
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(context) {
                var g = context.g;
                if (this.exploding === false) {
                    this.idColor.fill(g, .9, 1);
                    var t = stellarGame.time.universeTime;
                    var radius = this.radius * .4;
                    g.noStroke();
                    var points = 5;
                    var starLevels = 2;
                    for (var j = 0; j < starLevels; j++) {
                        var jPct = j * 1.0 / (starLevels - 1);
                        g.fill(.65, (.3 - .3 * jPct), 1, .2 + jPct);
                        g.beginShape();
                        g.vertex(0, 0);
                        var pop = 0;
                        var segments = points * 10;
                        for (var i = 0; i < segments + 1; i++) {
                            var theta = i * 2 * Math.PI / segments;

                            var spike = Math.abs(Math.sin(theta * points / 2));
                            spike = 1 - Math.pow(spike, .2);

                            var sparkle = 1.1 * utilities.pnoise(t * 2 + theta + this.idNumber);
                            sparkle = Math.pow(sparkle, 2);

                            var r = .6 * radius * (spike * sparkle);

                            r += 1 + 1.5 * pop;
                            r *= radius * .7 * (1.2 - Math.pow(.7 * jPct, 1));
                            g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                        }
                        g.endShape();
                    }
                }
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

                    var dust = new Dust(stellarGame.universe, this);
                    dust.setRadius(10);
                    dust.position.setTo(p);
                    stellarGame.universe.spawn(dust);
                    this.myDust.push(dust);
                }
                // create stars around
            },

            update : function(time) {
                this._super(time);

                // See if all the dust is gone. If it is, EXPLODE!
                // Check if there is a line done later...
                if (this.dustGoneCounter === this.myDust.length && !this.exploding) {
                    this.exploding = true;
                    explode(this);
                }
                //utilities.debugOutput(this.sparkleGoneCounter + "==?" + this.mySparkleCount);
                if (this.sparkleGoneCounter === this.mySparkleCount) {
                    this.remove();
                }
            },

            handleDeleteOf : function(particle) {
                //console.log("should increment dustGoneCounter");
                if (particle.type === "dust") {
                    //console.log("incrementing dustGoneCounter");
                    this.dustGoneCounter++;
                } else if (particle.type === "sparkle") {
                    this.sparkleGoneCounter++;
                }
            }
        });

        return Trailhead;
    })();

});
