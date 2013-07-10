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

                this.setRadius(10);

                particleCount++;
                this.initAsParticle();

                this.position.setToPolar(Math.random() * 200 + 100, Math.random() * 100);
                this.velocity.addPolar(Math.random() * 1, Math.random() * 1);

                this.initAsElementContainer();

                this.initAsTouchable();
                this.debugOutputLines = [];
                
                // For ranges of surface temperatuers, visit https://en.wikipedia.org/wiki/Stellar_classification
                this.temperature = 0; // Kelvin
                this.burningFuel = false;

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
                var theta = 16 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = 190;
                // this.totalForce.addPolar(r, theta);

                this.velocity.addMultiple(this.totalForce, t);
                this.position.addMultiple(this.velocity, t);
                this.velocity.mult(this.drag);
                
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
                if(this.elements.totalMass === 0){
                	this.remove();
               	}
               	if(this.burnFuel){
               		this.elements.burnSomeFuel(this.temperature);
                }
               	
               	if(this.temperature === -10000){
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
            toString : function() {
                return "p" + this.idNumber + this.position;
            },
        });
        return UParticle;
    })();

});
