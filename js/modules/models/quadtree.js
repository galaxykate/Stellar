/**
 * @author Kate Compton
 */

// QuadTrees for partitioning space

define(["modules/models/vector", "inheritance"], function(Vector, Inheritance) {
    var quadrantCount = 0;
    var maxLevels = 5;
    var quadrantOffsets = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    var quadrantIndices = [[0, 1], [3, 2]];

    // Make the star class
    //  Extend the star
    var maxRadius = 3000;
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

            var border = 6 * this.level;
            this.corners = [new Vector(this.left + border, this.top + border), new Vector(this.right - border, this.top + border), new Vector(this.right - border, this.bottom - border), new Vector(this.left + border, this.bottom - border)];

        },

        inCameraView : function(camera) {
            // Get angles to all the corners

            for (var i = 0; i < 4; i++) {
                // determine whether this corner is within the sweep of the camera
                var corner = this.corners[i];
                var offset = camera.orbitPosition.getOffsetTo(corner);
                var angle = offset.getAngle() - camera.orbitTheta;

                angle = (angle % (2 * Math.PI) + 10 * Math.PI) % (2 * Math.PI);
                this.angle = angle;
                var sweep = .3;
                var centerAngle = Math.PI;
                if (angle < centerAngle + sweep && angle > centerAngle - sweep)
                    return true;
            }

            return false;
        },

        intersects : function(region) {

            return !(this.left > region.right || this.right < region.left || this.top > region.bottom || this.bottom < region.top);

        },

        //

        draw : function(g, options) {
            g.rectMode(g.RADIUS);

            var h = (this.level * .231 + .1) % 1;
            g.strokeWeight(1);
            if (this.inCameraView(options.camera)) {
                g.strokeWeight(4);

            }

            g.stroke(h, 1, 1);
            g.noFill();
            var r = this.radius - this.level * .2;
            options.drawShape(g, this.corners);
            //  options.drawText(g, this.angle, this.center, 0, 0);

        },

        drawTree : function(g, options) {
            var h = (this.level * .231 + .1) % 1;
            var r = this.radius - this.level * 2;
            this.draw(g, options);

            if (this.children !== undefined) {
                for (var i = 0; i < 4; i++) {
                    if (this.children[i] !== undefined)
                        this.children[i].drawTree(g, options);
                }
            }

            if (this.contents !== undefined) {
                /*
                 g.fill((this.idNumber * .128) % 1, .4, 1);

                 g.noStroke();
                 g.text(this.contents.length, this.center.x - 5, this.center.y + 5);
                 $.each(this.contents, function(index, item) {

                 item.position.drawCircle(g, 4);
                 });
                 */
            }
        },

        cleanup : function() {
            if (this.level === maxLevels) {

                this.contents = _.reject(this.contents, function(obj) {
                    return obj.deleted;
                    //return false;
                });

            } else {
                if (this.children !== undefined) {
                    for (var i = 0; i < 4; i++) {
                        if (this.children[i] !== undefined) {
                            this.children[i].cleanup();
                        }
                    }
                }
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
