/**
 * @author April Grow
 */

// Spacey whaaaaaales

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/face", "modules/models/emotion", "modules/models/ui/glow"], function(Inheritance, Vector, UParticle, Face, Emotion, Glow) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Critter = UParticle.extend({

            init : function(universe) {
                this._super(universe);
                this.name = "Critter" + this.idNumber;
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
				
				this.pickupable = true;
				this.held = false;
				this.homeStar = undefined;
				this.quest = undefined;
				this.processing = undefined;
				this.type = "critter";
				
				this.selection = new Glow(this, 1, 20, true, true);
            },
            
            drawBackground: function(context) {
            	if(stellarGame.options.drawCritters){
            		var g = context.g;
            		if(this.hover) this.selection.draw(context);
	                this.hover = false;
            		
            		if(this.pickupable && !this.held && this.homeStar === undefined){
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
            	}
            },
            
            drawMain : function(context) {
            	//utilities.debugOutput("drawing critter " + this.idNumber);
            	if(stellarGame.options.drawCritters){
            		var g = context.g;
            		//console.log("critter draw main: true!");
					if(this.pickupable && !this.held && this.homeStar === undefined){
		                g.pushMatrix();
		                g.rotate(this.frontAngle);
		                
		                //this.face.draw(g);
		                this.face.drawRightProfile(g);
		                g.popMatrix();
		                
	                //this.emotion.drawMain(g, options);
	                }
	                
	                if(this.held){
	                	
	                }
                }
            },
            
            drawOverlay : function(context) {
            	if(stellarGame.options.drawCritters){
            		if(this.pickupable && !this.held && this.homeStar === undefined){
	            		this._super(context);
	            		//console.log("critter draw overlay: true!");
	            		//this.emotion.drawOverlay(g, options);
	            		this.drawDebug(context.g);
            		}
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
                
                this.backAngle = this.frontAngle - Math.PI;
                this.tailSegments[0].setToPolar(this.radius, this.backAngle); 
                
                
                for(var i = 1; i < this.numSegments; i++) {
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
                if(this.hover) this.selection.update(this.radius);
                
                this.emotion.update(time);
                
        		this.debugOutput(this.velocity);
        		this.debugOutput(this.position);
            },
            
            pickUp : function(contents) {
            	this.pickupable = false;
            	this.held = true;
            	
            	if(this.critterDivID === undefined){
	            	this.parentDivID = contents.critterHolderID;
	            	this.critterDivID = contents.critterHolderID + "_" + this.idNumber;
	            	this.createSpanForCritter(contents);
            	} else {
            		var span = $("#" + this.critterDivID);
            		span.show();
            		this.processing.updating = true;
            	}
            },
            
            
            putDownOnStar : function(inventory, star) {
            	console.log("HAHAHAHA PUTTING DOWN THE CRITTER NOW!")
            },
            
            putDownInUniverse : function(inventory, touch) {
            	console.log("PUT DOWN IN UNIVERSE " + touch.planePosition);
            	this.pickupable = true;
            	this.held = false;
            	touch.planePosition.cloneInto(this.position);
            	inventory.setNullDivID();
            	
            	this.turnOffInventory();
            },
            
            turnOffInventory : function() {
            	this.processing.updating = false;
            	var span = $("#" + this.critterDivID);
            	span.hide();
            },
            
            createSpanForCritter : function(popupContents){
            	var critter = this;
            	critter.contents = popupContents;
            
	            var newCanvas = 
				    $('<canvas/>',{'id':critter.critterDivID + "_canvas"})
				    .width(20)
				    .height(20);
				//console.log(newCanvas);
				
	
	            var options = {
	                "class" : "elementCanvasHolder",
	                "id" : critter.critterDivID,
	
	                // ========= controller stuff ===========
	                mousedown : function() {
						
	                },
	                mouseup : function() {
	                    critter.contents.setNewSelectedDivID(critter.critterDivID, critter);
	                },
	                mouseleave : function() {
	                    
	                },
	                mouseenter : function() {
	                    
	                }
	            };
	
	            var span = $('<span/>', options);
	            span.css({
                    opacity : .2
                });
	            span.append(newCanvas);
	
	            var parent = $("#" + critter.parentDivID);
	            parent.append(span);
				
				var processing = new Processing(critter.critterDivID + "_canvas", function(g) {
	
	                g.size(30, 30);
	                g.colorMode(g.HSB, 1);
	                g.idColor = critter.idColor;
	                g.tailSegments = critter.tailSegments;
	                g.radius = critter.radius;
	                g.numSegments = critter.numSegments;
	                g.tailShrinkScale = critter.tailShrinkScale;
	                g.time = 0;
	                g.updating = true;
	                
	                g.draw = function() {
	                	if(g.updating){
		                	g.background(1, 0, .7, .3);
		                	g.time++;
		                	
		                	/* update */
		                	g.pushMatrix();
		                	g.translate(15, 15);
		                	var frontAngle = g.time/20; // increment it based on time
		                	var backAngle = frontAngle - Math.PI;
			                g.tailSegments[0].setToPolar(g.radius/2, backAngle); 
			                
			                for(var i = 1; i < g.numSegments; i++) {
			                	var connectSpot = new Vector(g.tailSegments[i-1].x, g.tailSegments[i-1].y);
			                	connectSpot.addPolar(g.radius/(i+1)*.8, backAngle);
				            	g.tailSegments[i] = g.tailSegments[i].lerp(connectSpot, .6);
				            }
			                
			                /* draw */
			                g.idColor.fill(g, -.2, 0);
			                
			                var previousSize = g.radius;
							
			                for(var i = 0; i < g.numSegments; i++){
			                	previousSize = previousSize * g.tailShrinkScale;
			                	//if(g.time <= 20) console.log(i + " t " + g.tailSegments[i]);
			                	g.tailSegments[i].drawCircle(g, previousSize);
			                	
			                }
							g.idColor.fill(g, 0, 0);
			                g.noStroke();
			                
			                g.ellipse(0, 0, this.radius, this.radius);
			                g.popMatrix();
		                }
	                };
	
				});
				this.processing = processing;
            },
            
            drawInInventory : function() {
            	//var div =
            	utilities.debugOutput("Critter in " + this.critterDivID);
            },
        });

        return Critter;
    })();

});
