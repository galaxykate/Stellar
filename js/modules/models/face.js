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
            /* // background debug circle to show the size of the face
            g.noStroke();
            g.fill(0.621, .1, 1);
            g.ellipse(0, 0, this.faceWidth, this.faceHeight);
            */
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

            var rightTargetVector = new Vector.Vector((1 - faceClass.focus.x) * faceClass.narrowing, (1 - faceClass.focus.y) * faceClass.narrowing);
            var leftTargetVector = new Vector.Vector(faceClass.focus.x * faceClass.narrowing, faceClass.focus.y * faceClass.narrowing);
            /*
             if(faceClass.starID === 1){
             utilities.debugOutput("time: " + time.total);
             utilities.debugOutput("narrowing: " + faceClass.narrowing);
             utilities.debugOutput("focus: " + faceClass.focus);
             utilities.debugOutput("right target Vector: " + rightTargetVector);
             utilities.debugOutput("left target Vector: " + leftTargetVector);
             }*/

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
                this.starHue = hue;

                this.focus = new Vector.Vector(0, 0);
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
        });

        return {
            // public interface
            Face : Face,

        };
    })();

});
