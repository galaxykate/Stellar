/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/face", "modules/models/elementSet", "uparticle", particleTypePath + "dust", 'lifespan', "modules/models/ui/glow", particleTypePath + "supernovaStages"], function(Inheritance, Vector, Face, ElementSet, UParticle, Dust, Lifespan, Glow, SNS) {
    return (function() {

        var states = [{
            name : "inactive",
            idNumber : 0,
            update : function(time){
            	
            },
            draw : function(g, star, context) {

            }
        }, {
            name : "degenerate",
            idNumber : 1,
            update : function(star, time){
            	// If I can burn fuel, go do it!
            	if(star.elements.canBurnFuel(star.temperature, time)){
            		star.state = states[2];
            	}
            },
            draw : function(g, star, context) {
                
                // maybe do something else? Dunno...
            }
        }, {
            name : "burning",
            idNumber : 2,
            update : function(star, time){
            	if(star.elements.canBurnFuel(star.temperature, time)){
            		star.elements.burnSomeFuel(star.temperature, time);
            		star.tempGenerated = star.elements.heatGenerated;
            	} else {
            		star.state = states[3];
            		star.densityBurstTimer = 0;
            		SNS.spiralOpacitySpan(star, true, Math.random() + 1.5);
            	}
            },
            draw : function(g, star, context) {
                //utilities.debugOutput(star.idNumber + " burning " + star.elements.burntElementID);
                /*
                var segments = 25;
                var theta;
                var r;
                var layers = 2;
                g.noFill();

                if (star.elements.burntElementID !== undefined && star.elements.burntElementID !== -1) {

                    g.stroke(.1 * star.elements.burntElementID, 1, 1, 1);
                } else {

                    star.idColor.stroke(g);
                }
                g.strokeWeight(2);
                g.beginShape();
                var t = stellarGame.time.universeTime;

                for (var j = 0; j < layers; j++) {
                    for (var i = 0; i < segments; i++) {
                        theta = (i * 2 * Math.PI) / segments;
                        r = 2 * (1 + utilities.pnoise(theta, t * 2 + j * 100)) + star.radius;
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                }
                g.endShape(g.CLOSE);*/
            }
        }, {
            name : "collapsing",
            idNumber : 3,
            updateDensity : function(star, time){
            	star.density += 0.1 * tuning.starCollapseDensityScalar * star.densityBurstTimer;
            	star.densityBurstTimer = 0;
            },
            update : function(star, time){
            	// If I can burn fuel, go do it!
            	if(star.elements.canBurnFuel(star.temperature, time)){
            		star.state = states[2];
            		states[3].updateDensity(star, time);
            		SNS.spiralOpacitySpan(star, false, Math.random() + .5);
            	}
            	if(star.radius > 7){
            		star.radius -= 0.5 * time.ellapsed * tuning.starCollapseRadiusScalar;
            		//console.log(star.radius);
            	} else {
            		star.state = states[4];
            		states[3].updateDensity(star, time);
            		SNS.spiralOpacitySpan(star, false, Math.random() + .5);
            	}
            	// increasing density increases temp, allowing for new fuel to maybe burn
            	//star.density += 0.001 * time.ellapsed;
            	// except that gradually doing it makes it SUCK!
            	star.densityBurstTimer += time.ellapsed;
            	if(star.densityBurstTimer > Math.random() * 3 + 3){
            		states[3].updateDensity(star, time);
            	}
            },
            draw : function(g, star, context) {
                //utilities.debugOutput(star.idNumber + " collapsing");
                // Draw a spiral
                g.stroke(1, 0, 1, .8);
                //utilities.debugOutput("collapsing!!!");
                var streaks = star.radius / 3; //+50
                
                var t = stellarGame.time.universeTime;
                star.idColor.stroke(g, 0, -1 + star.spiralOpacity);
                for (var i = 0; i < streaks; i++) {
                    var theta = i * Math.PI * 2 / streaks + .2 * Math.sin(i + t);
                    var rPct = ((i * 1.413124 - 1 * 3 * t) % 1 + 1) % 1;
                    rPct = Math.pow(rPct, .8);
                    g.strokeWeight(4 * (1 - rPct));
                    
                    rPct = rPct * 1.6 - .4;
                    var r = star.radius + 10 * Math.sin(i + 4 * t);
                    var rInner = r * utilities.constrain(rPct - .1, 0, 1) + star.radius;
                    var rOuter = r * utilities.constrain(rPct + .1, 0, 1) + star.radius;
                    var spiral = -.06;
                    var cInnerTheta = Math.cos(theta + spiral * rInner);
                    var sInnerTheta = Math.sin(theta + spiral * rInner);
                    var cOuterTheta = Math.cos(theta + spiral * rOuter);
                    var sOuterTheta = Math.sin(theta + spiral * rOuter);
                    //console.log(streaks + ", " + i + ", " + rPct + ", " + r + ", " + spiral + ", " + cInnerTheta + ", " + sOuterTheta)
                    g.line(rInner * cInnerTheta, rInner * sInnerTheta, rOuter * cOuterTheta, rOuter * sOuterTheta);
                }
            }
        }, {
            name : "finalCollapse",
            idNumber : 4,
            update : function(star, time){
            	// If I can burn fuel, go do it!
            	if(star.elements.canBurnFuel(star.temperature, time)){
            		star.state = states[2];
            	}
            	
            	SNS.explode(star);
                startBurnLifespan(star, star.elements.totalMass, time);
                star.state = states[1];
            },
            draw : function(g, star, context) {
                //star.glow.draw(context);
            }
        }];

        var randomState = function() {
            return states[Math.floor(Math.random() * 2)];
        };

        // Only stars burn dust
        // They burn so long as there is fuel
        var updateDustBurning = function(star, time) {
        	star.state.update(star, time);
        };

        // When enements are added to a dormant star
        var reviveStar = function(star) {
            star.state = states[2];
        }
        // Dust spirals into the star, star grows into its full size,
        // dust shrinks to nothing, transfers all its elements, and dies
        var startFeedLifespan = function(star, dust) {
            var lifespan = new Lifespan(.02*dust.elements.totalMass); // duration scaled by amount of dust, which will also scale size!
            var startStarRadius = star.radius;
            var sizeToAdd = calcSizeOfElements(dust.elements.totalMass);
            var radiusToDust = star.position.getDistanceTo(dust.position);
            var curRadiusToDust = radiusToDust;
            var angleToDust = dust.position.getAngleTo(star.position);
            //console.log("DISTANCE/ANGLE: " + radiusToDust + ", " + angleToDust);

            var lifespanUpdate = function() {
            	star.radius += 0.01;
            	dust.elements.transferTo(star.elements, 0.1);
                //star.radius = startStarRadius + (lifespan.figuredPctCompleted * sizeToAdd);
                
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
        var startBurnLifespan = function(star, totalMass, time) {
            var lifespan = new Lifespan(Math.random() + .1);
            var startStarRadius = star.radius;
            // sizeToRemove used to be based on the elements
            // That's too uncontrollable, so instead make it a safe minimum
            var sizeToRemove = startStarRadius - (Math.random() * 5 + 1);

            var lifespanUpdate = function() {
                //star.radius = startStarRadius - (lifespan.figuredPctCompleted * sizeToRemove);
                
                star.radius -= 3 * time.ellapsed * tuning.starCollapseRadiusScalar
                //utilities.debugOutput("star radius: " + star.radius);
                //utilities.debugOutput("% figured completed: " + lifespan.figuredPctCompleted);
                //SNS.generateSomeSparkles(star, 3);
                //if (star.state !== star.states[4])
                //    lifespan.abort();
            };

            var lifespanOnEnd = function() {
                //console.log("radius at END: " + star.radius);
                //star.state = states[1];

                // Kinda makes things lag.... probably want to tone it down?
                //SNS.generateSomeSparkles(star, Math.random() * 5 + 5);
                star.glow.pulse = false;
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
                this.name = UParticle.generateName();

                this.initAsElementContainer();

                this.state = states[2];

                this.radius = calcStarSizeOfElements(this);

                this.initFace();
                this.density = 1.0;
                // affects how temperature is figured
                this.temperature = this.density * this.elements.totalMass * tuning.starTempCalcScaler;
                //Math.random() * 4000 + 1000;
                //this.burningFuel = true;

                this.acceptsDust = true;
                this.spiralOpacity = 0;
                
            	this.densityBurstTimer = 0;

                stellarGame.statistics.numberOfStars++;

                this.glow = new Glow(this, 1, 20);
                this.selection = new Glow(this, 1, 20, true, true);
                this.selection.inverted = true;
            },

            initFace : function() {
                this.face = new Face.Face(this.idColor, this.idNumber);
            },

            drawBackground : function(context) {
                this._super(context);
                this.glow.draw(context);
                if(this.hover) this.selection.draw(context);
                this.hover = false;
            },

            drawMain : function(context) {
                this._super(context);
                var g = context.g;
                // Do all the other drawing

                this.state.draw(g, this, context);

                g.noStroke();
                if (this.deleted) {
                    g.fill(.2, 0, .4);
                    g.stroke(1, 0, 1, .7);
                }

                this.idColor.fill(g);
                g.ellipse(0, 0, this.radius, this.radius);
                this.elements.drawAsSlice(g, this.radius);

                if (stellarGame.drawFaces) {

                    this.face.draw(g);

                }

                // Not sure why you deleted this, Kate!!
                //if (stellarGame.drawElements && this.elements) {
                //	this.elements.draw(g, this.radius);
                //}

            },

            drawOverlay : function(context) {
                this._super(context);
                var g = context.g;
                if (stellarGame.options.showStarNames) {
                    g.fill(1);
                    g.text(this.name, 0, context.distanceScale * this.radius + 10);
                }

                if (context.mode.index < 2) {
                    if (this.elements) {
                        this.elements.draw(context.g, this.radius);
                    }
                }
                
                
            },

            updateStarEvolution : function(time) {
                updateDustBurning(this, time);
            },

            beginUpdate : function(time) {
                this._super(time);
                //utilities.debugOutput(this.idNumber+ " UPDATING!!!");

                this.temperature = this.density * this.elements.totalMass * tuning.starTempCalcScaler;
                //utilities.debugOutput("star " + this.idNumber + " temp " + this.temperature);
                this.glow.update(this.radius);
                this.debugOutput(this.state.name);
                this.debugOutput(this.radius);
                this.debugOutput(this.temperature);
                this.debugOutput(this.elements.burning);
                this.debugOutput(this.elements.heatGenerated);
                this.debugOutput(this.elements.burntElementID);

                //utilities.debugOutput("radius: " + this.radius);

                //this.radius = calcStarSizeOfElements(this) + this.radiusModifier;

                this.face.update(time, this.radius, this.radius);
                if(this.hover) this.selection.update(this.radius);
            },

            // Add temperature (or subtract it) from this star
            addTemperature : function(amt) {
                this.temperature += amt / this.elements.totalMass;
                console.log("Temperature of " + this.name + " now " + this.temperature);
                // Do something here
            },

            // Add pressure (or subtract it) from this star
            addPressure : function(amt) {
                // Do something here
                console.log("Pressure of " + this.name + " now " + this.pressure);
            },

            feedDust : function(touch, tool) {

                var newDustObj = new Dust();
                newDustObj.elements.clearAllElements();
                newDustObj.position = new Vector();

                newDustObj.position.setTo(touch.planePosition);
                // still off, not sure which position to grab
                //console.log("New dust made at " + newDustObj.position + "+++++++++++++ " + this.position);

                tool.elements.transferTo(newDustObj.elements, 1);
                stellarGame.universe.spawn(newDustObj);

                startFeedLifespan(this, newDustObj);

            },

            //states : states
        });
        Star.states = states;

        return Star;
    })();

});
