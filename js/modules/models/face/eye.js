/**
 * @author April Grow
 */

// EYE!

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    var noise;

    // Make the Face class
    var Eye = Class.extend({
        init : function(face, name, side) {
            var eye = this;
            this.side = side;
            this.face = face;
            this.name = name;
            this.blink = 0;
            this.id = face.id;
            this.eyeRadius = this.face.width * .4;

            this.position = new Vector(face.radius * face.eyeWidth * side.xMult, face.radius * face.eyeHeight);

            this.tilt = -.08;

            // "inner" is the inner eye corner vector location
            this.innerVertex = new Vector();
            // "outer" is the outer eye corner vector location
            this.outerVertex = new Vector();

            var animSpeed = .3;

            this.lowerLashLine = this.createCurveLine({
                name : "lowerLash",
                idNumber : 10,
                arch : 1,
                inner : {
                    baseTheta : eye.tilt - .8,
                    thetaRange : 1.5,
                    updateControl : function(time) {
                        this.thetaPct = noise(animSpeed * time + this.idNumber);
                    }
                },
                outer : {
                    baseTheta : eye.tilt + Math.PI + .8,
                    thetaRange : -1.5,
                    updateControl : function(time) {
                        this.thetaPct = noise(animSpeed * time + this.idNumber * 100);
                    }
                }
            });

            var maxOpen = 1;

            this.upperLashLine = this.createCurveLine({
                name : "upperLash",
                idNumber : 10,
                arch : -1,
                inner : {
                    baseTheta : 0,
                    thetaRange : -1.5,
                    updateControl : function(time) {
                        this.baseTheta = eye.lowerLashLine.inner.controlTheta;
                        this.thetaRange = -.9;
                        this.thetaPct = eye.blink;
                        // this.thetaRange = -.5;

                    }
                },
                outer : {
                    baseTheta : eye.tilt + Math.PI,
                    thetaRange : 1.5,
                    updateControl : function(time) {
                        this.baseTheta = eye.lowerLashLine.outer.controlTheta;
                        this.thetaRange = .9;
                        this.thetaPct = eye.blink;
                        // this.thetaRange = -.5;
                    }
                }
            });

        },

        drawIris : function(g) {
            var radius = this.eyeRadius * .6;
            // var eyeColor = new KColor.KColor(.55, 1, 1);
            g.noStroke();
            g.fill(0);
            var layers = 5;

            for (var i = 0; i <= layers; i++) {
                var pct = i * 1 / layers;
                var r = radius * g.pow(1 - pct, .3);
                //eyeColor.setFill(g, -1+ .7*pct, 1);
                g.fill(.55, 1, 1);
                g.ellipse(0, 0, r, r);
            }

            g.fill(0);
            g.ellipse(0, 0, radius * .7, radius * .7);

            // Draw the highlight
            this.drawHighlights = true;
            if (this.drawHighlights) {
                g.fill(1, 0, 1, .2);
                g.ellipse(radius * .03, -radius * .1, radius * .4, radius * .3);
                g.fill(1, 0, 1, .4);
                g.ellipse(radius * .1, -radius * .2, radius * .3, radius * .2);
                g.fill(1);
                g.ellipse(radius * .1, -radius * .2, radius * .1, radius * .1);
            }
        },

        update : function(time, eyeFocusVector) {
            var eye = this;
            this.tilt = .12 * Math.sin(.3 * time) + -.1;
            this.blink = Math.abs(Math.sin(time));

         
            // Set the inner and outer points
            this.innerVertex.setToPolar(this.eyeRadius, this.tilt + Math.PI);
            this.outerVertex.setToPolar(this.eyeRadius, this.tilt);
         
            this.lowerLashLine.update(time);
            this.upperLashLine.update(time);

            this.eyeLine = new Vector(this.outerVertex);
            this.eyeLine.sub(this.innerVertex);
            this.eyeCenter = this.innerVertex.lerp(this.outerVertex, .5);
       
            this.eyeFocus = eyeFocusVector;

        },

        // Private functions
        draw : function(g) {

            var eye = this;

            var faceColor = this.face.baseColor;
            // this.drawBrowShape(g);

            // translate to the position
            g.pushMatrix();
            this.position.translateTo(g);
            g.scale(this.side.xMult, 1);

            // Draw the white of the eyes
            g.noStroke();
            g.fill(1);
            g.ellipse(0, 0, this.eyeRadius, this.eyeRadius);

            // Iris
            this.drawIris(g);

            // Draw upper lower lash line
            faceColor.fill(g, .5, 0);
            g.noStroke();
            this.upperLashLine.draw(g);
            var faceColor = eye.face.baseColor;
            faceColor.fill(g, .0, 0);

            this.lowerLashLine.draw(g);

            g.popMatrix();
        },

        //=========================================
        // Create lash lines utilities

        // A control point has a vertex, base theta (the lowest angle)
        //  and a theta range (the biggest possible change in angle)
        createControlPoint : function(vertex, options) {
            var eye = this;
            if (options.updateControl === undefined) {
                options.updateControl = function(time) {

                    this.thetaPct = noise(0 + time + this.idNumber);
                };
            }

            var cp = {
                name : options.name,
                idNumber : options.idNumber,
                vertex : vertex,
                controlRadius : eye.eyeRadius * 1,
                controlTheta : 0,
                controlVertex : new Vector(0, 0),
                baseTheta : options.baseTheta,
                thetaRange : options.thetaRange,
                thetaPct : 0,

                drawPoints : function(g) {

                    this.controlVertex.drawCircle(g, 5);
                    this.vertex.drawCircle(g, 8);

                },

                // Update the control points
                updateControl : options.updateControl,

                update : function(time) {

                    // Set the radius and theta
                    this.updateControl(time);

                    this.controlTheta = this.baseTheta + this.thetaRange * this.thetaPct;

                    this.controlVertex.setToPolarOffset(this.vertex, this.controlRadius, this.controlTheta);

                }
            };

            return cp;
        },

        // Make an object for a lash line
        // This contains an inner and outer pointt, and each of those has a control point with a range of motion
        createCurveLine : function(options) {
            var eye = this;

            // Construct this object

            // Set the inner/outer names and idNumbers to be driven by the line's settings
            options.inner.name = "inner" + options.name;
            options.outer.name = "outer" + options.name;
            options.inner.idNumber = 1 + options.idNumber;
            options.outer.idNumber = 2 + options.idNumber;

            var curveLine = {
                idNumber : options.idNumber,
                name : options.name,
                arch : options.arch,
                inner : eye.createControlPoint(eye.innerVertex, options.inner),
                outer : eye.createControlPoint(eye.outerVertex, options.outer),

                draw : function(g) {

                    // Draw the outermost arch
                    var archRadius = eye.eyeRadius * 1.8;
                    var top0 = Vector.polar(archRadius, -Math.PI / 2 + -1.6 + eye.tilt + -.5 * Math.PI * this.arch);
                    var top1 = Vector.polar(archRadius, -Math.PI / 2 + 1.6 + eye.tilt + .5 * Math.PI * this.arch);
                    top0.add(this.outer.vertex);
                    top1.add(this.inner.vertex);

                    // Draw the lash curve
                    g.beginShape();
                    this.inner.vertex.vertex(g);
                    this.outer.vertex.bezier(g, this.inner.controlVertex, this.outer.controlVertex);

                    this.inner.vertex.bezier(g, top0, top1);

                    var drawDebugPoints = true;
                    if (drawDebugPoints) {
                        // Draw debug for the arch
                        g.endShape();
                        g.fill(.4, 1, 1);
                        top0.drawCircle(g, 2);
                        top1.drawCircle(g, 2);

                    //    this.drawPoints(g);
                    }
                },
                drawPoints : function(g) {
                    g.stroke(0);
                    g.fill(.3, 1, 1);
                    this.inner.drawPoints(g);
                    g.fill(.9, 1, 1);
                    this.outer.drawPoints(g);
                    g.noStroke();
                },

                update : function(time) {
                    if (noise === undefined) {
                        noise = utilities.pnoise;
                    }
                    this.inner.update(time);
                    this.outer.update(time);
                },
            };

            return curveLine;
        },
    });

    return Eye;

});
