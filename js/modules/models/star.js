/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face"], function(Inheritance, Vector, Face) {
    return (function() {

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
                var segments = 16;
                var theta;
                var r;
                g.beginShape();
                for (var i = 0; i < segments; i++) {
                    theta = i * 2 * Math.PI / segments;
                    r = (Math.random() * Math.random() + 1) * this.radius;
                    g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                }
                g.endShape();
            }
        }];

        var randomState = function() {
            return states[Math.floor(Math.random() * 3)];
        };

        // Private functions
        var starCount = 0;

        function initAsParticle(p) {
            p.position = new Vector.Vector(0, 0);
            p.velocity = new Vector.Vector(0, 0);
            p.forces = [];
            p.totalForce = new Vector.Vector(0, 0);
        };
        
        function initGraphics(p) {
        	p.h = (this.idNumber * .212 + .3) % 1;
        	p.width = 50;
        	p.height = 50;
        };
        
        function initFace(p) {
        	//console.log(Face);
        	p.face = new Face.Face();
        	// probably setting some other facial variables here
        };

        function testDraw(g) {
            var h = (this.idNumber * .212 + .3) % 1;
            g.fill(h, 1, 1);

            g.ellipse(this.position.y, this.position.x, 50, 50);
        };

        function drawLayer(g, options) {

            switch(options.layer) {
                case "bg":
                    break;

                case "main":

                    var h = (this.idNumber * .212 + .3) % 1;
                    g.fill(h, 1, 1);
                    g.noStroke();
                    g.ellipse(0, 0, this.radius, this.radius);
                    
                    this.face.draw(g, this.radius *.8, this.radius *.8)
                    this.state.draw(g, this, options);

                    break;

                case "overlay":
                    //var h = (this.idNumber * .212 + .3) % 1;
                    g.stroke(this.hue, 1, 1);
                    g.noFill();
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);

                    g.fill(this.hue, 1, 1);
                    g.text(this.state.name, this.radius*.5 + 5, this.radius*.4 + 5);
                    
                    break;
            }
        };

        // Make the star class
        var Star = Class.extend({
        	
            init : function() {

                this.idNumber = starCount;
                this.state = randomState();
                this.radius = Math.random() * 100 + 10;
                starCount++;
                initAsParticle(this);
                // idNumber must be set before initting graphics (moved hue stuff there)
                initGraphics(this);
                this.position.setToPolar(Math.random() * 100, Math.random() * 100);
                this.velocity.addPolar(Math.random() * 100, Math.random() * 100);
				initFace(this);
            },

            update : function(time) {

                this.totalForce.setToMultiple(this.position, -3);
                this.velocity.addMultiple(this.totalForce, time.ellapsed);
                //  console.log("Update star " + time.ellapsed);
                this.position.addMultiple(this.velocity, time.ellapsed);
                //   console.log(this.velocity);
                
                this.face.update(time);
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
