/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "uparticle", particleTypePath + "dust", 'lifespan'], function(Inheritance, Vector, Face, ElementSet, UParticle, Dust, Lifespan) {
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
        
        // Only stars burn dust
        // They burn so long as there is fuel
        var updateDustBurning = function(star) {
        	star.tempGenerated = star.elements.burnSomeFuel(star.temperature);
        	//utilities.debugOutput("temp: " + star.tempGenerated);
        	
        	// If the star is able to burn energy again and is marked as a nova, change it back to a star
        	if(star.tempGenerated > 0 && star.state === states[1]){
        		reviveStar(star);
        	}
        	
        	// If a star is unable to burn energy and is marked as a star, nova it!
            if(star.tempGenerated <= 0 && star.state === states[0]) {
            	triggerSupernova(star);
            }
            
        };
        
        var updateInternalForces = function(star, burnedEnergy) {
        	star.internalGravity = 100 * star.mass;
        	star.outwardForce = 100 * burnedEnergy;
        	
        };
        
        // When enements are added to a dormant star
        var reviveStar = function(star){
        	star.state = states[0];
        }
        
        var DUSTEXPLOSIONVELOCITY = 600;
        
        // When a star runs out of elements
        var triggerSupernova = function(star) {
        	star.state = states[1];
        	
        	var elemsToShed = star.elements.calcShedElements(1, .5, .5);
        	//console.log("star " + star.idNumber + " elements: " + star.elements.elementQuantity);
        	//console.log("star " + star.idNumber + " toShed: " + elemsToShed);
        	var numDustToSpawn = Math.ceil(Math.random() * 5) + 2;
        	//console.log("star " + star.idNumber + " numDustToSpawn: " + numDustToSpawn);
        	for(var j = 0; j < elemsToShed.length; j++){
        		elemsToShed[j] = elemsToShed[j]/numDustToSpawn;
        	}

        	//star.radius = star.radius * .5; // shrink the star by half. Because.
        	
        	for(var i = 0; i < numDustToSpawn; i++) {
        		// spawn a new dust
        		var newDustObj = new Dust();
        		// give it elemsToShed/numDustToSpawn of each element
        		newDustObj.elements.clearAllElements();
        		star.elements.transferAmountsTo(newDustObj.elements, elemsToShed);
        		// place it at the center of the star
        		
        		newDustObj.position = star.position.clone();
        		
        		// give it a velocity directly away from the star
        		newDustObj.velocity.setTo(Math.random() * DUSTEXPLOSIONVELOCITY - (DUSTEXPLOSIONVELOCITY/2), Math.random()*DUSTEXPLOSIONVELOCITY - (DUSTEXPLOSIONVELOCITY/2));
        		//console.log("new Dust(star) pos, vel: " + newDustObj.position + ", " + newDustObj.velocity);
        		// optionally adjust drag?
        		//newDustObj.DEBUGPOSITION = true;
        		//newDustObj.DEBUGVELOCITY = true;
        		
        		stellarGame.universe.spawn(newDustObj);
        	}
        	
        	star.burningFuel = false;

        };
		
		var startLifeSpan = function(star){
			star.lifespan = new Lifespan(5);
			var startStarRadius = star.radius;
			var lifespanUpdate = function(){
				var startStarRadius = calcStarSizeOfElements(star);
				var maxWiggleRoom = startStarRadius * .5;
				if(star.lifespan.figuredPctCompleted < .5){
					// Grow up to wiggleRoom
					star.radiusModifier = (star.lifespan.figuredPctCompleted*2) * maxWiggleRoom; 
					//utilities.debugOutput("setting star radius (up): " + utilities.roundNumber(star.radiusModifier));
				} else {
					// shrink back down to starBaseRadius
					star.radiusModifier = maxWiggleRoom + ((1 - (star.lifespan.figuredPctCompleted*2)) * maxWiggleRoom);
					//utilities.debugOutput("setting star radius (down): " + utilities.roundNumber(star.radiusModifier));
				}
			};
			
			var lifespanOnEnd = function(){
				
				// Remove the star lifespan. May skip if this is too annoying.
				//var index = star.lifespans.indexOf(star.lifespan);
				//star.lifespans.splice(index, 1);
				
				//star.startLifeSpan(star);
				//console.log("trying to restart life span?");
				star.lifespan.restart();
			};
			
			var lifespanOnStart = function(){
				//star.lifespans.push(star.lifespan);
				//console.log("starting lifespan!");
			};
			
			star.lifespan.onUpdate(lifespanUpdate);
			// Repeating loop?! Hope it doesn't break!
			star.lifespan.onEnd(lifespanOnEnd);
			star.lifespan.onStart(lifespanOnStart);
			
			star.lifespans.push(star.lifespan);
			
		};
		
		var calcStarSizeOfElements = function(star){
			return Math.pow(star.elements.totalMass, .5);
		};
        

        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.state = states[0]; // turning off random states
                this.radius = Math.random() * 40 + 20;

                this.initFace();
				this.temperature = Math.random()*4000 + 1000;
				//console.log("star " + this.idNumber + " temp: " + this.temperature);
				this.burningFuel = true;
				
				// internal gravity will be a function of mass
				this.internalGravity;
				// outwardForce will be a function of the reactions
				this.outwardForce;
				
				this.acceptsDust = true;
				
				startLifeSpan(this);
				this.radiusModifier = 0;
				
				stellarGame.statistics.numberOfStars++;
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
                this.debugOutput(this.temperature);
                updateDustBurning(this);
                
                //utilities.debugOutput("radius: " + this.radius);
                this.radius = calcStarSizeOfElements(this) + this.radiusModifier;
                
                this.face.update(time, this.radius, this.radius);
                
                
                /*
                if(this.temperature === -10000 && this.burningFuel){
               		//this.remove();
               		triggerSupernova(this);
               	}*/
            }
        });

        return Star;
    })();

});
