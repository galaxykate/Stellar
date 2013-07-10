/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "uparticle", particleTypePath + "dust"], function(Inheritance, Vector, Face, ElementSet, UParticle, Dust) {
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
        
        var triggerSupernova = function(star) {
        	star.state = states[1];
        	
        	var elemsToShed = star.elements.calcShedElements(1, .5, .5);
        	console.log("star " + star.idNumber + " elements: " + star.elements.elementQuantity);
        	console.log("star " + star.idNumber + " toShed: " + elemsToShed);
        	var numDustToSpawn = Math.ceil(Math.random() * 5) + 2;
        	console.log("star " + star.idNumber + " numDustToSpawn: " + numDustToSpawn);
        	for(var j = 0; j < elemsToShed.length; j++){
        		elemsToShed[j] = elemsToShed[j]/numDustToSpawn;
        	}

        	star.radius = star.radius * .5; // shrink the star by half. Because.
        	
        	for(var i = 0; i < numDustToSpawn; i++) {
        		// spawn a new dust
        		var newDustObj = new Dust();
        		// give it elemsToShed/numDustToSpawn of each element
        		newDustObj.elements.clearAllElements();
        		star.elements.transferAmountsTo(newDustObj.elements, elemsToShed);
        		// place it at the center of the star
        		
        		newDustObj.position = star.position.clone();
        		console.log("new Dust(star) position: " + newDustObj.position);
        		// give it a velocity directly away from the star
        		newDustObj.velocity.setTo(Math.random() * 50 - 25, Math.random()*50 - 25);
        		// optionally adjust drag?
        		
        		stellarGame.universe.spawn(newDustObj);
        	}
        	
        	star.burningFuel = false;

        };

        

        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.state = states[0]; // turning off random states
                this.radius = Math.random() * 40 + 20;

                this.initFace();
				this.temperature = Math.random()*3000 + 1000;
				console.log("star " + this.idNumber + " temp: " + this.temperature);
				this.burningFuel = true;
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
                
                if(this.temperature === -10000 && this.burningFuel){
               		//this.remove();
               		triggerSupernova(this);
               	}
            }
        });

        return Star;
    })();

});
