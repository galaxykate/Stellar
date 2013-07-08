/**
 * @author April Grow
 */

// Spacey whaaaaaales

define(["inheritance", "modules/models/vector", "uparticle"], function(Inheritance, Vector, UParticle) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Critter = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.frontAngle = 0;
                this.backAngle = this.frontAngle - Math.PI;
                this.tailVector = new Vector(0, 0);
                this.numSegments = Math.floor(Math.random() * 5) + 4;
                this.tailSegments = [];
                for ( i = 0; i < this.numSegments; i++) {
                    var vect = new Vector(0, 0);
                    this.tailSegments.push(vect);
                }
                this.tailShrinkScale = .4 + .4 * Math.random();
            },

            drawBackground : function(g, options) {
                if (stellarGame.drawCritters) {
                    this.idColor.fill(g, -.2, 0);

                    this.tailVector.setTo(0, 0);
                    var previousSize = this.radius;

                    for (var i = 0; i < this.numSegments; i++) {
                        //var tailWiggle = Math.sin(stellarGame.time.total + i*this.tailShrinkScale)/4

                        //utilities.debugOutput(this.idNumber + ": " + this.backAngle * tailWiggle);
                        //this.tailVector.addPolar(previousSize, this.backAngle /** tailWiggle*/);
                        previousSize = previousSize * this.tailShrinkScale;
                        //this.tailVector.drawCircle(g, previousSize);
                        this.tailSegments[i].drawCircle(g, previousSize);

                    }

                    this.idColor.fill(g, 0, 0);
                    g.noStroke();
                    g.ellipse(0, 0, this.radius, this.radius);

                }
            },

            drawMain : function(g, options) {
                if (stellarGame.drawCritters) {
                    /*
                     this.idColor.fill(g, 1, 1);
                     var faceVector = new Vector(0, 0);
                     faceVector.addPolar(this.radius, this.frontAngle);
                     faceVector.drawCircle(g, 6);

                     this.idColor.fill(g, 1, .5);
                     var tailVector = new Vector(0, 0);
                     tailVector.addPolar(this.radius, this.backAngle);
                     tailVector.drawCircle(g, 4);
                     */

                }
            },

            drawOverlay : function(g, options) {
                if (stellarGame.drawCritters) {
                }
            },

            update : function(time) {
                //this._super(time);
                this.frontAngle = utilities.pnoise(0.1 * time.total + (100 * this.idNumber)) * Math.PI * 2;

                //console.log("num segments: " + this.numSegments);
                this.backAngle = this.frontAngle - Math.PI;
                this.tailSegments[0].setToPolar(this.radius, this.backAngle);

                for (var i = 1; i < this.numSegments; i++) {
                    //console.log(i + ": " + this.tailSegments[i]);
                    //this.tailSegments[i].setTo(this.tailSegments[i-1].x, this.tailSegments[i-1].y);
                    var connectSpot = new Vector(this.tailSegments[i - 1].x, this.tailSegments[i - 1].y);
                    connectSpot.addPolar(this.radius / (i + 1) * 2, this.backAngle);
                    this.tailSegments[i] = this.tailSegments[i].lerp(connectSpot, .1);
                    /*
                     if(this.idNumber == 22){
                     utilities.debugOutput(i + ": " + this.tailSegments[i]);
                     utilities.debugOutput(this.tailSegments[i-1]);
                     }*/
                }

                //utilities.debugOutput(this.idNumber + ": " + this.frontAngle + " /// " + this.backAngle);

                //this.totalForce.setToMultiple(this.position, 0);
                this.totalForce.addPolar(.1, this.frontAngle);
                this.velocity.setToPolar(10, this.frontAngle);
                this.position.addMultiple(this.velocity, time.ellapsed);
            }
        });

        return Critter;
    })();

});
