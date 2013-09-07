/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", "kcolor"], function(Inheritance, Vector, KColor) {
    return (function() {

        var Glow = Class.extend({

            init : function(parent) {
				this.parent = parent;
				
				this.depth = 10; // number of circles stacked on each other
				this.baseRadius = parent.radius * 1.05; // the radius of the smallest circle
				this.radiusModifier = 0; // for pulsing
				this.glowScale = this.baseRadius * 1.9 - this.baseRadius; // the radius of the largest circle
				this.glowIntensity = 0.1; // the transparency of each circle
				//console.log("Glow initated: " + this.baseRadius + ", " + this.glowScale);
				this.color = parent.idColor.clone();
				this.pulse = false;
            },

            update : function(radius) {
				if(radius !== undefined){
					this.baseRadius = radius + this.radiusModifier;
					if(radius < 10){
						this.depth = 10;
					} else if (radius < 20) {
						this.depth = 20;
					} else {
						this.depth = 30;
					}
					this.glowScale = this.baseRadius * 1.9 - this.baseRadius;
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
					rad = this.baseRadius + ((i/this.depth) * this.glowScale);
					g.noStroke();
					// i/this.depth gets an inner-fading effect that looks cool
					//g.fill((this.depth-i)/this.depth);
					//this.color.fill(g, (this.depth-i)/this.depth);
					this.color.fill(g, i/this.depth, -i/this.depth);
					g.ellipse(0, 0, rad, rad);
				}
            },
            
            
        });

        return Glow;
    })();

});
