/**
 * @author Kate Compton
 */

// A voronoi region for the universe, good for territory, etc

define(["inheritance", "modules/models/vector", "kcolor", "uparticle"], function(Inheritance, Vector, KColor, UParticle) {
    return (function() {

        // Private functions
        var regionCount = 0;

        // Adapted from http://www.blackpawn.com/texts/pointinpoly/
        var isInsideTriangle = function(a, b, c, p) {

            // Compute vectors
            var v0 = Vector.sub(c, a);
            var v1 = Vector.sub(b, a);
            var v2 = Vector.sub(p, a);

            // Compute dot products
            var dot00 = Vector.dot(v0, v0)
            var dot01 = Vector.dot(v0, v1)
            var dot02 = Vector.dot(v0, v2)
            var dot11 = Vector.dot(v1, v1)
            var dot12 = Vector.dot(v1, v2)

            // Compute barycentric coordinates
            var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom

            // Check if point is in triangle
            return (u >= 0) && (v >= 0) && (u + v < 1)
        };

        var Region = UParticle.extend({
            init : function(center) {
                this._super();
                this.isRegion = true;
                this.owner = undefined;
                this.position.setTo(center);
                this.drawUntransformed = true;
                this.idNumber = regionCount;
                this.name = "Region" + this.idNumber;
                regionCount++;
                this.idColor = new KColor((this.idNumber * .289 + .31) % 1, 1, 1);

                this.center = center;
                // test points
                var sides = 10;
                this.points = [];
                for (var i = 0; i < sides; i++) {
                    var r = 100 + 200 * utilities.pnoise(i + this.idNumber);
                    var theta = 2 * Math.PI * i / sides;
                    var p = new Vector(this.center);
                    p.addPolar(r, theta);

                    this.points[i] = p;
                }
            },

            //==================================================
            //==================================================

            generate : function(universe) {
                this.generated = true;
                console.log("Generate " + this);

                var count = Math.random() * 4;
                for (var i = 0; i < count; i++) {
                    var r = 10 + 60 * Math.pow(i, .7);
                    var theta = 1.6 * Math.pow(i, .7);

                    var objType = universe.spawnTable.selectOne();
                    var obj = new objType();

                    obj.position.setTo(this.center);
                    obj.position.addPolar(r, theta);

                    universe.spawn(obj);
                }

            },

            //==================================================
            //==================================================

            setOwner : function(owner) {
                this.owner = owner;
            },

            // Check if p is in the region
            // Use universeView for drawing debug stuff
            contains : function(p, g, options) {
                var inRegion = false;
                for (var i = 0; i < this.points.length; i++) {
                    var current = this.points[i];
                    var next = this.points[(i + 1) % this.points.length];
                    var inTriangle = isInsideTriangle(this.center, current, next, p);
                    if (inTriangle) {
                        if (g !== undefined) {
                            g.fill(1);
                            options.universeView.drawShape(g, [this.center, current, next]);
                        }
                        inRegion = true;

                    }
                }
                if (inRegion && g !== undefined) {
                    this.idColor.fill(g, .2, -.5);

                    options.universeView.drawShape(g, this.points);
                }
                return inRegion;
            },

            createFromCell : function(cell) {

                // convert all the half edges into points.
                var region = this;
                this.points = [];
                $.each(cell.halfedges, function(index, halfEdge) {
                    var va = halfEdge.getStartpoint();
                    var vb = halfEdge.getEndpoint();

                    region.points.push(new Vector(va.x, va.y));
                    //   region.points.push(new Vector(vb.x, vb.y));
                });
            },
            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {

                g.noFill();

                this.idColor.stroke(g, .2, 1);
                g.strokeWeight(1);
                if (this.owner !== undefined) {
                    this.owner.idColor.fill(g, .2 + .2 * Math.sin(this.idNumber), -.6 + .2 * Math.sin(5 * this.idNumber));
                    this.owner.idColor.stroke(g, .2, 1);
                }
                if (stellarGame.touch.region === this) {
                    this.idColor.fill(g, .5, -.6);
                }
                //  g.noStroke();

                options.universeView.drawShape(g, this.points);

            },
            drawOverlay : function(g, options) {
                /*
                 this.idColor.fill(g, .5, .6);
                 g.noStroke();
                 g.ellipse(options.screenPos.x, options.screenPos.y, 10, 10);
                 g.text("Region " + this.idNumber, options.screenPos.x, options.screenPos.y);
                 */
            },
        });
        return Region;
    })();

});
