/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face","modules/models/elementSet", "noise"], function(Inheritance, Vector, Face, ElementSet, Noise) {
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

        // Private functions
        var starCount = 0;

        // Give this object a bunch of elements
        function initAsElementContainer(p) {
            p.elements = {
             
            };
        }

        function initAsParticle(p) {
            p.position = new Vector.Vector(0, 0);
            p.velocity = new Vector.Vector(0, 0);
            p.forces = [];
            p.totalForce = new Vector.Vector(0, 0);
        };

        function initGraphics(p) {

            p.hue = (p.idNumber * .212 + .3) % 1;
        };

        function initFace(p) {
            p.face = new Face.Face(p.hue);
        };

        function drawLayer(g, options) {

            switch(options.layer) {
                case "bg":
                    break;

                case "main":

                    g.fill(this.hue, 1, 1);
                    g.noStroke();
                    g.ellipse(0, 0, this.radius, this.radius);

                    this.face.draw(g)
                    this.state.draw(g, this, options);

                    break;

                case "overlay":
                    //var h = (this.idNumber * .212 + .3) % 1;
                    g.stroke(this.hue, 1, 1);
                    g.noFill();
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);

                    g.fill(this.hue, 1, 1);
                    var textX = this.radius * .5 + 5;
                    var textY = this.radius * .4 + 5;
                    g.text(this.state.name, textX, textY);

                    break;
            }
        };

        // Make the star class
        var Star = Class.extend({

            init : function(universe) {
                this.universe = universe;
                this.idNumber = starCount;
                this.state = randomState();
                this.radius = Math.random() * 100 + 10;
                starCount++;
                initAsParticle(this);
                // idNumber must be set before initting graphics (moved hue stuff there)
                initGraphics(this);
                this.position.setToPolar(Math.random() * 100, Math.random() * 100);
                this.velocity.addPolar(Math.random() * 100, Math.random() * 100);
                console.log("star's actual hue: " + this.hue);
                initFace(this);
            },

            update : function(time) {

                var d = this.position.magnitude();
                var outside = Math.max(0, d - 200);
                this.totalForce.setToMultiple(this.position, -Math.pow(outside, 3) / d);

                var noiseScale = .010;
                var nx = this.position.x * noiseScale;
                var ny = this.position.y * noiseScale;
                var theta = noise.noise2D(nx, ny);
                this.totalForce.addPolar(10, theta);
                this.velocity.addMultiple(this.totalForce, time.ellapsed);
                //  console.log("Update star " + time.ellapsed);
                this.position.addMultiple(this.velocity, time.ellapsed);
                //   console.log(this.velocity);

                this.face.update(time, this.radius * .8, this.radius * .8);
                //console.log("radius for face on update: " + this.radius * .8)
            },

            draw : drawLayer,
        });

        return {
            // public interface
            Star : Star,
            // Star creation

        };
    })();

});
