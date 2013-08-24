/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/vector", "kcolor", "quadtree", "particleTypes", 'modules/models/ui/uiManager', 'voronoi', 'chanceTable'], function(Vector, KColor, QuadTree, particleTypes, uiManager, Voronoi, ChanceTable) {
    var backgroundLayers = 3;
    var initialUpdate = true;
    var backgroundStarDensity = 40;
    var Universe = Class.extend({
        init : function() {
            backgroundStars = [];

            stellarGame.player.idColor = new KColor(Math.random(), 1, 1);
            this.spawnTable = new ChanceTable();
            this.spawnTable.addOption(particleTypes.Star, "star", 1);

            this.touchMarker = new particleTypes.UParticle();
            this.touchMarker.name = "Touch Marker";
            this.touchMarker.drawMain = function(context) {
                var g = context.g;
                g.fill(.55, 1, 1);
                g.noStroke();
                g.ellipse(0, 0, 20, 20);
                g.stroke(.55, 1, 1);
                g.strokeWeight(1);
                g.noFill();
                g.ellipse(0, 0, 50, 50);
            };

            this.makeBackgroundStars();
            this.makeUniverseTree();
            this.generateStartRegion();

            this.camera = new particleTypes.Camera();
            this.spawn(this.camera);

            //      this.spawn(this.touchMarker);
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

        drawBackgroundStars : function(context) {
            g = context.g;
            var t = stellarGame.time.universeTime;
            g.noStroke();
            for (var i = 0; i < backgroundLayers; i++) {
                //utilities.debugOutput("BG Stars: " + backgroundStars[i].length);

                for (var j = 0; j < backgroundStars[i].length; j++) {
                    var camera = context.universeView.camera;
                    var scale = 4000 * camera.zoom / (camera.zoom + z);

                    var x = backgroundStars[i][j][0] - .01 * camera.position.y;
                    var y = backgroundStars[i][j][1] - .01 * camera.position.x * Math.sin(camera.orbitPhi);
                    var z = backgroundStars[i][j][2] + Math.pow(4 - i, 2) * 2000 + 4000;

                    var loopBoxWidth = 100;
                    var loopBoxHeight = 100;

                    x = ((x % loopBoxWidth) + loopBoxWidth) % loopBoxWidth - loopBoxWidth / 2;
                    y = ((y % loopBoxHeight) + loopBoxHeight) % loopBoxHeight - loopBoxHeight / 2;
                    // center the stars around 0, 0

                    var color = backgroundStars[i][j][4];

                    // Offset the position
                    x /= scale;
                    y /= scale;

                    var r = backgroundStars[i][j][3] * .02 / scale + 7;

                    /*x -= camera.angle.x * parallax;
                    y -= camera.angle.y * parallax;
                    x -= camera.center.x * parallax;
                    y -= camera.center.y * parallax;
                    */

                    //g.fill((.1 + .0032 * z) % 1, 1, 1);
                    //   color.fill(g, 0, -.8);
                    //  g.ellipse(x, y, r, r);
                    // g.text(scale, x + r, y + r);
                    //g.text(scale, x + r, y + r);
                    var brighten = Math.sin(10 * t + j);
                    r *= (1 + .2 * brighten);
                    g.noStroke();
                    g.fill(1, 0, 1, 1 - i * .3 + .3 * brighten);
                    g.ellipse(x, y, r * .1, r * .1);

                }
            }

            g.fill(1, 0, 1, .3);

        },

        generateOffscreen : function() {

        },

        // Draw the universes background
        // May be camera-dependent, eventually
        draw : function(context) {

            if (context.layer === 'bg') {
                this.drawBackgroundStars(context);
            }

            if (context.layer === 'overlay') {
                if (stellarGame.options.drawQuadTree) {
                    this.quadTree.drawTree(context);
                }
            }

        },

        //=======================================================
        //=======================================================
        //=======================================================
        // Updateing
        update : function(time, activeObjects) {

            var universe = this;
            // Use the current tool

            stellarGame.time.universeTime = time.total;
            stellarGame.time.updateCount++;

            // Get all the active objects that are regions
            this.activeRegions = _.filter(activeObjects, function(obj) {
                return obj.isRegion;
            });

            if (initialUpdate) {
                // create some territory
                $.each(this.activeRegions, function(index, region) {

                    region.setOwner(stellarGame.player);
                });
            }

            // If a region is on screen, but not generated, generate (aka fill) it
            $.each(this.activeRegions, function(index, region) {
                if (!region.generated) {
                    region.generate(universe);
                }
            });

            // update the touch object
            stellarGame.touch.update();

            // Does the activeObjects list contain the camera?
            var cameraActive = $.inArray(this.camera, activeObjects);
            utilities.debugOutput("Camera active " + cameraActive);
            if (cameraActive < 0)
                activeObjects.push(this.camera);

            // Update the stars' evolutions at the current speed
            // Need beginUpdate to happen first so that a star's temperature is calculated
            if (stellarGame.options.simStarEvolution) {
                $.each(activeObjects, function(index, obj) {
                    if (obj.updateStarEvolution)
                        obj.updateStarEvolution(time);
                });
            }

            // Update all the particle physics
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

            uiManager.update();

            // Remove dead object, replace misplaced ones, etc
            this.quadTree.cleanup();

            initialUpdate = false;
        },

        //=======================================================
        //=======================================================
        //=======================================================
        // Generating regions
        generateStartRegion : function() {
            // Make lots of region centers
            var universe = this;
            universe.regions = [];
            universe.regionCenters = [];
            var count = 10;
            var spacing = 400;
            for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {
                    var wiggleX = spacing * 1 * Math.sin(i + j + Math.random(30));
                    var wiggleY = spacing * 1 * Math.sin(i + j + 10 + Math.random(30));
                    var center = new Vector((i - count / 2) * spacing + wiggleX, (j - count / 2) * spacing + wiggleY);
                    var region = new particleTypes.Region(center);
                    universe.spawn(region);
                    universe.regions.push(region);
                }
            }
            $.each(universe.regions, function(index, region) {
                universe.regionCenters[index] = region.center;
            });

            var r = 80000;
            var voronoi = new Voronoi();
            var bbox = {
                xl : -r,
                xr : r,
                yt : -r,
                yb : r
            };

            var diagram = voronoi.compute(universe.regionCenters, bbox);

            // divvy the cells' edges into the correct regions
            $.each(universe.regions, function(index, region) {
                var voronoiId = region.center.voronoiId;
                var cell = diagram.cells[voronoiId];

                region.createFromCell(cell);
            });

        },

        // Is this region on screen for the first time?
        generateRegion : function(region) {

            // Pick some random locations in the region
            var density = .006;
            var count = Math.ceil(region.w * region.h * density * density);
            var w2 = region.w / 2;
            var h2 = region.h / 2;
            var p = new Vector();

            var particles = [];
            for (var i = 0; i < count; i++) {

                p.setTo(utilities.random(-w2, w2) + region.center.x, utilities.random(-h2, h2) + region.center.y);

                //obj = new particleTypes.UParticle();
                if (settings.user == "") {

                } else {
                    var obj;
                    if (Math.random() > .8) {
                        obj = new particleTypes.Trailhead();
                    } else if (Math.random() > .2) {
                        obj = new particleTypes.Star();
                    }
                    //else {
                    //  obj = new particleTypes.Critter();
                    //}

                    obj.position.setTo(p);
                    this.spawn(obj);
                }
            }

            //Spawn springs
            /*
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

        getRegion : function(p) {
            var universe = this;
            var region = _.find(this.activeRegions, function(region) {
                return region.contains(p);
            });
            return region;
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

            this.camera.velocity.addMultiple(v, 1);
            utilities.touchOutput("Camera Velocity: " + this.camera.velocity);

        },
    });

    return Universe;

});
