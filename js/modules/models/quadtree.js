/**
 * @author Kate Compton
 */

// QuadTrees for partitioning space

define(["modules/models/vector", "inheritance"], function(Vector, Inheritance) {
    var quadrantCount = 0;
    var maxLevels = 6;
    var quadrantOffsets = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    var quadrantIndices = [[0, 1], [3, 2]];

    // Make the star class
    //  Extend the star
    var maxRadius = 15000;
    var minRadius = maxRadius / (Math.pow(2, maxLevels - 1));

    var QuadTree = Class.extend({

        init : function(parent, quadrant) {
            this.idNumber = quadrantCount;
            quadrantCount++;
            if (parent === undefined) {

                this.root = this;
                this.radius = maxRadius;
                this.level = 0;

                this.quadrant = -1;
                this.center = new Vector(0, 0);
            } else {
                this.root = parent.root;
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
            if (this.isLeaf()) {
                this.contents = [];
            } else {
            }

        },

        isLeaf : function() {
            return this.level >= maxLevels;
        },
        createChild : function(quadrant) {
            this.children[quadrant] = new QuadTree(this, quadrant);

        },
        remove : function(p) {
            // Whenever this gets implemented
            stellarGame.statistics.numItemsInQuadTree--;
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

            stellarGame.statistics.numItemsInQuadTree++;
        },
        setBounds : function() {
            var radius = this.radius;

            this.left = this.center.x - radius;
            this.right = this.center.x + radius;
            this.top = this.center.y - radius;
            this.bottom = this.center.y + radius;

            var border = 6 * this.level;
            this.corners = [new Vector(this.left + border, this.top + border), new Vector(this.right - border, this.top + border), new Vector(this.right - border, this.bottom - border), new Vector(this.left + border, this.bottom - border)];
            this.screenPosCorners = [new Vector(), new Vector(), new Vector(), new Vector()];
        },
        containsPoint : function(p) {
            return (p.x >= this.left && p.x <= this.right) && (p.y >= this.top && p.y <= this.bottom);
        },

        compileOnscreenQuadrants : function(onScreenQuads, universeView) {
            if (this.isOnScreen(universeView)) {
                if (this.isLeaf())
                    onScreenQuads.push(this);
                else if (this.children !== undefined) {
                    $.each(this.children, function(index, child) {
                        if (child !== undefined)
                            child.compileOnscreenQuadrants(onScreenQuads, universeView);
                    });
                }

            }
        },

        isOnScreen : function(universeView) {

            // If any of the corners are inside the screenQuad,
            //  or any of the screenQuad corners are within this
            // then they overlap.

            // Check whether this quad's corners are in the screenQuad
            // Convert all these corners to screen position, and if any are on screen, return true
            var screenPos = new Vector();
            for (var i = 0; i < 4; i++) {
                universeView.convertToScreenPosition(this.corners[i], screenPos);
                if (universeView.isOnScreen(screenPos))
                    return true;
            }

            // Check whether any of the screen quad's (planar) corners are in here
            // If so, return true
            for (var i = 0; i < 4; i++) {
                var corner = universeView.camera.screenQuadCorners[i];
                if (this.containsPoint(corner))
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
            if (this.isOnScreen(options.universeView)) {
                g.strokeWeight(4);

            }

            g.stroke(h, 1, 1);
            g.noFill();
            var r = this.radius - this.level * .2;
            options.universeView.drawShape(g, this.corners);
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
            var quad = this;
            if (this.level === maxLevels) {

                // If any object does not belong in here, put it in the correct one
                var incorrectlyPlaced = [];
                this.contents = _.reject(this.contents, function(obj) {
                    if (!quad.containsPoint(obj.position)) {

                        incorrectlyPlaced.push(obj);

                        return true;
                    }
                    return obj.deleted;
                    //return false;
                });

                if (incorrectlyPlaced.length > 0) {

                    $.each(incorrectlyPlaced, function(index, obj) {
                        quad.root.insert(obj);
                    });
                }

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
