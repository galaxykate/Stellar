/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/star", "modules/models/dust", "modules/models/vector", "modules/models/kcolor", "quadtree", "modules/models/uparticle"], function(Star, Dust, Vector, KColor, QuadTree, UParticle) {

    return (function() {

        var backgroundStars = [];
        var backgroundLayers = 3;
        var backgroundStarDensity = 10;
        var camera = {
            angle : new Vector(0, 0, 0),
            center : new Vector(0, 0, 0),
            zoom : 1,

        };
        var gestureDir = new Vector(0, 0, 0);

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
                drawBackgroundStars(g);
            }

            if (options.layer === 'overlay') {
                g.pushMatrix();
                g.translate(-camera.center.x, -camera.center.y);
                // quadTree.drawTree(g);
                g.popMatrix();
            }

        }

        function generateStartRegion() {
            generateRegion({
                center : camera.center,
                w : 3000,
                h : 2000
            });
        };

        function generateOffscreen() {

        }

        function generateRegion(region) {

            console.log("GENERATE REGION");
            // Pick some random locations in the region
            var density = .004;
            var count = Math.ceil(region.w * region.h * density * density);
            console.log(count);
            var w2 = region.w / 2;
            var h2 = region.h / 2;
            var p = new Vector();
            for (var i = 0; i < count; i++) {
                p.setTo(utilities.random(-w2, w2) + region.center.x, utilities.random(-h2, h2) + region.center.y);

                var obj;
                if (Math.random() > .5)
                    obj = new UParticle();
                else
                    obj = new Star.Star();
                obj.position.setTo(p);
                spawn(obj);
            }

        }

        function spawn(object) {
            toAdd.push(object);
            quadTree.insert(object);
        }

        function update(time) {
            stellarGame.time.universeTime = time.total;

            var theta = 10 * Math.sin(.01 * time.total);
            if (time.total > .1 && gestureDir !== undefined) {

                // cameraCenter.x += 1 * Math.cos(theta);
                //cameraCenter.y += 1 * Math.sin(theta);

                camera.center.addMultiple(gestureDir, .1);
                utilities.debugOutput("Center: " + camera.center);
                gestureDir.mult(.99);
                //  cameraAngle.mult(.9);
            }
            if (stellarGame.touch !== undefined) {
                utilities.debugOutput("Camera center: " + camera.center);
                utilities.debugOutput("Current tool: " + stellarGame.touch.activeTool); 
            }

            if (time.ellapsed !== undefined) {
                var updateables = quadTree.getContentsInRegion({
                    center : camera.center,
                    w : 300,
                    h : 200
                });

                $.each(updateables, function(index, obj) {
                    obj.update(time);
                });
            }

        };

        function gestureUpdate(gesture) {
            if (gesture.dragOffset !== undefined) {
                gestureDir.x += gesture.dragOffset.x * .01;
                gestureDir.y += gesture.dragOffset.y * .01;

            }
        };

        makeBackgroundStars();
        makeUniverseTree();
        generateStartRegion();

        update(1);

        return {
            // public interface

            getDrawableObjects : function() {
                var drawables = quadTree.getContentsInRegion({
                    center : camera.center,
                    w : 800,
                    h : 600
                });

                drawables.push(this);

                return drawables;
                //var drawables = stars.concat(dust);
                //drawables = drawables.concat([this]);
                //return stars.concat([this]);
                //return drawables;
            },
            draw : draw,
            gestureUpdate : gestureUpdate,
            update : update,
            camera : camera,
        };

    })();

});
