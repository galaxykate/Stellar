/**
 * @author Kate Compton
 */
define(["modules/models/elementSet"], function(ElementSet) {
    var LayerGraph = Class.extend({
        init : function(layers, name, segmentCount) {
            this.name = name;
            this.layers = layers;
            this.segmentCount = segmentCount;
            this.xMult = 1;
            this.total = 0;
            this.logScale = false;

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

        getDifferential : function(point, span) {
            var sample0 = this.sampleAt(point - span);
            var sample1 = this.sampleAt(point + span);
            return sample1 - sample0;
        },

        getIndexSplit : function(y) {
            var index = this.getInded(y);
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

        addValue : function(value, territory) {
            var start = territory.innerRadius;
            var end = territory.outerRadius;
            var startIndex = this.getIndex(start);
            var endIndex = this.getIndex(end) - 1;
            // get the two indices closest

            // get the min and max index
            var min = Math.floor(startIndex);
            var max = Math.ceil(endIndex);

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
            }

        },

        getIndex : function(y) {
            return -this.segmentCount * y / this.layers.radius;
        },

        sampleAt : function(y) {
            var value = 0;
            var split = this.getIndexSplit(-y);
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
            this.total = 0;
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
            return new KColor((.5 + -value * .03) % 1, 1, 1);
        },

        valueToGraphX : function(val) {
            var v = val;
            if (this.logScale)
                v = Math.log(v);

            return v * this.xMult;
        },

        draw : function(g, xOffset, dir) {
            xOffset *= dir;
            g.fill(1);

            g.textSize(6);
            g.text(this.name, xOffset, 10);
            g.rect(xOffset, 0, 200, .5);
            var h = -this.layers.radius / this.segmentCount;
            var drawAngled = true;
            for (var i = 0; i < this.segmentCount - 1; i++) {
                var x0 = dir * this.valueToGraphX(this.values[i]);
                var x1 = dir * this.valueToGraphX(this.values[i + 1]);

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
                g.vertex(xOffset, y0);
                g.vertex(xOffset, y1);
                g.vertex(x1 + xOffset, y1);
                g.vertex(x0 + xOffset, y0);
                g.endShape();

            }
        }
    });
    return LayerGraph;
});
