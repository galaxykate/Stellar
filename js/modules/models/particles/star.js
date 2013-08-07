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
            if (star.tempGenerated > 0 && star.state === states[1]) {
                reviveStar(star);
            }

            // If a star is unable to burn energy and is marked as a star, nova it!
            if (star.tempGenerated <= 0 && star.state === states[0]) {
                triggerSupernova(star);
            }

        };

        var updateInternalForces = function(star, burnedEnergy) {
            star.internalGravity = 100 * star.mass;
            star.outwardForce = 100 * burnedEnergy;

        };

        // When enements are added to a dormant star
        var reviveStar = function(star) {
            star.state = states[0];
        }
        var DUSTEXPLOSIONVELOCITY = 600;

        // When a star runs out of elements
        var triggerSupernova = function(star) {

            star.state = states[1];

            var elemsToShed = star.elements.calcShedElements(1, .5, .5);
            var numDustToSpawn = Math.ceil(Math.random() * 5) + 2;
            for (var j = 0; j < elemsToShed.length; j++) {
                elemsToShed[j] = elemsToShed[j] / numDustToSpawn;
            }

            for (var i = 0; i < numDustToSpawn; i++) {
                // spawn a new dust
                var newDustObj = new Dust();
                // give it elemsToShed/numDustToSpawn of each element
                newDustObj.elements.clearAllElements();
                star.elements.transferAmountsTo(newDustObj.elements, elemsToShed);
                // place it at the center of the star
                newDustObj.position = star.position.clone();
                // give it a velocity directly away from the star
                newDustObj.velocity.setTo(Math.random() * DUSTEXPLOSIONVELOCITY - (DUSTEXPLOSIONVELOCITY / 2), Math.random() * DUSTEXPLOSIONVELOCITY - (DUSTEXPLOSIONVELOCITY / 2));
                stellarGame.universe.spawn(newDustObj);
            }

            star.burningFuel = false;
            startBurnLifespan(star, star.elements.totalMass);

            var lifespanOnStart = function() {
                //star.lifespans.push(star.lifespan);
                //console.log("starting lifespan!");
            };

            star.lifespan.onUpdate(lifespanUpdate);
            // Repeating loop?! Hope it doesn't break!
            star.lifespan.onEnd(lifespanOnEnd);
            star.lifespan.onStart(lifespanOnStart);

            star.lifespans.push(star.lifespan);

        };

        var calcStarSizeOfElements = function(star) {
            return Math.pow(star.elements.totalMass, .5);
        };

        // Dust spirals into the star, star grows into its full size,
        // dust shrinks to nothing, transfers all its elements, and dies
        var startFeedLifespan = function(star, dust) {
            var lifespan = new Lifespan(2);
            var startStarRadius = star.radius;
            var sizeToAdd = calcSizeOfElements(dust.elements.totalMass);
            var radiusToDust = star.position.getDistanceTo(dust.position);
            var angleToDust = star.position.getAngleTo(dust.position);
            console.log("DISTANCE/ANGLE: " + radiusToDust + ", " + angleToDust);

            var lifespanUpdate = function() {
                star.radius = startStarRadius + (lifespan.figuredPctCompleted * sizeToAdd);
                utilities.debugOutput("star radius: " + star.radius);
            };

            var lifespanOnEnd = function() {
                console.log("radius at startEND: " + star.radius);
                // transfering all elements should make the dust disappear, the star set to its final size
                dust.elements.transferTo(star.elements, 1);
                console.log("star should have all dust");
                console.log("radius at END: " + star.radius);
            };

            var lifespanOnStart = function() {
                console.log("radius at start: " + startStarRadius);
                console.log("sizeToAdd: " + sizeToAdd);

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
            var sizeToRemove = calcSizeOfElements(totalMass);

            var lifespanUpdate = function() {
                star.radius = startStarRadius - (lifespan.figuredPctCompleted * sizeToRemove);
                utilities.debugOutput("star radius: " + star.radius);
            };

            var lifespanOnEnd = function() {
                console.log("radius at END: " + star.radius);
            };

            var lifespanOnStart = function() {
                console.log("radius at start: " + startStarRadius);
                console.log("sizeToAdd: " + sizeToRemove);

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
        // Make the star class
        //  Extend the star
        var Star = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.initAsElementContainer();

                this.state = states[0];
                // turning off random states
                this.radius = calcStarSizeOfElements(this);

                this.initFace();
                this.temperature = Math.random() * 4000 + 1000;
                //console.log("star " + this.idNumber + " temp: " + this.temperature);
                this.burningFuel = true;

                // internal gravity will be a function of mass
                this.internalGravity
                // outwardForce will be a function of the reactions
                this.outwardForce

                this.acceptsDust = true;

                this.radiusModifier = 0;

                stellarGame.statistics.numberOfStars++;
            },

            initFace : function() {
                this.face = new Face.Face(this.idColor, this.idNumber);
            },

            drawBackground : function(g, options) {
                this._super(g, options);
            },

            drawMain : function(g, options) {
                // Do all the other drawing

                this._super(g, options);
                this.idColor.fill(g, (Math.sin(stellarGame.time.universeTime + this.temperature)) / 4 - .25);
                g.noStroke();
                if (this.deleted) {
                    g.fill(.2, 0, .4);
                    g.stroke(1, 0, 1, .7);
                }

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
                newDustObj.position.setTo(touch.toWorldPosition(touch.currentPosition));
                console.log("New dust made at " + newDustObj.position + "+++++++++++++ " + this.position);

                tool.elements.transferTo(newDustObj.elements, 1);
                stellarGame.universe.spawn(newDustObj);

                startFeedLifespan(this, newDustObj);

            }
        });

        return Star;
    })();

});
