/**
 * @author Kate Compton
 */

// QuadTrees for partitioning space

define(["modules/models/vector", "inheritance"], function(Vector, Inheritance) {

    var maxLevels = 4;
    var quadrantOffsets = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    var quadrantIndices = [[0, 1], [3, 2]];
    // Make the star class
    //  Extend the star
    var maxRadius = 200;
    var minRadius = maxRadius / (Math.pow(2, maxLevels));

    var QuadTree = Class.extend({

        init : function(parent, quadrant) {
            if (parent === undefined) {
                this.radius = maxRadius;
                this.level = 0;
                this.quadrant = -1;
                this.center = new Vector(0, 0);
            } else {

                this.parent = parent;
                this.radius = parent.radius / 2;
                this.level = parent.level + 1;
                this.quadrant = quadrant;
                this.center = new Vector(parent.center);
                this.center.x += this.radius * quadrantOffsets[this.quadrant][0];
                this.center.y += this.radius * quadrantOffsets[this.quadrant][1];
            }

            this.children = [];
            if (this.level < maxLevels) {
                //this.createChildren();
            } else {
                this.contents = [];
            }

        },

        createChild : function(quadrant) {
            this.children[quadrant] = new QuadTree(this, quadrant);

        },

        remove : function(p) {

        },

        getQuadrantIndex : function(p) {
            // Get the quadrant
            var dx = p.x - this.center.x;
            var dy = p.y - this.center.y;
            var theta = Math.atan2(dy, dx);

            var qx = 0;
            if (dx > 0)
                qx = 1;
            var qy = 0;
            if (dy > 0)
                qy = 1;

            var q = quadrantIndices[qy][qx];
            return q;
        },

        getQuadrant : function(p, depth, createIfNonexistent) {

            if (depth === undefined)
                depth = maxLevels;

            // console.log(this.level + "/" + depth + ": " + p);
            var quadrant = this.getQuadrantIndex(p);

            // If this is the final level, return it
            if (this.level >= depth)
                return this;

            // If this child doesnt exist and we need to create it, do so
            if (this.children[quadrant] === undefined && createIfNonexistent) {
                this.createChild(quadrant);
            }

            if (this.children[quadrant] !== undefined)
                return this.children[quadrant].getQuadrant(p, depth, createIfNonexistent);
            else
                return undefined;

        },

        insert : function(p) {
            var quadrant = this.getQuadrant(p, maxLevels, true);
            quadrant.contents.push(p);
        },

        getQuadrantsInRange : function(center, width, height, g) {
            var quads = [];

            g.fill(1, 1, 1);
            g.ellipse(center.x, center.y, 10, 10);
            // make points
            var xCount = Math.floor(width / minRadius);
            var yCount = Math.floor(height / minRadius);
            var p = new Vector(0, 0);

            for (var i = 0; i < xCount; i++) {
                var xPct = 0;
                if (xCount > 1)
                    xPct = i / (xCount - 1);

                var x = center.x + (xPct - .5) * minRadius * xCount;
                for (var j = 0; j < yCount; j++) {

                    var yPct = 0;
                    if (yCount > 1)
                        yPct = j / (yCount - 1);

                    var y = center.y + (yPct - .5) * minRadius * yCount;
                    //utilities.debugOutput(x + " " + y);
                    g.noStroke();
                    g.fill(.55, 1, 1);
                    g.ellipse(x, y, 5, 5);
                    p.setTo(x, y);
                    var quadrant = this.getQuadrant(p, maxLevels, false);
                    if (quadrant !== undefined)
                        quadrant.draw(g, 3);
                }
            }
        },

        //

        draw : function(g, weight) {
            var h = (this.level * .231 + .1) % 1;
            g.strokeWeight(weight);
            g.stroke(h, 1, 1);
            var r = this.radius - this.level * 2;
            g.rect(this.center.x - r, this.center.y - r, r * 2, r * 2);

        },

        drawTree : function(g) {
            if (this.level === 0) {
                utilities.debugOutput(this.level);

                this.getQuadrantsInRange(stellarGame.touch.lastHover, 150, 100, g);
            }
            g.strokeWeight(1);
            g.stroke(1, 0, 1);
            g.fill(0, 0, 0, .1);
            var h = (this.level * .231 + .1) % 1;
            var r = this.radius - this.level * 2;
            this.draw(g, 1);
            if (this.children !== undefined) {
                for (var i = 0; i < 4; i++) {
                    if (this.children[i] !== undefined)
                        this.children[i].drawTree(g);
                }
            }

            if (this.contents !== undefined) {

                g.fill(h, .4, 1);

                g.text(this.contents.length, this.center.x - 5, this.center.y + 5);
            }
        },
        update : function(time) {

        }
    });

    return QuadTree;

});
