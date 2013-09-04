/**
 * @author April Grow
 */

// Spacey whaaaaaales

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/face", "modules/models/emotion"], function(Inheritance, Vector, UParticle, Face, Emotion) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Critter = UParticle.extend({

            init : function(universe) {
                this._super(universe);
				this.frontAngle = 0;
				this.backAngle = this.frontAngle - Math.PI;
				this.tailVector = new Vector(0, 0);
				this.numSegments = Math.floor(Math.random()*5) + 4;
				this.tailSegments = [];
				for(i = 0; i < this.numSegments; i++){
					var vect = new Vector(0, 0);
					//console.log("Setting up vector: " + vect);
					this.tailSegments.push(vect);
				}
				this.tailShrinkScale = .4 + .4 * Math.random();
				//console.log("init critter " + this.idNumber + ": " + this.numSegments);
				this.face = new Face.Face(this.idColor, this.idNumber);
				
				this.emotion = new Emotion.Emotion(universe, this.radius + 20);
				stellarGame.statistics.numberOfCritters++;
				//console.log("Initing critter: " + this.idNumber);
            },
            
            drawBackground: function(context) {
            	if(stellarGame.options.drawCritters){
            		var g = context.g;
					this.idColor.fill(g, -.2, 0);
	                
	                this.tailVector.setTo(0,0);
	                var previousSize = this.radius;
	                
	                
	                for(var i = 0; i < this.numSegments; i++){
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
	                
	                //this.emotion.drawBackground(g, options);
					
					//console.log("critter draw bg: true!");
            	}
            },
            
            drawMain : function(context) {
            	utilities.debugOutput("drawing critter " + this.idNumber);
            	if(stellarGame.options.drawCritters){
            		var g = context.g;
            		//console.log("critter draw main: true!");

	                g.pushMatrix();
	                g.rotate(this.frontAngle);
	                
	                //this.face.draw(g);
	                this.face.drawRightProfile(g);
	                g.popMatrix();
	                
	                //this.emotion.drawMain(g, options);
                }
            },
            
            drawOverlay : function(context) {
            	if(stellarGame.options.drawCritters){
            		this._super(context);
            		//console.log("critter draw overlay: true!");
            		//this.emotion.drawOverlay(g, options);
            		this.drawDebug(context.g);
            	}
            }, 
            
            drawDebug : function(g){
            	g.stroke(1);
            	g.strokeWeight(1);
            	g.noFill();
            	var center = new Vector();
            	var frontVector = new Vector();
            	frontVector.setToPolar(10, this.frontAngle);
				frontVector.drawCircle(g, 2);
				
				g.stroke(.8, .8, 1);
				center.drawLineTo(g, this.velocity);
				
            },
            
            beginUpdate : function(time) {
                this._super(time);
                this.frontAngle = 0;//utilities.pnoise(0.1*time.total + (100*this.idNumber))*Math.PI*2;
                
                //console.log("num segments: " + this.numSegments);
                this.backAngle = this.frontAngle - Math.PI;
                this.tailSegments[0].setToPolar(this.radius, this.backAngle); 
                
                
                for(var i = 1; i < this.numSegments; i++) {
                	//console.log(i + ": " + this.tailSegments[i]);
	            	//this.tailSegments[i].setTo(this.tailSegments[i-1].x, this.tailSegments[i-1].y);
	            	var connectSpot = new Vector(this.tailSegments[i-1].x, this.tailSegments[i-1].y);
	            	connectSpot.addPolar(this.radius/(i+1)*2, this.backAngle);
	            	this.tailSegments[i] = this.tailSegments[i].lerp(connectSpot, .1);
	            }
	            
	            
                
                //utilities.debugOutput(this.idNumber + ": " + this.frontAngle + " /// " + this.backAngle);
                
                // This velocity calculation makes the critters constantly 'fall' and I don't know why.
                //this.velocity.setToPolar(10, this.frontAngle);
                //this.position.addMultiple(this.velocity, time.ellapsed);
                
                this.face.update(time, this.radius, this.radius);
                
                this.emotion.update(time);
                
        		this.debugOutput(this.velocity);
        		this.debugOutput(this.position);
            }
        });

        return Critter;
    })();

});
