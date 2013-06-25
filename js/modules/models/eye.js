/**
 * @author April Grow
 */

// EYE!

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {
    	var cheekWidth2;

        // Private functions
        function testDraw(g) {
			//console.log("testdraw " + this.cheekWidth); // all the same
            g.noStroke();
            g.fill(1);
            var w = this.outer.x - this.inner.y;
            g.ellipse(this.eyeCenter.x, this.eyeCenter.y, w*.65, w*.65);
            
            // Eyeball
            g.pushMatrix();
            //this.eyePos.translateTo(g, false);
            drawEyeBall(g, this);
            g.popMatrix();
            
            // Lower Lid
            // head.skinColor.setFill(g, -.3, 1);
            g.fill(this.starHue, 1, 1);
            g.noStroke();
            /*
            g.beginShape();
            console.log("Lower Slants: " + this.innerLowerSlant + " //// " + this.outerLowerSlant);
            drawLashLine(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);
            drawCrease(g, 1, this);
            g.endShape();
            */
            /*
            // Upper Lid
            g.beginShape();
            drawLashLine(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
            drawCrease(g, -1.4, this);
            g.endShape();
     		*/
     		// Lower lash
     		g.stroke(0.3, 1, 1);
     		g.noFill();
     		g.beginShape();
     		//console.log("LashLine: " + this.innerUpperSlant + " //// " + this.outerUpperSlant);
            
     		drawLashLine(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
     		g.endShape();
     		
     		drawLashControlPoints(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
            
        };
        
        function drawEyeBall(g, eyeClass){
        	// var eyeColor = new KColor.KColor(.55, 1, 1);
        	g.noStroke();
        	g.fill(0);
        	var layers = 5;
        	var eyeScale = eyeClass.cheekWidth * 0.2;
        	var radius = eyeScale;
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
        
        function drawLashLine(g, innerSlant, outerSlant, controlStretch, eyeClass){
        	eyeClass.inner.vertex(g, false);
        	eyeClass.outer.bezierWithRelativeControlPoints(g, eyeClass.inner, innerSlant, outerSlant);
        }
        
        function drawCrease(g, creaseDir, eyeClass) {
        	eyeClass.outer.vertex(g, false);
        	eyeClass.inner.bezierWithRelativeControlPoints(g, eyeClass.outer, 
        													new Vector.Vector(0, 50*creaseDir), 
        													new Vector.Vector(0, 50*creaseDir))
        }
        
        function drawLashControlPoints(g, innerSlant, outerSlant, controlStretch, eyeClass){
        	g.fill(1);
        	g.noStroke();
        	
        	eyeClass.inner.drawCircle(g, 2);
        	var test = new Vector.Vector(innerSlant.x, innerSlant.y);
        	test.add(eyeClass.inner);
        	test.drawCircle(g, 2);
        	eyeClass.inner.drawLineTo(g, false, test);
        }

        function updateEye(time, width, height){
        	this.cheekWidth = width;
        	//console.log("this.cheekWidth = width " + this.cheekWidth + " /// " + cheekWidth2);
        	// gives proper cheekWidth
        	this.cheekHeight = height;
        	
        	var innerScale = this.cheekWidth * 0.03;
        	var outerScale = this.cheekWidth * 0.06;
        	this.inner = new Vector.Vector(this.innerPct*this.cheekWidth, innerScale);
            this.outer = new Vector.Vector(this.outerPct*this.cheekWidth, outerScale);
            
            //console.log("1 Inner, outer: " + this.inner + " /// " + this.outer);
            //console.log("using cheekWidth " + this.cheekWidth); // gives proper cheekWidth
        	this.innerLowerTheta = -.1 - 3.5*(-.5); //+ Processing.noise(200 + time));
            this.outerLowerTheta = -.4 + Math.PI + -1.5*(-.5); // + Processing.noise(time));
            var liftScale = this.cheekWidth * .25;
            this.innerLift = 1.2*Math.abs(Math.sin(liftScale)); //*Processing.noise(.2*time + 150)));
    		this.outerLift = this.innerLift;
    		this.innerUpperTheta = this.innerLowerTheta + -1.6*this.innerLift;
    		this.outerUpperTheta = this.outerLowerTheta + 1.6*this.outerLift;
    		this.innerUpperTheta = utilities.constrain(this.innerUpperTheta, -Math.PI/2, Math.PI/2);
    		
    		var innerLowerSlantScale = this.cheekWidth * .2;
    		var outerLowerSlantScale = this.cheekWidth * .15;
    		var innerUpperSlantScale = outerLowerSlantScale;
    		var outerUpperSlantScale = this.cheekWidth * .1;
    		var additionalUpperSlantScale = this.cheekWidth * 0.075;
    		
    		this.innerLowerSlant.setToPolar(innerLowerSlantScale, this.innerLowerTheta);
    		this.outerLowerSlant.setToPolar(outerLowerSlantScale, this.outerLowerTheta);
    		this.innerUpperSlant.setToPolar(innerUpperSlantScale+additionalUpperSlantScale*this.innerLift, this.innerUpperTheta);
    		this.outerUpperSlant.setToPolar(outerUpperSlantScale+additionalUpperSlantScale*this.outerLift, this.outerUpperTheta);
    		
    		this.eyeLine = new Vector.Vector(this.outer.x, this.outer.y);
    		//console.log("1 eyeLine: " + this.eyeLine);
    		this.eyeLine.sub(this.inner);
    		//console.log("2 eyeLine: " + this.eyeLine);
    		this.eyeCenter = this.inner.lerp(this.outer, .5);
    		this.eyePos = this.inner.lerp(this.outer, .05 + .9 * this.eyeFocus.x);
    		this.eyePos.y -= 5;
    		
    		//console.log("2 Inner, outer: " + this.inner + " /// " + this.outer);
    		//console.log("eyeCenter: " + this.eyeCenter);
    		//console.log("eyePosition: " + this.eyePos);
        }
        
        

        // Make the Face class
        var Eye = Class.extend({
            init : function(hue) {
            	// functions from Kate's example
		        this.innerPct = -.52; // used to be on a 0 - 1 scale
		        this.outerPct = .46; // now is on a -1 to 1 scale (centered on 0!)
				this.cheekHeight = 50;
				this.cheekWidth = 200;
				this.cheekCurve = 90; // what is this for? 90 degrees?
				
				this.inner = new Vector.Vector();
				this.outer = new Vector.Vector();
				this.innerLowerTheta = 0;
				this.outerLowerTheta = 0;
		        this.innerLift = 0;
				this.outerLift = 0;
			    this.innerUpperTheta = 0;
				this.outerUpperTheta = 0;
			    
			    this.eyeLine = new Vector.Vector();
				this.eyeCenter = new Vector.Vector();
				this.eyeFocus = new Vector.Vector(0, 0);
				this.eyePos = new Vector.Vector();
				
            	this.innerLowerSlant = new Vector.Vector();
            	this.outerLowerSlant = new Vector.Vector();
            	this.innerUpperSlant = new Vector.Vector();
            	this.outerUpperSlant = new Vector.Vector();
            	
            	this.starHue = hue;
            },

            update : updateEye,

            draw : testDraw,
        });

        return {
            // public interface
            Eye : Eye,

        };
    })();

});
