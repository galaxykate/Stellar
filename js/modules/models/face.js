/**
 * @author April Grow
 */

// The facial expression on top of stars

define(["inheritance", "modules/models/vector", "modules/models/eye"], function(Inheritance, Vector, Eye) {
    return (function() {

        // Private functions
        // functions from Kate's example

        function drawRightProfile(g) {
        	g.pushMatrix();
        	g.scale(-1, 1);
        	g.scale(.8, .9); // Make the eye slightly smaller so that it appears to have been shortened a bit by the profile view
        	g.translate(-1* this.faceWidth / 1.5, 0);
        	this.rightEye.draw(g);
        	g.popMatrix();
        }

        function drawFace(g) {

            g.pushMatrix();
            drawHalfFace(g, false, this);
            g.popMatrix();
            g.pushMatrix();
            g.scale(-1, 1);
            drawHalfFace(g, true, this);
            g.popMatrix();

        };

        function drawHalfFace(g, leftFace, faceClass) {
            g.pushMatrix();
            //g.translate(0, faceClass.faceWidth/4);
            g.translate(faceClass.faceWidth / 1.9, 0);
            //console.log("translating...? " + faceClass.faceWidth/4)
            if (leftFace)
                faceClass.leftEye.draw(g);
            else
                faceClass.rightEye.draw(g);
            g.popMatrix();

        }

        function updateFace(time, faceClass) {
            faceClass.narrowing = .6 + .3 * utilities.pnoise(.3 * time.total + 100 * (faceClass.starID + 1));
            faceClass.focus.x = utilities.pnoise(.5 * time.total + 1000 * (faceClass.starID + 1));
            faceClass.focus.y = utilities.pnoise(.5 * time.total + 600 * (faceClass.starID + 1));

            var rightTargetVector = new Vector((1 - faceClass.focus.x) * faceClass.narrowing, (1 - faceClass.focus.y) * faceClass.narrowing);
            var leftTargetVector = new Vector(faceClass.focus.x * faceClass.narrowing, faceClass.focus.y * faceClass.narrowing);

            faceClass.rightEye.update(time, faceClass.eyeRadius, faceClass.eyeRadius, rightTargetVector);
            faceClass.leftEye.update(time, faceClass.eyeRadius, faceClass.eyeRadius, leftTargetVector);
        }

        // Make the Face class
        var Face = Class.extend({
            init : function(hue, id) {
                // Any defaults we need
                this.starID = id;
                this.rightEye = new Eye.Eye(hue, id);
                this.leftEye = new Eye.Eye(hue, id);
                //console.log("setting star hue in face: " + hue);
                //console.log("setting star id in face: " + id);
                this.starHue = hue;

                this.focus = new Vector(0, 0);
                this.narrowing = 0;
            },

            update : function(time, width, height) {
                // blink, change facial expression
                this.faceWidth = width;
                this.faceHeight = height;
                this.eyeRadius = width;

                updateFace(time, this);
            },

            draw : drawFace,
            
            drawRightProfile: drawRightProfile,
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
