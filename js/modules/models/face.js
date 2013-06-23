/**
 * @author April Grow
 */

// The facial expression on top of stars

define(["inheritance", "modules/models/vector", "modules/models/eye"], function(Inheritance, Vector, Eye) {
    return (function() {

        // Private functions
        // functions from Kate's example
        
        // EYE -- move to its own class
		
        function drawFace(g) {
            //var h = (.212 + .6) % 1;
            g.noStroke();
            g.fill(0.621, .1, 1);
            g.ellipse(0, 0, this.faceWidth, this.faceHeight);
            
            //console.log(faceWidth/2);
            this.centerEye.draw(g);
        };
        
        function drawHalfFace(g, leftFace){
        	
        }
        
        
        function updateFace(time, width, height, faceClass){
        	faceClass.centerEye.update(time, width/2, height/2);
        }
        
        

        // Make the Face class
        var Face = Class.extend({
            init : function() {
            	// Any defaults we need
            	this.centerEye = new Eye.Eye();
            },

            update : function(time, width, height) {
				// blink, change facial expression
				this.faceWidth = width;
				this.faceHeight = height;
				this.eyeRadius = width/2;
				
				updateFace(time, this.faceWidth, this.faceHeight, this);
            },

            draw : drawFace,
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
