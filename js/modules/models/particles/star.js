/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "uparticle"], function(Inheritance, Vector, Face, ElementSet, UParticle) {
    return (function() {

        var states = [{
            name : "star",
            idNumber : 0,
            draw : function(g, star, options) {

            }
        }, {
            name : "nova",
            idNumber : 1,
            draw : function(g, star, options) {
                var noise = utilities.noiseInstance;

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
            return states[Math.floor(Math.random() * 2)];
        };
        

        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.state = randomState();
                this.radius = Math.random() * 40 + 20;

                this.initFace();
				this.temperature = Math.random*3000;
            },

            initFace : function() {
                this.face = new Face.Face(this.idColor, this.idNumber);
            },

            drawBackground : function(g, options) {
                if (stellarGame.drawStars) {
                    this._super(g, options);
                }
            },

            drawMain : function(g, options) {
                // Do all the other drawing
                if (stellarGame.drawStars) {
                    this._super(g, options);
                    if (stellarGame.drawFaces)
                        this.face.draw(g);
                }

            },

            drawOverlay : function(g, options) {
                if (stellarGame.drawStars) {
                    this._super(g, options);
                }
            },

            update : function(time) {
                this._super(time);
                this.debugOutput(this.state.name);
                this.face.update(time, this.radius, this.radius);
            }
        });

        return Star;
    })();

});
