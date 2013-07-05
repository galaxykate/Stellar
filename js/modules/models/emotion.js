/**
 * @author April Grow
 */

// Spacey whaaaaaales

define(["inheritance", "modules/models/vector", "modules/models/uparticle"], function(Inheritance, Vector, UParticle) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Emotion = UParticle.extend({

            init : function(universe, newRad) {
                this._super(universe);
                
                // If all of these are zero, neutral takes over
                // No emotion cancels or precludes another
				this.happy = Math.random();
				this.sad = Math.random();
				this.angry = Math.random();
				this.fear = Math.random();
				this.disgust = Math.random();
				this.surprise = Math.random();
				
				this.radius = newRad;
				this.locVector = new Vector(0, 0);
            },
            
            drawBackground: function(g, options) {
            	var angle = -Math.PI/2;
            	g.noStroke();
            	// Happy is golden yellow
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(50/360, 1, this.happy, this.happy);
            	this.locVector.drawCircle(g, 10);
            	// Sad is ice blue
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(209/360, 1, this.sad, this.sad);
            	this.locVector.drawCircle(g, 10);
            	// angry is blood red
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(1, 1, this.angry, this.angry);
            	this.locVector.drawCircle(g, 10);
            	// Fear is purple
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(269/360, 1, this.fear, this.fear);
            	this.locVector.drawCircle(g, 10);
            	// Disgust is green
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(110/360, 1, this.disgust, this.disgust);
            	this.locVector.drawCircle(g, 10);
            	// Surprise is orange
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(33/360, 1, this.surprise, this.surprise);
            	this.locVector.drawCircle(g, 10);
            },
            
            drawMain : function(g, options) {
            	if(stellarGame.drawEmotions){
            		
                }
            },
            
            drawOverlay : function(g, options) {
            	if(stellarGame.drawEmotions){
            	}
            }, 
            
            update : function(time) {
                //this._super(time);

            }
        });

        return {
            // public interface
            Emotion : Emotion,
            
        };
    })();

});
