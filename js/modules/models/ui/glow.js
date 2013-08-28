/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", "kcolor"], function(Inheritance, Vector, KColor) {
    return (function() {

        var Glow = Class.extend({

            init : function(parent, startSpacing, sizeRestriction, fullSize, notColored) {
				this.parent = parent;
				
				this.depth = 10; // number of circles stacked on each other
				this.baseRadius = parent.radius + startSpacing; // the radius of the smallest circle
				this.radiusModifier = 0; // for pulsing
				this.sizeRestriction = sizeRestriction;
				this.glowScale = this.baseRadius * 1.9 - this.baseRadius; // the radius of the largest circle
				this.glowIntensity = -0.9; // the transparency of each circle
				//console.log("Glow initated: " + this.baseRadius + ", " + this.glowScale);
				this.notColored = notColored
				//if(notColored) this.color = new KColor(.5, 1, 1, 1);
				//else 
				this.startSpacing = startSpacing;
				this.color = parent.idColor.clone();
				this.pulse = false;
				this.inverted = false;
				this.fullSize = fullSize;
            },

            update : function(radius) {
            	if(this.inverted){
            		utilities.debugOutput(this.parent.idNumber);
            	}
				if(radius !== undefined){
					this.baseRadius = radius + this.radiusModifier;
					
					if(this.fullSize){
						this.glowScale = this.parent.radius + this.sizeRestriction;
					} else {
						this.glowScale = this.baseRadius * 1.9 - this.baseRadius;
						if(this.glowScale > this.parent.radius + this.sizeRestriction) this.glowScale = this.parent.radius + this.sizeRestriction;
					
					}
					
					if(radius < 10){
						this.depth = 15;
					} else if (radius < 20) {
						this.depth = 20;
					} else {
						this.depth = 30;
					}

				}
				if(this.pulse){
					if(stellarGame.time.updateCount%10 < 5) this.radiusModifier += .2 + (radius / 100);
					else this.radiusModifier -= .2 + (radius / 100);
				}
            },
            
            draw : function(context) {
            	var g = context.g;
            	var rad = this.baseRadius;
				for(var i = this.depth -1; i >= 0; i--){
					//utilities.debugOutput("Glow: " + rad);
					rad = this.baseRadius + ((i/this.depth) * this.glowScale);
					g.noStroke();
					// i/this.depth gets an inner-fading effect that looks cool
					//g.fill((this.depth-i)/this.depth);
					//this.color.fill(g, (this.depth-i)/this.depth);
					if(this.notColored){
						var bright;
						
						if(!this.inverted) bright = 0.1* i/this.depth;
						else bright = 0.1* (this.depth-i)/this.depth;
						
						g.fill(1, 0, 1, bright);
						//console.log(this.parent.radius + " vs. " + this.glowScale);
					} else {
						if(!this.inverted) this.color.fill(g, i/this.depth, this.glowIntensity);//-i/this.depth * 
						else this.color.fill(g, (this.depth-i)/this.depth, this.glowIntensity);
					}
					
					g.ellipse(0, 0, rad, rad);
				}
            },
            
            
        });

        return Glow;
    })();

});
