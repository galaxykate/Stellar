/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/vector", "kcolor", "quadtree", "particleTypes"], function(Vector, KColor, QuadTree, particleTypes) {
    var backgroundLayers = 3;
    var backgroundStarDensity = .03;
    var Universe = Class.extend({
        init : function() {
            backgroundStars = [];

            this.touchCenter = new particleTypes.UParticle();
            this.drawMain = function(g, options) {
                g.fill(.55, 1, 1);
                g.noStroke();
                g.ellipse(0, 0, 50, 50);
            }

            this.camera = {
                angle : new Vector(0, 0, 0),
                center : new particleTypes.UParticle(),
                zoom : 1,
                rotation : -Math.PI,
            }

            this.camera.center.drawUntransformed = true;
            this.camera.center.drawMain = function(g, options) {
                g.noFill();
                g.strokeWeight(1);
                g.stroke(.55, 1, 1);
                g.ellipse(0, 0, 50, 50);

                var segments = 12;
                var points = [];
                for (var i = 0; i < segments; i++) {
                    points[i] = new Vector(this.position);
                    points[i].addPolar(30, i * 2 * Math.PI / segments);
                }
                options.universeView.drawShape(g, points);
            };

            this.makeBackgroundStars();
            this.makeUniverseTree();
            this.generateStartRegion();
            this.spawn(this.camera.center);
            this.spawn(this.touchCenter);
        },

        // Make a quad tree for the universe
        makeUniverseTree : function() {
            var r = 200;
            this.quadTree = new QuadTree();
            for (var i = 0; i < 0; i++) {
                quadTree.insert(new Vector((Math.random() - .5) * 400, (Math.random() - .5) * 400));
            }
        },

        // These stars loop

        makeBackgroundStars : function() {
            for (var i = 0; i < backgroundLayers; i++) {
                backgroundStars[i] = [];
                var starCount = backgroundStarDensity * (backgroundLayers - i);
                stellarGame.statistics.bgStarCount += starCount;

                for (var j = 0; j < starCount; j++) {
                    var color = new KColor(Math.random(), 1, 1);
                    backgroundStars[i][j] = [utilities.random(-12000, 12000), utilities.random(-12000, 12000), utilities.random(0, 10), 5, color];
                }
            }
        },

        drawBackgroundStars : function(g) {

            g.noStroke();
            for (var i = 0; i < backgroundLayers; i++) {

                for (var j = 0; j < backgroundStars[i].length; j++) {

                    var x = backgroundStars[i][j][0] - camera.center.x;
                    var y = backgroundStars[i][j][1] - camera.center.y;
                    var z = backgroundStars[i][j][2] + Math.pow(4 - i, 2) * 200 + 100;
                    var scale = camera.zoom / (camera.zoom + z);

                    var loopBoxWidth = 300;
                    var loopBoxHeight = 200;

                    x = ((x % loopBoxWidth) + loopBoxWidth) % loopBoxWidth - loopBoxWidth / 2;
                    y = ((y % loopBoxHeight) + loopBoxHeight) % loopBoxHeight - loopBoxHeight / 2;
                    // center the stars around 0, 0

                    var color = backgroundStars[i][j][4];

                    // Offset the position
                    /*
                     x *= scale;
                     y *= scale;
                     */
                    var r = backgroundStars[i][j][3] * 10 / (z + camera.zoom);

                    /*x -= camera.angle.x * parallax;
                     y -= camera.angle.y * parallax;
                     x -= camera.center.x * parallax;
                     y -= camera.center.y * parallax;
                     */

                    g.fill((.1 + .0032 * z) % 1, 1, 1);
                    //color.fill(, 0, -.8);
                    g.ellipse(x, y, r, r);
                    g.text(scale, x + r, y + r);
                    g.text(scale, x + r, y + r);
                    //  g.fill(1, 0, 1);
                    // g.ellipse(x, y, r * .1 + 1, r * .1 + 1);

                }
            }

            g.fill(1, 0, 1, .3);

        },

        generateOffscreen : function() {

        },

        // Draw the universes background
        // May be camera-dependent, eventually
        draw : function(g, options) {

            if (options.layer === 'bg') {
                // drawBackgroundStars(g);
            }

            if (options.layer === 'overlay') {
                g.pushMatrix();
                //this.quadTree.drawTree(g, options);
                g.popMatrix();
            }

        },

        //=======================================================
        //=======================================================
        //=======================================================
        // Updateing
        update : function(time, activeObjects) {
            $.each(activeObjects, function(index, obj) {
                obj.beginUpdate(time);
            });

            $.each(activeObjects, function(index, obj) {
                obj.addForces(time);
            });

            $.each(activeObjects, function(index, obj) {
                obj.updatePosition(time);
            });

            $.each(activeObjects, function(index, obj) {
                obj.finishUpdate(time);
            });
        },

        //=======================================================
        //=======================================================
        //=======================================================
        // Generating regions
        generateStartRegion : function() {
            this.generateRegion({
                center : new Vector(0, 0, 0),
                w : 8000,
                h : 7500
            });
        },
        generateRegion : function(region) {

            // Pick some random locations in the region
            var density = .009;
            var count = Math.ceil(region.w * region.h * density * density);
            var w2 = region.w / 2;
            var h2 = region.h / 2;
            var p = new Vector();

            var particles = [];
            for (var i = 0; i < count; i++) {

                p.setTo(utilities.random(-w2, w2) + region.center.x, utilities.random(-h2, h2) + region.center.y);

                var obj = new particleTypes.Star();

                particles.push(obj);
                obj.position.setTo(p);

                this.spawn(obj);
            }

            /*
             //Spawn springs

             for (var i = 0; i < count; i++) {
             var offset = Math.ceil(Math.random() * (count - 1));
             var offset2 = Math.ceil(Math.random() * (count - 1));
             var p0 = particles[i];
             var p1 = particles[(i + offset) % particles.length];
             var p2 = particles[(i + offset2) % particles.length];
             var spring = new particleTypes.Spring(p0, p1);
             var spring2 = new particleTypes.Spring(p0, p2);

             spawn(spring);
             spawn(spring2);
             }
             */

        },
        spawn : function(object) {
            this.quadTree.insert(object);
        },
        initStatistics : function() {
            stellarGame.statistics.numberOfTrails = 0;
            stellarGame.statistics.numberOfStars = 0;
            stellarGame.statistics.numberOfCritters = 0;
            stellarGame.statistics.numberOfDust = 0;
            stellarGame.statistics.bgStarCount = 0;
            stellarGame.statistics.numberofSparkles = 0;
        },
        getQuadrantsInRegion : function(region, quads, g) {
            return quadTree.getQuadrantsInRegion(region, quads, g);
        },
        addScrollingMovement : function(v) {
            this.camera.center.velocity.addMultiple(v, 1);

        },
    });

    return Universe;

});
