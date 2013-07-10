/**
 * @author Kate Compton
 */

// Reusable Vector class

define(["modules/models/elements", "jQueryUI"], function(Elements, $) {
    return (function() {

        // Private functions

        // Which elements are actually active in this game?
        // We may not want all of them.

        var activeElementNames = ["Hydrogen", "Helium", "Carbon", "Oxygen", "Silicon", "Iron", "Gold", "Uranium"];
        var activeElements = [];
        $.each(activeElementNames, function(index, elementName) {
            var elemData = Elements[elementName];
            activeElements[index] = {
                name : elementName,
                number : elemData.atomic_number,
                symbol : elemData.symbol,
            };
        });

        // Draw an arc around some radius: used to show proportion of elements
        var segmentsPerCircle = 50;
        function drawArc(g, innerRadius, outerRadius, startTheta, endTheta) {
            var thetaRange = endTheta - startTheta;
            var segments = Math.ceil(segmentsPerCircle * thetaRange / (2 * Math.PI));
            g.noStroke();
            g.beginShape();
            // Go back and forth around the shape
            for (var i = 0; i < segments + 1; i++) {
                var theta = (i / (segments) * thetaRange + startTheta);
                g.polarVertex(innerRadius, theta);

            }

            for (var i = segments; i >= 0; i--) {
                var theta = (i / (segments) * thetaRange + startTheta);
                g.polarVertex(outerRadius, theta);
            }

            g.endShape();
        };

        // Make the Vector class
        function ElementSet(parent) {
            this.elementQuantity = [];
            this.parent = parent;

            // How many elements does this start with?
            var maxElements = 1 + Math.floor(Math.random() * Math.random() * activeElements.length);
            var previousElement = Math.random() * 1000;
            for (var i = 0; i < activeElements.length; i++) {
                this.elementQuantity[i] = 0;
                // Each element should be a little less frequent then the element before
                if (i <= maxElements) {
                    this.elementQuantity[i] = previousElement * (.3 + .4 * Math.random());
                    previousElement = this.elementQuantity[i];
                }

            }

            this.setTotalMass();
            this.parent.updateElements();

        };

        //===============================================================
        //===============================================================
        //===============================================================
        // Ways to transfer, add, fuse, or remove elements

        // Siphon off some elements
        ElementSet.prototype.siphon = function(target, volume) {
            for (var i = 0; i < volume; i++) {
                var elem = utilities.getWeightedRandom(target.elementQuantity, function(index, elem) {
                    return index;

                });

                var siphonAmt = Math.min(150, target.elementQuantity[elem]);

                this.elementQuantity[elem] += siphonAmt;
                target.elementQuantity[elem] -= siphonAmt

            }

            this.setTotalMass();
            target.setTotalMass();

        };

        // Transfer some of the elements to the target
        ElementSet.prototype.transferTo = function(target, pct) {
            for (var i = 0; i < activeElements.length; i++) {
                var amt = this.elementQuantity[i] * pct;
                this.elementQuantity[i] -= amt;
                target.elementQuantity[i] += amt;

            }
            this.setTotalMass();
            target.setTotalMass();

        };

        // Multiply the elements by some amount
        ElementSet.prototype.multiply = function(m) {
            for (var i = 0; i < activeElements.length; i++) {
                this.elementQuantity[i] *= m;

            }
            this.setTotalMass();
            target.setTotalMass();

        };

        //===============================================================
        //===============================================================
        //===============================================================

        ElementSet.prototype.setTotalMass = function() {
            this.totalMass = 0;

            for (var i = 0; i < activeElements.length; i++) {
                this.totalMass += this.elementQuantity[i];
            }
        };

        ElementSet.prototype.getElementCount = function() {
            var count = 0;
            for (var i = 0; i < activeElements.length; i++) {
                if (this.elementQuantity[i] > 0)
                    count++;
            }
            return count;
        };

        ElementSet.prototype.draw = function(g, radius) {
            var totalRange = 6;
            var innerRadius = radius + 20;
            var endTheta = 0;
            var margin = .2;
            totalRange -= (margin * (this.getElementCount() - 1));
            for (var i = 0; i < activeElements.length; i++) {
                var amt = this.elementQuantity[i];
                if (amt > 0) {
                    var outerRadius = amt / innerRadius + innerRadius;

                    var thetaRange = totalRange * amt / this.totalMass;
                    g.fill(.1 * i, 1, 1);

                    var startTheta = endTheta;
                    endTheta = startTheta + thetaRange;
                    drawArc(g, innerRadius, outerRadius, startTheta, endTheta);
                    endTheta += margin;
                }
            }
        };

        // radius here is the boundary of the dust cloud
        ElementSet.prototype.drawAsDustCloud = function(g, radius) {
            var t = stellarGame.time.universeTime;

            var minRadius = 2;

            for (var i = 0; i < activeElements.length; i++) {// big elements are on top
                //for (var i = activeElements.length - 1; i >= 0; i--) {// big elements are on bottom
                //var amt = this.elementQuantity[i];

                var hue = (i * 2.13) % 1;
                var amt = Math.ceil(Math.log(this.elementQuantity[i]));

                amt = Math.min(amt, 1);
                //var elementRad = activeElements[i].number/10;
                // var elementRad = Math.log(activeElements[i].number);

                var volume = utilities.constrain(this.elementQuantity[i], 0, 10000);
                var elementRad = .05 * volume * Math.pow(1.8, i);
                elementRad = Math.pow(elementRad, .5);
                //var elementRad = Math.sqrt(activeElements[i].number);
                if (elementRad < minRadius)
                    elementRad = minRadius;
                g.fill(hue, .9, .9);
                g.noStroke();
                //g.text(Math.floor(this.elementQuantity[i]), 0, 12 * i);

                if (amt > 0) {
                    // very rough scaling parameters, need to find better functions
                    for (var j = 0; j < amt; j++) {
                        var spread = radius * Math.pow(this.totalMass, .4) + 5;
                        var r = spread * .02 * Math.pow(i, .4) + 5;
                        var theta = j + t * (3 * Math.sin(i + j + this.parent.idNumber) - .5) + 10;
                        //      var xloc = 2 * radius * utilities.pnoise(.1 * t + 200 + amt + elementRad + j) - radius;
                        //i* 10;//
                        //     var yloc = 2 * radius * utilities.pnoise(.1 * t + 100 + amt + elementRad + j) - radius;
                        //i* 10;
                        //    g.ellipse(xloc, yloc, elementRad, elementRad)
                        g.ellipse(r * Math.cos(theta), r * Math.sin(theta), elementRad, elementRad)
                    }
                }

            }
        };

        return ElementSet;
    })();

});
