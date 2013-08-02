/**
 * @author Kate Compton
 */

// A voronoi region for the universe, good for territory, etc

define(["inheritance", "modules/models/vector", "kcolor", "uparticle"], function(Inheritance, Vector, KColor, UParticle) {
    return (function() {

        // Private functions
        var regionCount = 0;

        var Region = UParticle.extend({
            init : function() {
                this._super();
                this.drawUntransformed = true;
                this.idNumber = regionCount;
                regionCount++;
                this.idColor = new KColor((this.idNumber * .289 + .31) % 1, 1, 1);
                this.center = new Vector(utilities.random(-400, 400), utilities.random(-400, 400));
                // test points
                var sides = 10;
                this.points = [];
                for (var i = 0; i < sides; i++) {
                    var r = 100 + 800 * utilities.pnoise(i + this.idNumber);
                    var theta = 2 * Math.PI * i / sides;
                    var p = new Vector(this.center);
                    p.addPolar(r, theta);

                    this.points[i] = p;
                }
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {
                
                this.idColor.fill(g, .2, -.6);
                this.idColor.stroke(g, .2, 1);
                g.strokeWeight(1);
                //  g.noStroke();

                options.drawShape(g, this.points);
            },

            drawOverlay : function(g, options) {
                this.idColor.fill(g, .5, .6);
                g.noStroke();
                g.ellipse( options.screenPos.x, options.screenPos.y, 10, 10);
                g.text("Region " + this.idNumber + " " + options.scale , options.screenPos.x, options.screenPos.y);

            },
        });
        return Region;
    })();

});
