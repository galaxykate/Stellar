/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "noise", "modules/models/uparticle"], function(Inheritance, Vector, Face, ElementSet, Noise, UParticle) {
    return (function() {

        var noise = new Noise();

        var states = [{
            name : "dust",
            idNumber : 0,
            draw : function(g, star, options) {

            }
        }, {
            name : "star",
            idNumber : 1,
            draw : function(g, star, options) {

            }
        }, {
            name : "nova",
            idNumber : 2,
            draw : function(g, star, options) {
                var segments = 25;
                var theta;
                var r;
                var layers = 3;
                g.noFill();
                g.stroke(star.hue, 1, 1, 1);

                g.beginShape();
                var t = stellarGame.time.total;

                for (var j = 0; j < layers; j++) {
                    for (var i = 0; i < segments; i++) {
                        theta = i * 2 * Math.PI / segments;
                        r = 50 * (1 + noise.noise2D(theta, t * 2 + j * 100)) + star.radius;
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                }
                g.endShape(g.CLOSE);
            }
        }];

        var randomState = function() {
            return states[Math.floor(Math.random() * 3)];
        };

        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.state = randomState();
                this.radius = Math.random() * 120 + 30;

                this.initGraphics();
                this.initFace();

            },

            initGraphics : function() {

                this.hue = (this.idNumber * .212 + .3) % 1;
            },

            initFace : function(p) {
                this.face = new Face.Face(this.hue, this.idNumber);
            },

            drawMain : function(g, options) {
                // Do all the other drawing
                this._super(g, options);
                this.face.draw(g);

            }
        });

        return {
            // public interface
            Star : Star,
            // Star creation

        };
    })();

});
