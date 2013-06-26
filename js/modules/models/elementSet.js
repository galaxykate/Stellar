/**
 * @author Kate Compton
 */

// Reusable Vector class

define(["modules/models/elements"], function(Elements) {
    return (function() {

        // Private functions
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

        console.log(activeElements);

        var segmentsPerCircle = 50;
        function drawArc(g, innerRadius, outerRadius, startTheta, endTheta) {
            var thetaRange = endTheta - startTheta;
            var segments = Math.ceil(segmentsPerCircle * thetaRange / (2 * Math.PI));
            g.beginShape(g.TRIANGLE_STRIP);
            for (var i = 0; i < segments; i++) {
                var theta = (i / (segments - 1)) * thetaRange + startTheta;
                g.vertex(innerRadius * Math.cos(theta), innerRadius * Math.sin(theta));
                g.vertex(outerRadius * Math.cos(theta), outerRadius * Math.sin(theta));
            }
            g.endShape();
        };

        // Make the Vector class
        function ElementSet() {
            console.log("Create element set");
            this.elementQuantity = [];
            for (var i = 0; i < activeElements.length; i++) {
                this.elementQuantity[i] = Math.random() * 1000 / (i + 1);
            }
            this.setTotalMass();

        };

        ElementSet.prototype.setTotalMass = function() {
            this.totalMass = 0;

            for (var i = 0; i < activeElements.length; i++) {
                this.totalMass += this.elementQuantity[i];
            }
        };

        ElementSet.prototype.draw = function(g, radius) {
var totalRange = 6;
            var innerRadius = radius + 20;
            var outerRadius = innerRadius + 20;
            var endTheta = 0;
            for (var i = 0; i < activeElements.length; i++) {
                var thetaRange = totalRange * this.elementQuantity[i] / this.totalMass;
                g.fill(.1 * i, 1, 1);

                var startTheta = endTheta;
                endTheta = startTheta + thetaRange;
                drawArc(g, innerRadius, outerRadius, startTheta, endTheta);

            }
        };

        return ElementSet;
    })();

});
