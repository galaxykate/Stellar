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
        function ElementSet() {
            this.elementQuantity = [];

            // How many elements does this start with?
            var maxElements = 1 + Math.floor(Math.random() * Math.random() * activeElements.length);
            var previousElement = Math.random() * 1000;
            for (var i = 0; i < activeElements.length; i++) {

                // Each element should be a little less frequent then the element before
                this.elementQuantity[i] = previousElement * (.3 + .4 * Math.random());
                previousElement = this.elementQuantity[i];
            }
            this.setTotalMass();

        };

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

        return ElementSet;
    })();

});
