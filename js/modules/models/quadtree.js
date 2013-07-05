/**
 * @author Kate Compton
 */

// QuadTrees for partitioning space

define(["modules/models/vector", "inheritance"], function(Vector, Inheritance) {
    var quadrantCount = 0;
    var maxLevels = 4;
    var quadrantOffsets = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    var quadrantIndices = [[0, 1], [3, 2]];

    // Make the star class
    //  Extend the star
    var maxRadius = 500;
    var minRadius = maxRadius / (Math.pow(2, maxLevels - 1));
    console.log(minRadius);

    var QuadTree = Class.extend({

        init : function(parent, quadrant) {
            this.idNumber = quadrantCount;
            quadrantCount++;
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
            this.setBounds();

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

        insert : function(obj) {
            var p = obj;
            if (p.x === undefined)
                p = obj.position;

            var quadrant = this.getQuadrant(p, maxLevels, true);
            quadrant.contents.push(obj);
        },

        // Find all the quadrants that are bounded by this region
        // {center:VECTOR, w: NUM, h:NUM}

        getQuadrantsInRegion : function(region, quads, g) {
            if (quads === undefined)
                quads = [];

            if (g !== undefined && this.level === 0) {

                g.fill(.55, .3, 1, .2);
                g.rectMode(g.RADIUS);
                g.rect(region.center.x, region.center.y, region.w / 2, region.h / 2);

                g.fill(1, 1, 1);

                g.ellipse(region.center.x, region.center.y, 10, 10);
            }

            if (this.intersects(region)) {

                if (this.level === maxLevels) {
                    quads.push(this);
                    if (g)
                        this.draw(g, 5);
                } else {

                    if (this.children !== undefined) {
                        for (var i = 0; i < 4; i++) {
                            if (this.children[i] !== undefined) {
                                this.children[i].getQuadrantsInRegion(region, quads, g);
                            }
                        }
                    }
                }

            }

            return quads;
        },

        setBounds : function() {
            var radius = this.radius;

            this.left = this.center.x - radius;
            this.right = this.center.x + radius;
            this.top = this.center.y - radius;
            this.bottom = this.center.y + radius;

        },

        intersects : function(region) {

            return !(this.left > region.right || this.right < region.left || this.top > region.bottom || this.bottom < region.top);

        },

        //

        draw : function(g, weight) {
            g.rectMode(g.RADIUS);

            var h = (this.level * .231 + .1) % 1;
            g.strokeWeight(weight);
            g.stroke(h, 1, 1);
            g.noFill();
            var r = this.radius - this.level * .2;
            g.rect(this.center.x, this.center.y, r, r);
            g.text(this.idNumber, this.center.x - r + 3, this.center.y - r + 12);

        },

        drawTree : function(g) {
            g.rectMode(g.RADIUS);

            if (this.level === 0) {
                /*
                 this.getQuadrantsInRegion({
                 center : stellarGame.touch.lastHover,
                 w : 150,
                 h : 100
                 }, g);
                 */

            }
            g.strokeWeight(1);
            g.stroke(1, 0, 1);
            g.noFill();
            // g.fill(0, 0, 0, .1);

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

                g.fill((this.idNumber * .128) % 1, .4, 1);

                g.noStroke();
                g.text(this.contents.length, this.center.x - 5, this.center.y + 5);
                $.each(this.contents, function(index, item) {

                    item.position.drawCircle(g, 4);
                });
            }
        },
        update : function(time) {

        },

        toString : function() {
            return "q" + this.idNumber + " " + this.quadrant + " " + this.center + " (lvl " + this.level + ")";
        },
    });

    return QuadTree;

});
