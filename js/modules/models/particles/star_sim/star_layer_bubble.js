/**
 * @author Kate Compton
 */

define(["modules/models/elementSet", "uparticle"], function(ElementSet, UParticle) {
    var bubbleRadius = 1;
    var bubbleCount = 0;

    var getPressureFromDistance = function(distance) {
        var press = Math.pow(Math.abs(distance), -.5);
        press = utilities.constrain(press, 0, 10);
        return press;
    };

    var LayerBubble = UParticle.extend({
        init : function(layers, element) {

            this.element = element;
            this.isFusing = false;
            this.radius = bubbleRadius * (1 + Math.pow(element.number, .3));
            this.drag = .9;
            this.idNumber = bubbleCount;
            this.maxVelocity = 20;
            this.layers = layers;
            this.upwardsPressure = 0;
            this.downwardsPressure = 0;
            this.forces = {
                pressure : new Vector(),
                containment : new Vector(),
                gravity : new Vector(),
                wander : new Vector(),

            }
            this.initAsParticle();
            this.mass = element.number;

            this.kineticEnergy = 10 + Math.random() * 20;
            this.territory = {
                innerRadius : 1,
                outerRadius : 2,
                volume : 10,
            }

            this.createDiv();
            bubbleCount++;
        },

        createDiv : function() {

            this.div = this.layers.getFreeDiv();
            this.div.bubble = this;
            // Set the div to the style for this element
            var divR = this.radius * this.layers.screenScale;

            this.div.css({
                "background" : this.element.idColor.toCSS(),
                width : divR + "px",
                height : divR + "px",
                left : Math.floor(Math.random() * 600) + "px",
                top : Math.floor(Math.random() * 600) + "px",
            });

            this.div.html(this.element.symbol);
        },
        remove : function() {
            this._super();
            this.div.returnToPool();
        },

        // Add all the forces
        addForces : function(time) {
            var bubble = this;
            var y = -this.position.y;
            this._super(time);
            var outwardsForce = 0;
            var speed = 50;

            var gravity = this.layers.getValue("gravity", y);
            var weight = gravity * speed * this.mass*stellarGame.tunings.gravity;

            var wander = -0 * (utilities.pnoise(time.total + this.idNumber + 100) - .3);

            this.electronDegeneracyPressure = speed * 2 * Math.pow(y, -.5);

            var xPull = Math.abs(30*this.position.x/this.layers.radius);
            var xForce = -stellarGame.tunings.containerForce * Math.pow(xPull, 4) / this.position.x;
            this.forces.containment.setTo(xForce, 0);
            this.forces.wander.setTo(0, wander);

            // Force from other bubbles
            this.forces.bubble = this.layers.getForceOn(this);

            // Pressure force
            this.forces.pressure.setTo(0, -900 * this.layers.getValue("gasPressure", Math.abs(this.position.y)));
            this.forces.gravity.setTo(0, weight);

            $.each(this.forces, function(index, force) {
                if (!force.isValid())
                    debug.output(index + ": " + force.invalidToString());
                else
                    bubble.totalForce.add(force);
            });

            // bubble.totalForce.mult(0);
            
            this.maxVelocity = this.layers.radius;
        },
        setTerritory : function(innerRadius, outerRadius) {
            // Calculate the territory, etc
            this.territory.innerRadius = Math.abs(innerRadius);
            this.territory.outerRadius = Math.abs(outerRadius);
        },

        //================================================================
        //================================================================
        //================================================================

        drawTerritory : function(g) {
            this.element.idColor.fill(g, .3 * Math.sin(this.idNumber), 0);
            this.element.idColor.stroke(g, .7, 1);
            g.strokeWeight(.2);
            var w = 2;
            g.rect(-w / 2, -this.territory.innerRadius, w, -(this.territory.outerRadius - this.territory.innerRadius));
        },
        drawBackground : function(g) {
            var t = stellarGame.simTime;
            var heatRad = this.radius + .2 * Math.pow(this.heat, .6);
            g.fill(.15, 1, 1);
            var color = new KColor(.15, 1, 1, 1);
            //    g.ellipse(0, 0, heatRad, heatRad);
            //   this.drawBlinkenStar(g, color, heatRad, 15, 1, t);
        },

        drawMain : function(g) {

            // Find the screen pos and move the div to it;

            this.screenR = this.radius * (.3 + Math.pow(this.layers.zoomScale, .5));
            this.screenX = this.layers.zoomScale * this.position.x + screenResolution.width / 2;
            this.screenY = this.layers.zoomScale * this.position.y + screenResolution.height / 2;

            debug.output(this.screenX.toFixed(2) + " " + this.screenY.toFixed(2) + " " + this.screenR.toFixed(2));
            this.div.css({
                left : Math.round(this.screenX - this.screenR),
                top : Math.round(this.screenY - this.screenR),
                width : Math.round(this.screenR * 2) + "px",
                height : Math.round(this.screenR * 2) + "px",

            });

            if (stellarGame.options.showBubbleForces) {

                // Draw all the forces
                var count = 0;
                var m = 1 / this.mass;
                $.each(this.forces, function(index, force) {
                    count++;
                    g.stroke((count * .154) % 1, 1, 1);
                    g.strokeWeight(1);
                    g.line(force.x * m, force.y * m, 0, 0);
                })
            }

        },
        drawSample : function(g, color, width, y) {
            color.fill(g);
            var height = 3;

            g.rect(0, y - height / 2, width, 1);
        },
        drawArrow : function(g, color, offset, d) {
            var width = 2;
            var dir = d / Math.abs(d);
            var arrowWidth = width * 1.2;
            g.noStroke();
            color.fill(g);
            g.rect(0, 0, offset + width / 2, width);

            g.rect(offset - width / 2, 0, width, d - arrowWidth * dir * .7);

            g.beginShape();
            g.vertex(offset, d);
            g.vertex(offset + arrowWidth, d - arrowWidth * dir);
            g.vertex(offset - arrowWidth, d - arrowWidth * dir);

            g.endShape();
        },
        toString : function() {
            return this.element.symbol + this.idNumber;
        }
    });

    return LayerBubble;
});
