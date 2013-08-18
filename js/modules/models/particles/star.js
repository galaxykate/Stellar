/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "uparticle", particleTypePath + "dust", 'lifespan', "modules/models/ui/glow", particleTypePath + "supernovaStages"], function(Inheritance, Vector, Face, ElementSet, UParticle, Dust, Lifespan, Glow, SNS) {
    return (function() {

        var states = [{
            name : "inactive",
            idNumber : 0,
            draw : function(g, star, options) {

            }
        }, {
            name : "nova",
            idNumber : 1,
            draw : function(g, star, options) {

            }
        }, {
            name : "burning",
            idNumber : 2,
            draw : function(g, star, options) {
                var segments = 25;
                var theta;
                var r;
                var layers = 2;
                g.noFill();

                if(star.elements.burntElementID !== undefined && star.elements.burntElementID !== -1){

                	g.stroke(.1*star.elements.burntElementID, 1, 1, 1);
				} else {

					star.idColor.stroke(g);
				}
                g.beginShape();
                var t = stellarGame.time.universeTime;

                for (var j = 0; j < layers; j++) {
                    for (var i = 0; i < segments; i++) {
                        theta = (i * 2 * Math.PI) / segments;
                        r = 2 * (1 + utilities.pnoise(theta, t * 2 + j * 100)) + star.radius;
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                }
                g.endShape(g.CLOSE);
            }
        }, {
            name : "collapsing",
            idNumber : 3,
            draw : function(g, star, options) {
                // Draw a spiral
		        g.stroke(1, 0, 1, .8);
				//utilities.debugOutput("collapsing!!!");
		        var streaks = star.radius/3 + 50;
		        var t = stellarGame.time.universeTime;
		        for (var i = 0; i < streaks; i++) {
		            var theta = i * Math.PI * 2 / streaks + .2 * Math.sin(i + t);
		
		            var rPct = ((i * 1.413124 - 1 * 3 * t) % 1 + 1) % 1;
		
		            rPct = Math.pow(rPct, .8);
		            g.strokeWeight(4 * (1 - rPct));
		            star.idColor.stroke(g, 0, -1+star.spiralOpacity);
		            rPct = rPct * 1.6 - .4;
		            var r = star.radius + 10 * Math.sin(i + 4 * t);
		            var rInner = r * utilities.constrain(rPct - .1, 0, 1) + star.radius;
		            var rOuter = r * utilities.constrain(rPct + .1, 0, 1) + star.radius;
		            var spiral = -.06;
		            var cInnerTheta = Math.cos(theta + spiral * rInner);
		            var sInnerTheta = Math.sin(theta + spiral * rInner);
		            var cOuterTheta = Math.cos(theta + spiral * rOuter);
		            var sOuterTheta = Math.sin(theta + spiral * rOuter);
		            g.line(rInner * cInnerTheta, rInner * sInnerTheta, rOuter * cOuterTheta, rOuter * sOuterTheta);
            	}
            }
        }];


        var randomState = function() {
            return states[Math.floor(Math.random() * 2)];
        };

        // Only stars burn dust
        // They burn so long as there is fuel
        var updateDustBurning = function(star) {
        	// Do not burn dust or trigger anything else if the star is collapsing
        	if(star.state !== states[3]){
        		var lastElement = star.elements.burntElementID;
        		
        		star.elements.burnSomeFuel(star.temperature);
            	star.tempGenerated = star.elements.heatGenerated;
            	
            	// If we are not the first element burned (edge case)
            	// And not triggering a supernova for lack of energy (already handled later)...
            	if(lastElement !== -1 && star.elements.burntElementID !== -1){
            		// And we have transitioned to burning a new element...
            		if(lastElement !== star.elements.burntElementID){
            			// take a break from burning elements to collapse slightly with a lifespan
            			// the value there is how much mass of the star to lose in percentage.
            			// SNS.collapse sets the state to states[3]
            			// We can change it based on which element was last burnt!
            			if(star.radius > 50){
            				SNS.collapse(star, 0.6);
            			} else if (star.radius > 20){
	            			SNS.collapse(star, 0.4);
	            		} else {
	            			SNS.collapse(star, 0.2);
	            		}
            		}
            	}
            
	            //utilities.debugOutput("temp: " + star.tempGenerated);
	
	            // If the star is able to burn energy again and is marked as a nova, change it back to a star
	            if (star.tempGenerated > 0 && star.state === states[1]) {
	                reviveStar(star);
	            }
	
	            // If a star is unable to burn energy and is marked as a star, nova it!
	            // TO DO: || star.state === states[3] Add the ability to abort lifespans
	            if (star.tempGenerated <= 0 && (star.state === states[0] || star.state === states[2])) {
	            	star.state = states[1];
	                SNS.explode(star);
	                startBurnLifespan(star, star.elements.totalMass);
	            }
           }

        };


        // When enements are added to a dormant star
        var reviveStar = function(star) {
            star.state = states[2];
        }

        // Dust spirals into the star, star grows into its full size,
        // dust shrinks to nothing, transfers all its elements, and dies
        var startFeedLifespan = function(star, dust) {
            var lifespan = new Lifespan(2);
            var startStarRadius = star.radius;
            var sizeToAdd = calcSizeOfElements(dust.elements.totalMass);
            var radiusToDust = star.position.getDistanceTo(dust.position);
            var curRadiusToDust = radiusToDust;
            var angleToDust = dust.position.getAngleTo(star.position);
            //console.log("DISTANCE/ANGLE: " + radiusToDust + ", " + angleToDust);

            var lifespanUpdate = function() {
                star.radius = startStarRadius + (lifespan.figuredPctCompleted * sizeToAdd);
                //utilities.debugOutput("star radius: " + star.radius);
                curRadiusToDust = radiusToDust * (1 - lifespan.figuredPctCompleted);
                angleToDust += 0.06;
                dust.scale = 1 - lifespan.figuredPctCompleted;
                //console.log("curDIST/ANGLE and SCALE: " + curRadiusToDust + ", " + angleToDust + " | " + dust.scale);
                dust.position.setToPolarOffset(star.position, curRadiusToDust, angleToDust);
            };

            var lifespanOnEnd = function() {
                //console.log("radius at startEND: " + star.radius);
                // transfering all elements should make the dust disappear, the star set to its final size
                dust.elements.transferTo(star.elements, 1);
                //console.log("star should have all dust");
                //console.log("radius at END: " + star.radius);
            };

            var lifespanOnStart = function() {
                //console.log("radius at start: " + startStarRadius);
                //console.log("sizeToAdd: " + sizeToAdd);

            };

            lifespan.onUpdate(lifespanUpdate);
            lifespan.onEnd(lifespanOnEnd);
            lifespan.onStart(lifespanOnStart);

            star.lifespans.push(lifespan);

        };

        // Very quick size down as the dust is expelled
        var startBurnLifespan = function(star, totalMass) {
            var lifespan = new Lifespan(1);
            var startStarRadius = star.radius;
            // sizeToRemove used to be based on the elements
            // That's too uncontrollable, so instead make it a safe minimum
            var sizeToRemove = startStarRadius - (Math.random() * 5 + 1);

            var lifespanUpdate = function() {
                star.radius = startStarRadius - (lifespan.figuredPctCompleted * sizeToRemove);
                //utilities.debugOutput("star radius: " + star.radius);
                //utilities.debugOutput("% figured completed: " + lifespan.figuredPctCompleted);
            };

            var lifespanOnEnd = function() {
                //console.log("radius at END: " + star.radius);
            };

            var lifespanOnStart = function() {
                //console.log("radius at start: " + startStarRadius);
                //console.log("sizeToAdd: " + sizeToRemove);

            };

            lifespan.onUpdate(lifespanUpdate);
            lifespan.onEnd(lifespanOnEnd);
            lifespan.onStart(lifespanOnStart);

            star.lifespans.push(lifespan);

        };

        var calcStarSizeOfElements = function(elementHolder) {
            return calcSizeOfElements(elementHolder.elements.totalMass);
        };

        var calcSizeOfElements = function(amount) {
            return Math.pow(amount, .5);
        }
        var calcStarSizeOfElements = function(elementHolder) {
            return calcSizeOfElements(elementHolder.elements.totalMass);
        };

        var calcSizeOfElements = function(amount) {
            return Math.pow(amount, .5);
        }
        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);

                this.initAsElementContainer();

                this.state = states[2];

                this.radius = calcStarSizeOfElements(this);

                this.initFace();
                this.density = 1.0; // affects how temperature is figured
                this.temperature = this.density * this.elements.totalMass * settings.starTempCalcScaler; //Math.random() * 4000 + 1000;
                //this.burningFuel = true;

                this.acceptsDust = true;
                this.spiralOpacity = 0;

                stellarGame.statistics.numberOfStars++;
                
                this.glow = new Glow(this);
            },

            initFace : function() {
                this.face = new Face.Face(this.idColor, this.idNumber);
            },

            drawBackground : function(g, options) {
                this._super(g, options);
                //this.glow.draw(g);
            },

            drawMain : function(g, options) {
                // Do all the other drawing

                this._super(g, options);

				this.state.draw(g, this, options);
                g.noStroke();
                if (this.deleted) {
                    g.fill(.2, 0, .4);
                    g.stroke(1, 0, 1, .7);
                }

                this.idColor.fill(g);
                g.ellipse(0, 0, this.radius, this.radius);

                if (stellarGame.drawFaces) {

                    this.face.draw(g);

                }

            },

            drawOverlay : function(g, options) {
                this._super(g, options);

            },

            update : function(time) {
                this._super(time);
                
                this.temperature = this.density * this.elements.totalMass * settings.starTempCalcScaler;
                //utilities.debugOutput("star " + this.idNumber + " temp " + this.temperature);
                //this.glow.update(this.radius);
                this.debugOutput(this.state.name);
                this.debugOutput(this.temperature);
                updateDustBurning(this);

                //utilities.debugOutput("radius: " + this.radius);

                //this.radius = calcStarSizeOfElements(this) + this.radiusModifier;

                this.face.update(time, this.radius, this.radius);
            },

            feedDust : function(touch, tool) {
            	
                var newDustObj = new Dust();
                newDustObj.elements.clearAllElements();
                newDustObj.position = new Vector();

                newDustObj.position.setTo(touch.planePosition); // still off, not sure which position to grab
                //console.log("New dust made at " + newDustObj.position + "+++++++++++++ " + this.position);

                tool.elements.transferTo(newDustObj.elements, 1);
                stellarGame.universe.spawn(newDustObj);

                startFeedLifespan(this, newDustObj);
            },
            
            states : states
        });

        return Star;
    })();

});
