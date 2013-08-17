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
				this.glowScale = this.baseRadius * 1.9 - this.baseRadius; // the radius of the largest circle
				this.glowIntensity = 0.1; // the transparency of each circle
				//console.log("Glow initated: " + this.baseRadius + ", " + this.glowScale);
				this.color = new KColor();
            },

            update : function(radius) {
				if(radius !== undefined){
					this.baseRadius = radius;
					this.glowScale = this.baseRadius * 1.9 - this.baseRadius;
				}
            },
            
            draw : function(g) {
            	var rad = this.baseRadius;
				for(var i = this.depth -1; i >= 0; i--){
					//utilities.debugOutput("Glow: " + rad);
					rad = this.baseRadius + ((i/this.depth) * this.glowScale);
					g.noStroke();
					// i/this.depth gets an inner-fading effect that looks cool
					g.fill((this.depth-i)/this.depth);
					g.ellipse(0, 0, rad, rad);
				}
            },
            
            
        });

        return Glow;
    })();

});
