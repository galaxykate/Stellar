/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/vector", "kcolor", "quadtree", "particleTypes", 'modules/models/ui/uiManager', 'voronoi', 'chanceTable', 'modules/models/quests/questManager'], function(Vector, KColor, QuadTree, particleTypes, uiManager, Voronoi, ChanceTable, QuestManager) {
    var backgroundLayers = 3;
    var initialUpdate = true;
    var backgroundStarDensity = 40;
    var Universe = Class.extend({
        init : function() {
            backgroundStars = [];

            stellarGame.universe = this;

            this.spawnTable = new ChanceTable();
            this.spawnTable.addOption(particleTypes.Star, "star", 1);
            //  this.spawnTable.addOption(particleTypes.Critter, "critter", 1);

            this.touchMarker = new particleTypes.UParticle();
            this.touchMarker.name = "Touch Marker";
            this.touchMarker.drawMain = function(context) {
                if (stellarGame.options.drawTouchMarker) {
                    var g = context.g;
                    g.fill(.55, 1, 1);
                    g.noStroke();
                    g.ellipse(0, 0, 120, 120);
                    g.stroke(.55, 1, 1);
                    g.strokeWeight(1);
                    g.noFill();
                    g.ellipse(0, 0, 150, 150);
                }
            };

            this.makeBackgroundStars();
            this.makeUniverseTree();
            this.generateStartRegions();

            this.startStar = new particleTypes.Star2();
            this.startStar.name = "Sol";
            this.startStar.position.setTo(0, 0);
            this.spawn(this.startStar);

            this.camera = new particleTypes.Camera();
            this.spawn(this.camera);

            this.spawn(this.touchMarker);
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
        // Updating
        update : function(time, activeObjects) {

            var universe = this;
            this.activeObjects = activeObjects;
            // Use the current tool

            stellarGame.time.universeTime = time.total;
            stellarGame.time.updateCount++;
            debug.output("Touched: ");
            debug.outputArray(stellarGame.touch.overObjects);

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
            if (cameraActive < 0)
                this.activeObjects.push(this.camera);

            this.updatePhysics(time);
            this.updateSimulation(time);

            uiManager.update();
            QuestManager.update();

            this.cleanup();
        },

        // Activate some function for all the active objects
        applyToActiveObjects : function(fxn, arg) {
            $.each(this.activeObjects, function(index, obj) {
                if (obj[fxn] !== undefined)
                    obj[fxn](arg);
            })
        },

        updatePhysics : function(time) {

            // Update all the particle physics

            this.applyToActiveObjects("beginUpdate", time);
            this.applyToActiveObjects("addForces", time);
            this.applyToActiveObjects("updatePosition", time);
            this.applyToActiveObjects("finishUpdate", time);

        },

        updateSimulation : function(time) {
            this.applyToActiveObjects("updateSimulation", time);

        },

        cleanup : function(time) {
            // Remove dead object, replace misplaced ones, etc
            this.quadTree.cleanup();
            this.applyToActiveObjects("cleanup", time);

            initialUpdate = false;
        },

        //=======================================================
        //=======================================================
        //=======================================================
        // Generating regions
        generateStartRegions : function() {
            var startRegionDistance = 10000;
            // Make lots of region centers
            var universe = this;
            universe.regions = [];
            universe.regionCenters = [];
            var count = 10;
            var spacing = 700;
            for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {
                    var wiggleX = spacing * 1 * Math.sin(i + j + Math.random(30));
                    var wiggleY = spacing * 1 * Math.sin(i + j + 10 + Math.random(30));

                    var center = new Vector((i - count / 2) * spacing + wiggleX, (j - count / 2) * spacing + wiggleY);

                    var region = new particleTypes.Region(center);
                    universe.spawn(region);
                    universe.regions.push(region);
                    if (center.magnitude() < startRegionDistance) {
                        this.startRegion = region;
                        region.isStartRegion = true;
                        startRegionDistance = center.magnitude();
                    }
                }
            }

            // Set the region center
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
        },
    });

    return Universe;

});
