/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face"], function(Inheritance, Vector, Face) {
    return (function() {

        var states = [{
            name : "dust",
            idNumber : 0,
        }, {
            name : "star",
            idNumber : 1,
        }, {
            name : "nova",
            idNumber : 2,
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
                    break;

                case "overlay":
                    //var h = (this.idNumber * .212 + .3) % 1;
                    g.stroke(this.hue, 1, 1);
                    g.noFill();
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);

                    g.fill(this.hue, 1, 1);
                    g.text(this.state.name, this.radius, this.radius);
                    
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
