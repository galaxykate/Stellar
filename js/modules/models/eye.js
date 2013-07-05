/**
 * @author April Grow
 */

// EYE!

define(["inheritance", "modules/models/vector", "noise"], function(Inheritance, Vector, Noise) {
    return (function() {
        var cheekWidth2;

        function drawBrowShape(g) {
            g.noStroke();

            this.starColor.fill(g, -.2, 1);
            g.beginShape();
            //console.log("Lower Slants: " + this.innerLowerSlant + " //// " + this.outerLowerSlant);
            drawLashLine(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);
            drawCrease(g, -3.4, this);
            g.endShape();

            this.starColor.fill(g, -.5, 1);
            g.beginShape();
            //console.log("Lower Slants: " + this.innerLowerSlant + " //// " + this.outerLowerSlant);
            drawLashLine(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);
            drawCrease(g, -2, this);
            g.endShape();

        };

        // Private functions
        function testDraw(g) {

            drawBrowShape.call(this, g);

            //console.log("testdraw " + this.cheekWidth); // all the same
            g.noStroke();
            g.fill(1);
            var w = this.outer.x - this.inner.y;
            g.ellipse(this.eyeCenter.x, this.eyeCenter.y, w * 1.1, w * .70);

            // Eyeball
            g.pushMatrix();
            this.eyePos.translateTo(g);
            // had an aditional parameter: false. Probably for 3D
            drawEyeBall(g, this);
            g.popMatrix();

            // Lower Lid
            // head.skinColor.setFill(g, -.3, 1);
            //g.fill(this.starColor, 1, 1);
            //utilities.debugOutput("drawing eye: " + this.starColor + ", in star: " + this.starID);
            //g.fill(this.starColor, 1, 1);
            this.starColor.fill(g);
            g.noStroke();
            g.beginShape();
            //console.log("Lower Slants: " + this.innerLowerSlant + " //// " + this.outerLowerSlant);
            drawLashLine(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);
            drawCrease(g, 1.4, this);
            g.endShape();

            //g.fill(this.starColor, 1, .5);
            this.starColor.fill(g);
            // Upper Lid
            g.beginShape();
            drawLashLine(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
            drawCrease(g, -1.8, this);
            g.endShape();

            // Lower lash
            //g.stroke(0.3, 1, 1);
            g.stroke(0);
            g.strokeWeight(1);
            g.noFill();
            g.beginShape();
            //console.log("LashLine: " + this.innerUpperSlant + " //// " + this.outerUpperSlant);
            //
            //drawLashLine(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);
            g.endShape();

            g.beginShape();
            drawLashLine(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
            g.endShape();

            //drawLashControlPoints(g, this.innerUpperSlant, this.outerUpperSlant, 1, this);
            //drawLashControlPoints(g, this.innerLowerSlant, this.outerLowerSlant, 1, this);

            //g.fill(.4, 1, 1);
            //g.noStroke();
            //this.innerUpperSlant.drawCircle(g, 5);
            //this.innerUpperSlant.drawLineTo(g, this.inner);

        };

        function drawEyeBall(g, eyeClass) {
            // var eyeColor = new KColor.KColor(.55, 1, 1);
            g.noStroke();
            g.fill(0);
            var layers = 5;
            var radius = eyeClass.eyeBallRadius;
            for (var i = 0; i <= layers; i++) {
                var pct = i * 1 / layers;
                var r = radius * g.pow(1 - pct, .3);
                //eyeColor.setFill(g, -1+ .7*pct, 1);
                g.fill(.55, 1, 1);
                g.ellipse(0, 0, r, r);
            }

            g.fill(0);
            g.ellipse(0, 0, radius * .7, radius * .7);

            g.fill(1, 0, 1, .2);
            g.ellipse(radius * .03, -radius * .1, radius * .4, radius * .3);
            g.fill(1, 0, 1, .4);
            g.ellipse(radius * .1, -radius * .2, radius * .3, radius * .2);
            g.fill(1);
            g.ellipse(radius * .1, -radius * .2, radius * .1, radius * .1);
        }

        function drawLashLine(g, innerSlant, outerSlant, controlStretch, eyeClass) {
            eyeClass.inner.vertex(g, false);
            eyeClass.outer.bezierWithRelativeControlPoints(g, eyeClass.inner, innerSlant, outerSlant);
        }

        function drawCrease(g, creaseDir, eyeClass) {
            eyeClass.outer.vertex(g, false);
            var creaseScalar = eyeClass.cheekWidth * .25;
            eyeClass.inner.bezierWithRelativeControlPoints(g, eyeClass.outer, new Vector(0, creaseScalar * creaseDir), new Vector(0, creaseScalar * creaseDir))
        }

        function drawLashControlPoints(g, innerSlant, outerSlant, controlStretch, eyeClass) {
            g.fill(1);
            g.noStroke();

            eyeClass.inner.drawCircle(g, 2);
            var test = new Vector(innerSlant.x, innerSlant.y);
            test.add(eyeClass.inner);
            test.drawCircle(g, 2);
            eyeClass.inner.drawLineTo(g, false, test);
        }

        function updateEye(time, width, height, eyeFocusVector) {
            this.cheekWidth = width;
            //console.log("this.cheekWidth = width " + this.cheekWidth + " /// " + cheekWidth2);
            // gives proper cheekWidth
            this.cheekHeight = height;
            this.eyeBallRadius = this.cheekWidth * .2;

            //var innerScale = this.cheekWidth * 0.3; // mustache eyelids
            //var outerScale = this.cheekWidth * 0.6;
            var innerScale = this.cheekWidth * 0.06;
            var outerScale = this.cheekWidth * 0.03;
            this.inner = new Vector(this.innerPct * this.cheekWidth, innerScale);
            this.outer = new Vector(this.outerPct * this.cheekWidth, outerScale);

            this.innerLowerTheta = -1 + 2.5 * utilities.pnoise(.5 * time.total + 400 + this.starID);
            this.outerLowerTheta = -.1 + 2.5 * utilities.pnoise(.5 * time.total + 500 + this.starID);

            var liftScale = this.cheekWidth * .25;
            
            var blink = utilities.sCurve(utilities.pnoise(time.total*.2  + 10*this.starID), 4);
            blink = Math.max(0, (Math.abs(2*blink - 1))*1.4 - .4);
            this.innerLift = 2*blink;
            this.outerLift = this.innerLift;
            this.innerUpperTheta = this.innerLowerTheta + -.6 * this.innerLift;
            this.outerUpperTheta = this.outerLowerTheta + 1.6 * this.outerLift;

            this.innerUpperTheta = utilities.constrain(this.innerUpperTheta, -Math.PI / 2, Math.PI / 2);

            //this.innerUpperTheta = -Math.PI/2;

            var innerLowerSlantScale = this.cheekWidth * .2;
            // default : .2
            var outerLowerSlantScale = this.cheekWidth * .15;
            // default: .15
            var innerUpperSlantScale = outerLowerSlantScale;
            // default: same as outerLowerSlantScale
            var outerUpperSlantScale = this.cheekWidth * .1;
            // default: .1
            var additionalUpperSlantScale = this.cheekWidth * 0.075;

            this.innerLowerSlant.setToPolar(innerLowerSlantScale, this.innerLowerTheta);
            this.outerLowerSlant.setToPolar(outerLowerSlantScale, this.outerLowerTheta);
            this.innerUpperSlant.setToPolar(innerUpperSlantScale + additionalUpperSlantScale * this.innerLift, this.innerUpperTheta);
            this.outerUpperSlant.setToPolar(outerUpperSlantScale + additionalUpperSlantScale * this.outerLift, this.outerUpperTheta);

            this.eyeLine = new Vector(this.outer.x, this.outer.y);
            //console.log("1 eyeLine: " + this.eyeLine);
            this.eyeLine.sub(this.inner);
            //console.log("2 eyeLine: " + this.eyeLine);
            this.eyeCenter = this.inner.lerp(this.outer, .5);
            this.eyeFocus = eyeFocusVector;
            this.eyePos = this.inner.lerp(this.outer, .1 + 0.9 * this.eyeFocus.x);
            this.eyePos.x = utilities.constrain(this.eyePos.x, (this.inner.x + this.eyeBallRadius), (this.outer.x - this.eyeBallRadius));
            var eyeOffsetScalar = this.cheekWidth * 0.025;
            this.eyePos.y -= eyeOffsetScalar;


        }

        // Make the Face class
        var Eye = Class.extend({
            init : function(hue, id) {
                // functions from Kate's example
                this.innerPct = -.42;
                // .52 used to be on a 0 - 1 scale
                this.outerPct = .40;
                // .46 now is on a -1 to 1 scale (centered on 0!)
                this.cheekHeight = 50;
                // irrelevant
                this.cheekWidth = 200;
                // overriden by the size of the star
                this.cheekCurve = 90;
                // what is this for? 90 degrees?
                this.eyeBallRadius = 0;

                // "inner" is the inner eye corner vector location
                this.inner = new Vector();
                // "outer" is the outer eye corner vector location
                this.outer = new Vector();
                this.innerLowerTheta = 0;
                this.outerLowerTheta = 0;
                this.innerLift = 0;
                this.outerLift = 0;
                this.innerUpperTheta = 0;
                this.outerUpperTheta = 0;

                // Point is outside the two eyes, way off the face, slightly elevated
                // Doesn't seem in line with eyeballs, eye corners, or anything else.
                this.eyeLine = new Vector();
                // Proper center of the eye. Halfway between the inner/outer points
                this.eyeCenter = new Vector();
                // Appears to be right in the center of the eye =/
                this.eyeFocus = new Vector(0, 0);
                // Center of the eyeball
                this.eyePos = new Vector();

                // The position of the inner lower lid control point.
                this.innerLowerSlant = new Vector();
                // The position of the outer lower lid control point.
                this.outerLowerSlant = new Vector();
                // The position of the inner Upper lid control point.
                this.innerUpperSlant = new Vector();
                // The position of the outer upper lid control point.
                this.outerUpperSlant = new Vector();

                this.starColor = hue;

                this.noise = new Noise();

                // debug info for eyes
                this.starID = id;
                
                //console.log("setting star hue in eye: " + hue);
                //console.log("setting star id in eye: " + id);

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
