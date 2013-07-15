/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/vector", "kcolor", "quadtree", "particleTypes"], function(Vector, KColor, QuadTree, particleTypes) {

    return (function() {

        var backgroundStars = [];
        var backgroundLayers = 3;
        var backgroundStarDensity = 10;

        var camera;

        var quadTree;

        var toAdd = [];

        function makeUniverseTree() {
            console.log("Make universe tree");
            var r = 200;
            quadTree = new QuadTree();
            console.log(quadTree);
            for (var i = 0; i < 0; i++) {
                quadTree.insert(new Vector((Math.random() - .5) * 400, (Math.random() - .5) * 400));
            }

        };

        // These stars loop
        function makeBackgroundStars() {

            for (var i = 0; i < backgroundLayers; i++) {
                backgroundStars[i] = [];
                var starCount = backgroundStarDensity * (backgroundLayers - i);
                for (var j = 0; j < starCount; j++) {
                    var color = new KColor(Math.random(), 1, 1);
                    backgroundStars[i][j] = [Math.random() * 800, Math.random() * 800, Math.random() * .2, Math.random() * 10 + 2, color];
                }
            }
            console.log("made background stars");
        };

        function drawBackgroundStars(g) {
            var cameraPosition
            g.noStroke();
            for (var i = 0; i < backgroundLayers; i++) {

                for (var j = 0; j < backgroundStars[i].length; j++) {

                    var x = backgroundStars[i][j][0];
                    var y = backgroundStars[i][j][1];
                    var r = backgroundStars[i][j][3];
                    var color = backgroundStars[i][j][4];

                    // Offset the position
                    var z = i + 5 + backgroundStars[i][j][2];
                    r *= .2 * i * Math.pow(z, .5);
                    var parallax = .1 * (z + .01);
                    x -= camera.angle.x * parallax;
                    y -= camera.angle.y * parallax;
                    x -= camera.center.x * parallax;
                    y -= camera.center.y * parallax;

                    // loop around the edges
                    x = (x % g.width);
                    y = (y % g.height);
                    if (x < 0)
                        x += g.width;
                    if (y < 0)
                        y += g.height;
                    x -= g.width / 2;
                    y -= g.height / 2;

                    //  g.fill(.1 + .32 * i, .5, 1, .3);
                    color.fill(g, 0, -.8);
                    g.ellipse(x, y, r, r);
                    g.fill(1, 0, 1);
                    g.ellipse(x, y, r * .1 + 1, r * .1 + 1);

                }
            }

            g.fill(1, 0, 1, .3);

        };

        // Draw the universes background
        // May be camera-dependent, eventually
        function draw(g, options) {

            if (options.layer === 'bg') {
                //  drawBackgroundStars(g);
            }

            if (options.layer === 'overlay') {
                g.pushMatrix();
                g.translate(-camera.center.x, -camera.center.y);
                //  quadTree.drawTree(g);
                g.popMatrix();
            }

        }

        function generateStartRegion() {
            generateRegion({
                center : camera.center,
                w : 3000,
                h : 1500
            });
        };

        function generateOffscreen() {

        }

        function generateRegion(region) {

            console.log("GENERATE REGION");
            // Pick some random locations in the region
            var density = .005;
            var count = Math.ceil(region.w * region.h * density * density);
            console.log(count);
            var w2 = region.w / 2;
            var h2 = region.h / 2;
            var p = new Vector();

            var particles = [];
            for (var i = 0; i < count; i++) {
                p.setTo(utilities.random(-w2, w2) + region.center.x, utilities.random(-h2, h2) + region.center.y);

                var obj = new particleTypes.Star();

                particles.push(obj);

                obj.position.setTo(p);

                spawn(obj);
            }

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

        }

        function spawn(object) {
            toAdd.push(object);
            quadTree.insert(object);
        }

        function update(time, activeObjects) {
            stellarGame.time.universeTime = time.total;

            var theta = 10 * Math.sin(.01 * time.total);
            camera.center.addMultiple(camera.scrollingMovement, time.ellapsed);
            camera.scrollingMovement.mult(.98);
            utilities.debugOutput("LastAction:" + stellarGame.touch.lastAction);
            utilities.debugOutput(stellarGame.touch.lastActionOutput);

            utilities.debugOutput("Camera center: " + camera.center);
            utilities.debugOutput("Current tool: " + stellarGame.touch.activeTool);

            // begin the update on all active objects
            //  Zero out the forces

            $.each(activeObjects, function(index, obj) {
                obj.beginUpdate(time);
            });

            //  Add all the spring forces and gravity
            $.each(activeObjects, function(index, obj) {
                obj.addForces(time);
            });

            // Change the velocity and position
            $.each(activeObjects, function(index, obj) {
                obj.updatePosition(time);
            });

            // Finish the update on all active objects
            //   Ease springs
            $.each(activeObjects, function(index, obj) {
                obj.finishUpdate(time);
            });

            // Verify that objects are in the correct quadrant
            // Remove objects that should be removed
            quadTree.cleanup();
        };

        function getQuadrantsInRegion(region, quads, g) {
            return quadTree.getQuadrantsInRegion(region, quads, g);
        };

        function init() {
            console.log("INIT UNIVERSE");

            camera = {
                angle : new Vector(0, 0, 0),
                center : new Vector(0, 0, 0),
                zoom : 1,
                scrollingMovement : new Vector(20, 0, 0),

            };

            makeBackgroundStars();
            makeUniverseTree();
            generateStartRegion();
        };

        function getCamera() {
            console.log(camera);
            return camera;
        }

        function addScrollingMovement(v) {
            camera.scrollingMovement.addMultiple(v, 1);

        }

        return {
            getQuadrantsInRegion : getQuadrantsInRegion,
            draw : draw,
            spawn : spawn,
            update : update,
            getCamera : getCamera,
            addScrollingMovement : addScrollingMovement,
            init : init,
        };

    })();

});
