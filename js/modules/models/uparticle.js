/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "noise", "modules/models/kcolor"], function(Inheritance, Vector, ElementSet, Noise, KColor) {
    return (function() {

        var noise = new Noise();

        // Private functions
        var particleCount = 0;

        // Make the star class
        var UParticle = Class.extend({
            init : function(universe) {
                this.universe = universe;
                this.idNumber = particleCount;
                particleCount++;
                this.idColor = new KColor((this.idNumber * .289 + .31) % 1, 1, 1);

                this.radius = 10;

                particleCount++;
                this.initAsParticle();

                this.position.setToPolar(Math.random() * 200 + 100, Math.random() * 100);
                this.velocity.addPolar(Math.random() * 1, Math.random() * 100);

                this.initAsElementContainer();
                this.initAsTouchable();
                this.debugOutputLines = [];

            },

            remove : function() {
                this.radius = 0;
            },

            debugOutput : function(d) {

                this.debugOutputLines.push(d);

            },
            clearDebugOutput : function() {
                this.debugOutputLines = [];
            },

            // Update this particle according to physics
            update : function(time) {
                // Clear the output
                var t = time.ellapsed;
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
                var theta = 16 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = 190;
                // this.totalForce.addPolar(r, theta);

                this.velocity.addMultiple(this.totalForce, t);
                this.position.addMultiple(this.velocity, t);
                this.velocity.mult(this.drag);
            },

            // Give this object a bunch of elements
            initAsElementContainer : function() {
                this.elements = new ElementSet();
                this.elements.setTotalMass();
                this.mass = this.elements.totalMass;
                this.radius = Math.pow(this.mass, .5) * 1;

            },

            initAsParticle : function() {
                this.position = new Vector(0, 0);
                this.velocity = new Vector(0, 0);
                this.forces = [];
                this.totalForce = new Vector(0, 0);
                this.mass = 1;
                this.drag = .98;
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

            toString : function() {
                return "p" + this.idNumber + this.position;
            },
        });
        return UParticle;
    })();

});
