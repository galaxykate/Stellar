/**
 * @author April Grow
 */

// The facial expression on top of stars

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {

        // Private functions
        
        // functions from Kate's example
        
        // EYE -- move to its own class
        var innerPct = .24;
        var outerPct = .73;
		var cheekHeight = 50;
		var cheekWidth = 200;
		var cheekCurve = 90;
		
		var inner, outer;
		var innerLowerTheta, outerLowerTheta;
        var innerLift, outerLift;
	    var innerUpperTheta, outerUpperTheta;
	    var innerLowerSlant, outerLowerSlant;
	    var innerUpperSlant, outerUpperSlant;
	    
	    var eyeLine, eyeCenter, eyeFocus;
	    
	    var myg = null;
	    var updated = false;
		
        function testDraw(g, faceWidth, faceHeight) {
            //var h = (.212 + .6) % 1;
            myg = g;
            g.noStroke();
            g.fill(0.621, .1, 1);
            g.ellipse(0, 0, faceWidth, faceHeight);
			if (updated) {
				
			}
        };
        
        function drawEyeBall(g){
        	g.noStroke();
        	g.fill(0);
        	var radius = 40;
        	var layers = 5;
        	for(var i = 0; i <= layers; i++){
        		var pct = i*1/layers;
        		var r = radius * g.pow(1-pct, .3);
        		eyeColor
        	}
        }
        // JANK JANK JANK FIX ME!
        function updateEye(time){
        	if(myg !== null){
        		updated = true;
	        	inner = new Vector.Vector(innerPct*cheekWidth, 15);
	            outer = new Vector.Vector(outerPct*cheekWidth, 6);
	        	innerLowerTheta = -.1 - 3.5*(-.5 + myg.noise(200 + time));
	            outerLowerTheta = -.4 + Math.PI + -1.5*(-.5 + myg.noise(time));
	            innerLift = 1.2*Math.abs(Math.sin(50*myg.noise(.2*time + 150)));
	    		outerLift = innerLift;
	    		innerUpperTheta = innerLowerTheta + -1.6*innerLift;
	    		outerUpperTheta = outerLowerTheta + 1.6*outerLift;
	    		innerUpperTheta = constrain(innerUpperTheta, -Math.PI/2, Math.PI/2);
	    		
	    		innerLowerSlant.setToPolar(40, innerLowerTheta);
	    		outerLowerSlant.setToPolar(30, outerLowerTheta);
	    		innerUpperSlant.setToPolar(30+15*innerLift, innerUpperTheta);
	    		outerUpperSlant.setToPolar(20+15*outerLift, outerUpperTheta);
    		}
        }
        
        function constrain(val, lowerBound, upperBound){
        	if(Math.max(val, upperBound) === val)
        		val = upperBound;
        	if(Math.min(val, lowerBound) === val)
        		val = lowerBound;
        };

        // Make the Face class
        var Face = Class.extend({
            init : function() {
            	// Any defaults we need
            	innerLowerSlant = new Vector.Vector();
            	outerLowerSlant = new Vector.Vector();
            	innerUpperSlant = new Vector.Vector();
            	outerUpperSlant = new Vector.Vector();
            	
            },

            update : function(time) {
				// blink, change facial expression
				updateEye(time);
            },

            draw : testDraw,
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
