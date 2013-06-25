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
            g.pushMatrix();
            drawHalfFace(g, false, this);
            g.popMatrix();
            g.pushMatrix();
            g.scale(-1, 1);
            drawHalfFace(g, true, this);
            g.popMatrix();
            
            //this.centerEye.draw(g);
        };
        
        function drawHalfFace(g, leftFace, faceClass){
        	g.pushMatrix();
        	//g.translate(0, faceClass.faceWidth/4);
        	g.translate(faceClass.faceWidth/2, 0);
        	//console.log("translating...? " + faceClass.faceWidth/4)
        	if(leftFace)
        		faceClass.leftEye.draw(g);
        	else
        		faceClass.rightEye.draw(g);
        	g.popMatrix();
        	
        	//console.log("drawing (left)face: " + leftFace);
        }
        
        
        function updateFace(time, faceClass){
        	faceClass.centerEye.update(time, faceClass.eyeRadius, faceClass.eyeRadius);
        	
        	faceClass.rightEye.update(time, faceClass.eyeRadius, faceClass.eyeRadius);
        	faceClass.leftEye.update(time, faceClass.eyeRadius, faceClass.eyeRadius);
        }
        
        

        // Make the Face class
        var Face = Class.extend({
            init : function(hue) {
            	// Any defaults we need
            	this.centerEye = new Eye.Eye(hue);
            	this.rightEye = new Eye.Eye(hue);
            	this.leftEye = new Eye.Eye(hue);
            	//console.log("setting star hue in face: " + hue);
            	this.starHue = hue;
            },

            update : function(time, width, height) {
				// blink, change facial expression
				this.faceWidth = width;
				this.faceHeight = height;
				this.eyeRadius = width;
				
				updateFace(time, this);
            },

            draw : drawFace,
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
