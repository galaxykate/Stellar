/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/elementSet", "modules/models/face/face", "kcolor"], function(Inheritance, Vector, UParticle, ElementSet, Face, KColor) {
    var bubbleRadius = 1;
    var densityLayers = 30;

    var bubbleCount = 0;

    var getPressureFromDistance = function(distance) {
        var press = Math.pow(Math.abs(distance), -.5);
        press = utilities.constrain(press, 0, 10);
        return press;
    };

    var LayerBubble = UParticle.extend({
        init : function(layers, element) {
            this.element = element;
            this.radius = bubbleRadius * (1 + Math.pow(element.number, .3));
            this.mass = element.number;
            this.idNumber = bubbleCount;
            this.maxVelocity = 200;
            this.layers = layers;
            this.temperature = 0;
            bubbleCount++;
        },

        drawMain : function(g) {
            g.noStroke();
            // draw the pressure
            var upRad = this.upPress;
            var downRad = this.upPress;
            upRad = utilities.constrain(upRad, .1, 10);
            downRad = utilities.constrain(downRad, .1, 10);
            g.fill(.4, 1, 1);
            //g.ellipse(0, -this.radius, upRad * 3, upRad);
            g.fill(.9, 1, 1);
            //g.ellipse(0, this.radius, downRad * 3, downRad);

            this.element.idColor.fill(g);
            g.ellipse(0, 0, this.radius, this.radius);
            g.noStroke();
            this.element.idColor.fill(g, -.5, 1);
            g.textSize(6);
            g.text(this.element.symbol, -3, 2);

            // Draw pressure differential
            // Draw density samples
            /*
             var sampleRange = 10;
             var y0 = this.position.y + sampleRange;
             var sample0 = this.layers.heat.sampleAt(y0);
             this.drawSample(g, new KColor(.5, 1, 1), this.layers.heat.xMult * sample0, sampleRange);
             this.densityDifferential = 20 * utilities.pnoise(y0 * 0.01) - 10;
             this.drawArrow(g, new KColor(.5, 1, 1), 30, this.densityDifferential);
             */

            if (this.bubbleForce) {

                g.stroke(0);
                g.strokeWeight(2);
                //  g.line(0, 0, this.bubbleForce.x, this.bubbleForce.y);
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

        drawBackground : function(g) {

        },

        addForces : function(time) {
            var y = -this.position.y;
            this._super(time);
            var outwardsForce = 0;
            var speed = 50;
            var weight = speed * Math.pow(this.element.number, .3);
            var wander = 30 * (utilities.pnoise(time.total + this.idNumber + 100) - .5);

            this.electronDegeneracyPressure = speed * 2 * Math.pow(y, -.5);

            this.totalForce.y += -this.electronDegeneracyPressure + weight + wander;

            var xPull = Math.abs(this.position.x);
            var xForce = -3 * Math.pow(xPull, 4) / this.position.x;

            this.totalForce.x = 170 * (utilities.pnoise(time.total + this.idNumber) - .5);

            if (xPull !== 0)
                this.totalForce.x += xForce;

            this.bubbleForce = this.layers.getForceOn(this);
            this.totalForce.add(this.bubbleForce);
            if (isNaN(this.totalForce.x) || isNaN(this.totalForce.y)) {

                //   debug.output("totalforce: " + this.totalForce);
                this.totalForce.setTo(0, 0);

            }
        }
    })

    var LayerGraph = Class.extend({
        init : function(layers, name, segmentCount) {
            this.name = name;
            this.layers = layers;
            this.segmentCount = segmentCount;
            this.xMult = 4;

            this.values = [];
            for (var i = 0; i < this.segmentCount; i++) {
                this.values[i] = Math.random() * 30;
            }
            this.filterLength = 4;
            var sigma = 2;

            this.blurFilter = [];
            for (var i = -this.filterLength; i <= this.filterLength; i++) {
                var x = i;

                var exp = (-x * x) / (2 * sigma * sigma);
                this.blurFilter[i + this.filterLength] = (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.pow(Math.E, exp);
            }

            this.blur();
        },

        getIndexSplit : function(y) {
            var index = -(this.segmentCount - 1) * y / this.layers.radius;
            var index0 = Math.floor(index);
            var index1 = Math.ceil(index);

            var d = Math.abs(index0 - index);
            return [{
                index : index0,
                pct : 1 - d
            }, {
                index : index1,
                pct : d
            }];
        },

        addValue : function(y, value) {
            // get the two indices closest
            var split = this.getIndexSplit(y);
            this.values[split[0].index] += value * split[0].pct;
            this.values[split[1].index] += value * split[1].pct;

        },
        sampleAt : function(y) {
            var value = 0;
            var split = this.getIndexSplit(y);
            value += split[0].pct * this.values[split[0].index];
            value += split[1].pct * this.values[split[1].index];
            return value;
        },

        getBlurredValue : function(index) {
            var total = 0;
            for (var i = -this.filterLength; i <= this.filterLength; i++) {
                var i2 = utilities.constrain(i + index, 0, this.segmentCount - 1);
                var v = this.values[i2];
                var filter = this.blurFilter[i + this.filterLength];
                total += v * filter;
            }

            return total;
        },
        clear : function() {
            for (var i = 0; i < this.segmentCount; i++) {
                this.values[i] = 1;
            }
        },
        blur : function() {
            var blurredValues = [];
            for (var i = 0; i < this.segmentCount; i++) {
                blurredValues[i] = this.getBlurredValue(i);

            }

            for (var i = 0; i < this.segmentCount; i++) {
                this.values[i] = blurredValues[i];

            }
        },
        valueToColor : function(value) {
            return new KColor((.5 + -value * .03) % 1, 1, 1);
        },
        draw : function(g) {
            var h = -this.layers.radius / (this.segmentCount - 1);
            for (var i = 0; i < this.segmentCount - 1; i++) {
                var x0 = this.values[i] * this.xMult;
                var x1 = this.values[i + 1] * this.xMult;
                var avg = (this.values[i + 1] + this.values[i]) / 2;

                var y0 = h * i;
                var y1 = h * (i + 1);

                this.valueToColor(avg).fill(g, 0, -.7);
                g.beginShape();
                g.vertex(0, y0);
                g.vertex(0, y1);
                g.vertex(x1, y1);
                g.vertex(x0, y0);
                g.endShape();
            }
        }
    });

    var StarLayers = Class.extend({

        init : function(star) {
            this.star = star;
            this.bubbles = [];
            this.radius = 90;

            this.heat = new LayerGraph(this, "heat", 50);

            // Make a bunch of layer bubbles
            for (var i = 0; i < 1; i++) {
                var index = Math.round(Math.random() * Math.random() * 6);
                var element = ElementSet.activeElements[index];
                var bubble = this.addBubble(element);
                bubble.position.y = -(i + 1) * this.radius / 10;
            }
        },

        addBubble : function(element) {
            var bubble = new LayerBubble(this, element);
            bubble.initAsParticle()
            bubble.position.y = -this.radius;
            this.bubbles.push(bubble);
            return bubble;
        },

        applyToBubbles : function(fxn, arg) {
            $.each(this.bubbles, function(index, bubble) {
                bubble[fxn](arg);
            });
        },

        getForceOn : function(target) {
            var pressureForce = new Vector();
            for (var i = 0; i < bubbleCount; i++) {
                var bubble = this.bubbles[i];
                if (bubble !== target) {
                    var offset = target.position.getOffsetTo(bubble.position);

                    var d = offset.magnitude();
                    if (d === 0) {
                        offset.x = 1;
                        d = 1;
                    }

                    var power = 100 * Math.pow(d, -1.2);
                    power *= Math.pow(bubble.element.number, .2);
                    power = utilities.constrain(power, 0, 10000);
                    pressureForce.addMultiple(offset, -power / d);
                }
            }

            return pressureForce;
        },

        updateSimulation : function(time) {
            var layers = this;

            // Set the pressure on all the bubbles
            var bubbleCount = this.bubbles.length;

            // add all the bubbles to the density

            $.each(this.bubbles, function(index, bubble) {
                var pct = -bubble.position.y / this.radius;

            });

            this.applyToBubbles("beginUpdate", time);
            this.applyToBubbles("addForces", time);
            this.applyToBubbles("updatePosition", time);
            this.applyToBubbles("finishUpdate", time);

            $.each(this.bubbles, function(index, bubble) {
                var min = -5 * (1 + Math.sin(bubble.idNumber + time.total));
                bubble.position.y = Math.min(bubble.position.y, min);
            });

            layers.heat.clear();
            $.each(this.bubbles, function(index, bubble) {
                layers.heat.addValue(bubble.position.y, 40 * bubble.mass);
            });
            layers.heat.blur();
            layers.heat.blur();

            // sort the bubbles
            this.bubbles.sort(function(a, b) {
                return -a.position.y + b.position.y;
            });
        },

        draw : function(g) {

            this.heat.draw(g);
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

            // Draw the bubbles territories

            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[this.bubbles.length - (i + 1)];
                g.noFill();
                g.strokeWeight(2);
                bubble.element.idColor.stroke(g, .4, -.5);
                var r = -bubble.position.y;
                g.ellipse(0, 0, r, r);
            }

            g.noStroke();
            var last = 0;
            $.each(this.bubbles, function(index, bubble) {
                var current = bubble.position.y;
                bubble.element.idColor.fill(g, 0, -.5);
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

            this.initAsTouchable();
            this.initAsParticle();

            this.name = UParticle.generateName() + "dfasdkjafk";
            this.radius = 50;
            this.excitement = {
                power : 0,
                dieoff : .3,
                animationTime : 0,
            };

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

            if (this.inFocus) {
                if (this.layers === undefined)
                    this.layers = new StarLayers(this);
                this.layers.draw(g);
            }

            if (context.LOD.index < 1) {
                if (this.face === undefined)
                    this.face = new Face(this);

                //  this.face.draw(g);

            }

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

        feed : function(element, amt) {
            console.log("Feed " + element.name + " " + amt);

            this.layers.addBubble(element);
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

            if (this.inFocus && this.layers)
                this.layers.updateSimulation(time);

            if (this.face)
                this.face.update(time);
        },
    });

    return Star;

});
