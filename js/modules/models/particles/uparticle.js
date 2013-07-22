/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "noise", "kcolor"], function(Inheritance, Vector, ElementSet, Noise, KColor) {
    return (function() {

        var noise = new Noise();

        // Private functions
        var particleCount = 0;

        // Make the star class
        var UParticle = Class.extend({
            init : function() {
                this.idNumber = particleCount;
                particleCount++;
                this.idColor = new KColor((this.idNumber * .289 + .31) % 1, 1, 1);
                this.age = {
                    birth : stellarGame.time.universeTime,
                };

                this.setRadius(10);

                this.initAsParticle();

                this.position.setToPolar(Math.random() * 200 + 100, Math.random() * 100);

                this.velocity.addPolar(Math.random() * .3, Math.random() * 100);

                this.initAsElementContainer();

                this.initAsTouchable();
                this.debugOutputLines = [];

                // For ranges of surface temperatuers, visit https://en.wikipedia.org/wiki/Stellar_classification

                this.temperature = 0;
                // Kelvin
                this.tempGenerated = 100;
                // Kelvin

            },

            setRadius : function(r) {
                this.radius = r;
            },

            initialUpdate : function() {

            },

            remove : function() {
                this.deleted = true;
            },

            debugOutput : function(d) {

                this.debugOutputLines.push(d);

            },
            clearDebugOutput : function() {
                this.debugOutputLines = [];
            },

            // Update this particle according to physics
            beginUpdate : function(time) {
                this.totalForce.mult(0);

            },

            addForces : function(time) {
                var noiseScale = .0040;
                var nx = this.position.x * noiseScale;
                var ny = this.position.y * noiseScale;
                var t = time.total * .03;
                var theta = 20 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = this.mass * 60;

                this.totalForce.addPolar(r, theta);
            },

            updatePosition : function(time) {
                var t = time.ellapsed;
                this.velocity.addMultiple(this.totalForce, t);
                this.position.addMultiple(this.velocity, t);
            },

            finishUpdate : function(time) {
                this.velocity.mult(this.drag);

            },

            update : function(time) {
                // Clear the output
                var t = time.ellapsed;
                if (this.lastUpdate === undefined) {
                    this.lastUpdate = 0;
                    this.initialUpdate();
                }

                this.clearDebugOutput();

                var d = this.position.magnitude();

                if (d === 0 || d === NaN)
                    d = .001;

                var outside = Math.max(0, d - 200);
                var gravity = -Math.pow(outside, 2) / d;
                // this.totalForce.setToMultiple(this.position, gravity);

                var noiseScale = .0040;
                var nx = this.position.x * noiseScale;
                var ny = this.position.y * noiseScale;
                var t = time.total * .1;
                var ellapsed = time.ellapsed;
                var theta = 16 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = 190;
                // this.totalForce.addPolar(r, theta);

                this.velocity.addMultiple(this.totalForce, ellapsed);
                this.position.addMultiple(this.velocity, ellapsed);
                this.velocity.mult(this.drag);

                //DEBUG CHECKING
                if (this.DEBUGPOSITION) {
                    utilities.debugOutput(this.idNumber + "pos: " + this.position);
                }
                if (this.DEBUGVELOCITY) {
                    utilities.debugOutput(this.idNumber + "vel: " + this.velocity);

                }

                this.updateElements();

                //console.log("position/velocity of " + this.idNumber + ": " + this.position + ", " + this.velocity);
            },

            // Give this object a bunch of elements
            initAsElementContainer : function() {
                this.elements = new ElementSet(this);

            },

            updateElements : function() {
                // Do something with the new element amounts
                //this.elements.setTotalMass(); // this is set by elements.siphon()

                if (this.elements.totalMass === 0) {
                    this.remove();
                }
            },

            initAsParticle : function() {
                this.position = new Vector(0, 0);
                this.velocity = new Vector(0, 0);
                this.forces = [];
                this.totalForce = new Vector(0, 0);
                this.mass = 1;
                this.drag = .93;
            },

            initAsTouchable : function() {
                this.touchable = true;
                this.touchHeld = false;

            },

            touchStart : function(touch) {
                this.touchHeld = true;
            },
            touchEnd : function(touch) {
                this.touchHeld = false;
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {

                this.idColor.fill(g);
                g.noStroke();
                if (this.deleted) {
                    g.fill(.2, 0, .4);
                    g.stroke(1, 0, 1, .7);
                }

                g.ellipse(0, 0, this.radius, this.radius);

            },
            drawOverlay : function(g, options) {
                //var h = (this.idNumber * .212 + .3) % 1;
                if (this.touchHeld) {

                    this.idColor.stroke(g, .2, 1);
                    g.noFill();
                    g.strokeWeight(5);
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);
                }

                if (stellarGame.drawElements) {
                    this.elements.draw(g, this.radius);
                }

                // Draw the text
                this.idColor.fill(g);
                this.idColor.stroke(g, 1, 1);
                var textX = this.radius * .85 + 5;
                var textY = this.radius * .74 + 5;
                g.text(this.idNumber, textX, textY);
                $.each(this.debugOutputLines, function(index, line) {
                    g.text(line, textX, textY + 12 * (index + 1));
                })
            },
            draw : function(g, options) {

                switch(options.layer) {
                    case "bg":
                        this.drawBackground(g, options);
                        break;

                    case "main":
                        this.drawMain(g, options);

                        break;

                    case "overlay":
                        this.drawOverlay(g, options);
                        break;

                }
            },

            //======================================================================
            //======================================================================
            //======================================================================
            // Drawing styles
            drawAsDot : function(g) {
                g.noStroke();
                var starLevels = 2;
                for ( j = 0; j < starLevels; j++) {

                    var jPct = j * 1.0 / (starLevels - 1);
                    this.idColor.fill(g, jPct * .8, jPct - .6);
                    var r = (1 - .8 * jPct) * this.radius;
                    g.ellipse(0, 0, r, r);
                }

            },

            drawAsBlinkenStar : function(g, segmentDetail, useNoise, useTriangle) {
                var i, j;
                var t = stellarGame.time.universeTime;
                var radius = this.radius * .4;
                g.noStroke();
                var points = 5;
                var spikiness = .5;
                var starLevels = 2;
                for ( j = 0; j < starLevels; j++) {
                    var jPct = j * 1.0 / (starLevels - 1);

                    g.beginShape();

                    var pop = 0;
                    var segments = points * segmentDetail;
                    g.fill(.065, (0.4 - 0.4 * jPct), 1, 0.2 + jPct);
                    for ( i = 0; i < segments + 1; i++) {
                        var theta = i * 2 * Math.PI / segments;

                        var spike = Math.abs(Math.sin(theta * points / 2));
                        spike = 1 - Math.pow(spike, .2);

                        var sparkle = .5;
                        if (useNoise)
                            sparkle = spikiness * utilities.pnoise(t * 2 + theta + this.idNumber) + .1;
                        sparkle = Math.pow(sparkle, 2);

                        var r = .3 * radius * (spike * sparkle);

                        r += .4 + 1.5 * pop;
                        r *= radius * .7 * (1.2 - Math.pow(.7 * jPct, 1));
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                    g.endShape();
                }
            },

            toString : function() {
                return "p" + this.idNumber + this.position;
            },
        });
        return UParticle;
    })();

});
