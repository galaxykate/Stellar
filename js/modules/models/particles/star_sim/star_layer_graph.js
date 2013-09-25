/**
 * @author Kate Compton
 */
define(["modules/models/elementSet"], function(ElementSet) {
    var LayerGraph = Class.extend({

        init : function(layers, name, segmentCount) {
            this.name = name;
            this.layers = layers;
            this.segmentCount = segmentCount;

            this.total = 0;
            this.logScale = false;
            this.displayMultiplier = 1;
            this.dir = 1;

            this.values = [];
            for (var i = 0; i < this.segmentCount; i++) {
                this.values[i] = Math.random() * 30;
            }
            this.filterLength = 2;
            var sigma = 2;

            this.blurFilter = [];
            for (var i = -this.filterLength; i <= this.filterLength; i++) {
                var x = i;

                var exp = (-x * x) / (2 * sigma * sigma);
                this.blurFilter[i + this.filterLength] = (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.pow(Math.E, exp);
            }

            this.position = new Vector((i * 20), 0);

            this.blur();
        },

        setDisplayNumber : function(displayNumber) {
            this.displayNumber = displayNumber;
            if (displayNumber % 2 === 1)
                this.dir = -1;

            this.position.x = this.dir * displayNumber * 70 + 100;
            console.log(this.position);
        },

        getDifferential : function(point, span) {
            var sample0 = this.sampleAt(point - span);
            var sample1 = this.sampleAt(point + span);
            return sample1 - sample0;
        },
        getIndexSplit : function(y) {
            var index = this.getIndex(y);
            var index0 = Math.floor(index);
            var index1 = Math.ceil(index);
            index0 = utilities.constrain(index0, 0, this.segmentCount - 1);
            index1 = utilities.constrain(index1, 0, this.segmentCount - 1);

            var d = Math.abs(index0 - index);
            return [{
                index : index0,
                pct : 1 - d
            }, {
                index : index1,
                pct : d
            }];
        },

        // Must be same length
        setFrom : function(graph, fxn) {
            var layerRadius = this.layers.radius;
            for (var i = 0; i < this.segmentCount; i++) {
                var radius = layerRadius * (i + 1) / (this.segmentCount);
                this.values[i] = fxn(graph.values[i], radius);
            }
        },
        addValue : function(value, start, end) {

            var startIndex = this.getIndex(start);
            var endIndex = this.getIndex(end) - 1;

            // get the two indices closest

            // get the min and max index
            var min = Math.floor(startIndex);
            var max = Math.ceil(endIndex);
            var valueAdded = 0;

       
            // Fill in all the values
            for (var i = min; i <= max; i++) {
                var pct = 1;

                // What pct of this layer is filled?
                if (i === min) {
                    pct = 1 - (startIndex - i);
                }

                if (i === max) {
                    pct = 1 - (i - endIndex);

                }

                pct = utilities.constrain(pct, 0, 1);

                this.values[i] += value * pct;
                valueAdded += value * pct;
            }

        },
        set : function(i, value) {
            this.values[i] = value;
        },
        calculateTotal : function() {
            this.total = 0;
            for (var i = 0; i < this.segmentCount; i++) {
                this.total += this.values[i];
            }
        },
        getIndex : function(y) {
            return this.segmentCount * y / this.layers.radius;
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
                this.values[i] = 0;
            }
        },
        blur : function() {

            // Add up the original
            var originalTotal = 0;
            for (var i = 0; i < this.segmentCount; i++) {
                originalTotal += this.values[i];
            }

            var blurredValues = [];
            for (var i = 0; i < this.segmentCount; i++) {
                blurredValues[i] = this.getBlurredValue(i);
            }

            for (var i = 0; i < this.segmentCount; i++) {
                this.values[i] = blurredValues[i];
                this.total += this.values[i];
            }

            this.total /= this.segmentCount;
        },
        valueToColor : function(value) {
            if (value === undefined || isNaN(value))
                value = 0;

            var value = 5 * Math.pow(Math.abs(value), .5);
            return new KColor((.5 + -value * .03) % 1, 1, 1);
        },
        valueToGraphX : function(val) {
            var v = val;
            if (this.logScale)
                v = Math.log(v);

            return v * this.displayMultiplier;
        },
        draw : function(g, screenRadius) {

            g.pushMatrix();
            this.position.translateTo(g);
            g.noStroke();

            g.fill(1);

            g.textSize(14);
            g.text(this.name, 0, 15);
            g.text("total: " + this.total.toFixed(2), 0, 28);
            g.rect(0, 0, 200, .5);
           
            var h = -screenRadius / this.segmentCount;
            var drawAngled = true;
            for (var i = 0; i < this.segmentCount - 1; i++) {
                var x0 = this.dir * this.valueToGraphX(this.values[i]);
                var x1 = this.dir * this.valueToGraphX(this.values[i + 1]);

                var y0 = h * i;
                var y1 = h * (i + 1);

                var avg = (x0 + x1) / 2;
                var val = x0;

                if (drawAngled) {
                    val = avg;
                } else {
                    x1 = x0;
                }

                this.valueToColor(val).fill(g, 0, 1);
                g.beginShape();
                g.vertex(0, y0);
                g.vertex(0, y1);
                g.vertex(x1, y1);
                g.vertex(x0, y0);
                g.endShape();

            }
            g.popMatrix();
        }
    });
    return LayerGraph;
});
