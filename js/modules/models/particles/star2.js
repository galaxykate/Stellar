/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/elementSet"], function(Inheritance, Vector, UParticle, ElementSet) {
    var bubbleRadius = 2;
    var densityLayers = 30;

    var bubbleCount = 0;
    var LayerBubble = UParticle.extend({
        init : function(element) {
            this.element = element;
            this.radius = bubbleRadius * (1 + Math.pow(element.number, .3));
            this.weight = element.number;
            this.idNumber = bubbleCount;
            bubbleCount++;
        },

        drawMain : function(g) {
            this.element.idColor.fill(g);
            g.ellipse(0, 0, this.radius, this.radius);
            g.noStroke();
            this.element.idColor.fill(g, -.5, 1);
            g.textSize(6);
            g.text(this.element.symbol, -3, 2);
        },
        drawBackground : function(g) {

        },

        addForces : function(time) {
            var y = -this.position.y;
            this._super(time);
            var outwardsForce = 0;
            var speed = 50;
            var weight = speed * Math.pow(this.element.number, .3);
            var wander = 30*(utilities.pnoise(time.total + this.idNumber + 100) - .5);

            this.electronDegeneracyPressure = speed*120 * Math.pow(y, -1);

            this.totalForce.y += -this.electronDegeneracyPressure + weight + wander;
            this.totalForce.x = 170 * (utilities.pnoise(time.total + this.idNumber) - .5) + -this.position.x;
        
         
         }
    })

    var StarLayers = Class.extend({

        init : function(star) {
            this.star = star;
            this.bubbles = [];
            this.radius = 150;
            this.density = [];

            // Make a bunch of layer bubbles
            for (var i = 0; i < 10; i++) {
                var index = Math.round(Math.random() * Math.random() * 6);
                var element = ElementSet.activeElements[index];
                var bubble = new LayerBubble(element);
                bubble.initAsParticle()
                bubble.position.y = -Math.random() * this.radius;

                this.bubbles.push(bubble);
            }
        },

        applyToBubbles : function(fxn, arg) {
            $.each(this.bubbles, function(index, bubble) {
                bubble[fxn](arg);
            });
        },

        updateSimulation : function(time) {
            var layers = this;
            // Reset the density
            for (var i = 0; i < densityLayers; i++) {
                this.density[i] = 0;
            }

            // add all the bubbles to the density

            $.each(this.bubbles, function(index, bubble) {
                var pct = -bubble.position.y / this.radius;
                var index = Math.round(pct, densityLayers);
                layers.density[index] = bubble.weight;
            });

            this.applyToBubbles("beginUpdate", time);
            this.applyToBubbles("addForces", time);
            this.applyToBubbles("updatePosition", time);
            this.applyToBubbles("finishUpdate", time);

            $.each(this.bubbles, function(index, bubble) {
                bubble.position.y = Math.min(bubble.position.y, 0);
                bubble.pct = bubble.position.y / layers.radius;
            });

            // sort the bubbles
            this.bubbles.sort(function(a, b) {
                return -a.position.y + b.position.y;
            });
        },

        draw : function(g) {
            g.fill(1, 0, 1, .4);

            // Draw the arc
            g.beginShape();
            g.vertex(0, 0);
            var r = this.radius;
            var innerR = this.radius * .1;
            var segments = 5;
            var arcTheta = 1.2;
            var dTheta = arcTheta / segments;
            for (var i = 0; i < segments + 1; i++) {
                var theta = dTheta * i - arcTheta / 2 + -Math.PI / 2;
                g.vertex(r * Math.cos(theta), r * Math.sin(theta));
            }

            g.endShape();

            /*
            // Draw the density
            var densityRowHeight = this.radius / densityLayers;
            for (var i = 0; i < densityLayers; i++) {
            g.fill((this.density[i] * .2) % 1, 1, 1);
            g.rect(0, -densityRowHeight * i, 2 * this.density[i] + 5, densityRowHeight * .8);
            }
            */

            // Draw the bubbles territories

            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[this.bubbles.length - (i + 1)];
                bubble.element.idColor.fill(g, .4, -.9);
                var r = -bubble.position.y;
                g.ellipse(0, 0, r, r);
            }

            var last = 0;
            $.each(this.bubbles, function(index, bubble) {
                var current = bubble.position.y;
                bubble.element.idColor.fill(g);
                g.rect(-10, last, 20, current - last);
                last = current;
            });

            $.each(this.bubbles, function(index, bubble) {
                g.pushMatrix();
                bubble.position.translateTo(g);
                bubble.drawMain(g);
                g.popMatrix();
            });

        },
    });

    var Star = UParticle.extend({

        init : function(universe) {

            this._super(universe);
            this.minLOD = 3;
            this.name = UParticle.generateName() + "dfasdkjafk";

            this.excitement = {
                power : 0,
                dieoff : .3,
                animationTime : 0,
            };

            this.layers = new StarLayers(this);

            // What is a star made of?  an inner core and outer layers
            // OR lots of little bubbles representing elements, drifting up and down and heating up or cooling
            //
        },

        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Drawing

        drawBackground : function(context) {
            this._super(context);
            var g = context.g;
            g.fill(1, 0, 1, .2);
            g.ellipse(0, 0, 15, 15);
        },

        drawMain : function(context) {

            this._super(context);
            var g = context.g;

            if (context.LOD.index < 2)
                this.layers.draw(g);

        },

        drawOverlay : function(context) {
            this._super(context);
            var g = context.g;

        },

        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Interactions

        excite : function(maxPower) {
            this.excitement.power = Math.max(maxPower, this.excitement.power);
        },

        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Updating

        updateSimulation : function(time) {

            var last = this.excitement.power;
            this.excitement.power *= Math.pow(this.excitement.dieoff, time.ellapsed);
            this.excitement.animationTime += this.excitement.power * time.ellapsed;
            this.layers.updateSimulation(time);

        },
    });

    return Star;

});
