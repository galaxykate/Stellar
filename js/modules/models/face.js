/**
 * @author April Grow
 */

// The facial expression on top of stars

define(["inheritance", "modules/models/vector", "processing"], function(Inheritance, Vector, Processing) {
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
		
        function testDraw(g, faceWidth, faceHeight) {
            //var h = (.212 + .6) % 1;
            g.noStroke();
            g.fill(0.621, .1, 1);
            g.ellipse(0, 0, faceWidth, faceHeight);
            
            g.noStroke();
            g.fill(1);
            var w = outer.x - inner.y;
            drawEyeBall(g);
        };
        
        function drawEyeBall(g){
        	// var eyeColor = new KColor.KColor(.55, 1, 1);
        	g.noStroke();
        	g.fill(0);
        	var radius = 40;
        	var layers = 5;
        	for(var i = 0; i <= layers; i++){
        		var pct = i*1/layers;
        		var r = radius * g.pow(1-pct, .3);
        		//eyeColor.setFill(g, -1+ .7*pct, 1);
        		g.fill(.55, 1, 1);
        		g.ellipse(0, 0, r, r);
        	}
        	
        	g.fill(0);
		    g.ellipse(0, 0, radius*.7, radius*.7);
		
		    g.fill(1, 0, 1, .2);
		    g.ellipse(radius*.03, -radius*.1, radius*.4, radius*.3);
		    g.fill(1, 0, 1, .4);
		    g.ellipse(radius*.1, -radius*.2, radius*.3, radius*.2);
		    g.fill(1);
		    g.ellipse(radius*.1, -radius*.2, radius*.1, radius*.1);
        }
        // JANK JANK JANK FIX ME! -- noise and color
        function updateEye(time){
        	inner = new Vector.Vector(innerPct*cheekWidth, 15);
            outer = new Vector.Vector(outerPct*cheekWidth, 6);
        	innerLowerTheta = -.1 - 3.5*(-.5); //+ Processing.noise(200 + time));
            outerLowerTheta = -.4 + Math.PI + -1.5*(-.5); // + Processing.noise(time));
            innerLift = 1.2*Math.abs(Math.sin(50)); //*Processing.noise(.2*time + 150)));
    		outerLift = innerLift;
    		innerUpperTheta = innerLowerTheta + -1.6*innerLift;
    		outerUpperTheta = outerLowerTheta + 1.6*outerLift;
    		innerUpperTheta = utilities.constrain(innerUpperTheta, -Math.PI/2, Math.PI/2);
    		
    		innerLowerSlant.setToPolar(40, innerLowerTheta);
    		outerLowerSlant.setToPolar(30, outerLowerTheta);
    		innerUpperSlant.setToPolar(30+15*innerLift, innerUpperTheta);
    		outerUpperSlant.setToPolar(20+15*outerLift, outerUpperTheta);
    		
    		eyeLine = outer.sub(inner);
    		//eyeCenter = 
        }
        
        

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
