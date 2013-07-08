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
                this.values = [];
                this.values["happy"] = Math.random();
                this.values["sad"] = Math.random();
                this.values["angry"] = Math.random();
                this.values["fear"] = Math.random();
                this.values["disgust"] = Math.random();
                this.values["surprise"] = Math.random();
                				
				this.radius = newRad;
				this.locVector = new Vector(0, 0);
            },
            
            drawBackground: function(g, options) {
            	var angle = -Math.PI/2;
            	g.noStroke();
            	// Happy is golden yellow
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(50/360, 1, this.values.happy, this.values.happy);
            	this.locVector.drawCircle(g, 10);
            	// Sad is ice blue
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(209/360, 1, this.values.sad, this.values.sad);
            	this.locVector.drawCircle(g, 10);
            	// angry is blood red
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(1, 1, this.values.angry, this.values.angry);
            	this.locVector.drawCircle(g, 10);
            	// Fear is purple
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(269/360, 1, this.values.fear, this.values.fear);
            	this.locVector.drawCircle(g, 10);
            	// Disgust is green
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(110/360, 1, this.values.disgust, this.values.disgust);
            	this.locVector.drawCircle(g, 10);
            	// Surprise is orange
            	angle += Math.PI/3;
            	this.locVector.setToPolar(this.radius, angle);
            	g.fill(33/360, 1, this.values.surprise, this.values.surprise);
            	this.locVector.drawCircle(g, 10);
            	
            	console.log("emotion draw background: true!");
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

            },
            
            getRankedEmotionName : function(rank){
            	// sort by value and return the id ("happy", "sad", etc)
            	
            },
            
            getRankedEmotionValue : function(rank) {
            	// sort by value and return the value (0-1)
            },
            
            
            setEmotion : function(name, value) {
            	// find emotions with id of name ("happy", "sad", etc) and set its value (0-1)
            	this.values[name] = value;
            }, 
            
            setNeutral : function() {
            	// sets all emotions to 0
            	this.values.happy = 0;
            	this.values.sad = 0;
            	this.values.angry = 0;
            	this.values.fear = 0;
            	this.values.disgust = 0;
            	this.values.surprise = 0;
            }, 
            
            setRandomEmotionHigh : function() {
            	// Picks a random emotion to set to 1.
            	var choice = Math.floor(Math.random() * 6);
            	switch(choice) {
            		case 0:
            			this.values.happy = 1;
            			break;
            		case 1:
            			this.values.sad = 1;
            			break;
            		case 2:
            			this.values.angry = 1;
            			break;
            		case 3:
            			this.values.fear = 1;
            			break;
            		case 4:
            			this.values.disgust = 1;
            			break;
            		case 5:
            			this.values.surprise = 1;
            			break;
            		default:
            			this.values.surprise = 1;
            			break;
            	}
            }
        });

        return {
            // public interface
            Emotion : Emotion,
            
        };
    })();

});
