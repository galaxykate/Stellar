/**
 * @author Kate Compton
 */

// Display the Universe
// It's using a singleton pattern
define(["processing", "modules/models/vector"], function(PROCESSING, Vector) {
    console.log("Init universe view");

    return (function() {
        var dimensions = {
            width : 600,
            height : 400
        };

        var universe;

        var processing;

        var activeQuadrants = [];
        var activeObjects = [];
        var updateFunctions = [];

        var time = {
            total : 0,
            ellapsed : 0.1,
        };
        var toWorldPosition = function(p) {
            var p2 = new Vector(p);
            p2.x += camera.center.x;
            p2.y += camera.center.y;
            return p2;

        };

        var onUpdate = function(f) {
            updateFunctions.push(f);
        };

        var update = function(currentTime) {

            // make sure that the ellapsed time is neither to high nor too low
            time.ellapsed = currentTime - time.total;
            if (time.ellapsed === undefined)
                time.ellapsed = .03;
            utilities.constrain(time.ellapsed, .01, .1);

            time.total = currentTime;
            utilities.debugOutput("Update " + time.total.toFixed(2) + " fps: " + (1 / time.ellapsed).toFixed(2));

            // Update all the extra update functions
            $.each(updateFunctions, function(index, f) {
                f.call(undefined, time);
            });
        };

        var addDrawingUtilities = function(g) {
            g.polarVertex = function(r, theta) {
                this.vertex(r * Math.cos(theta), r * Math.sin(theta));
            }
        };

        var draw = function(g) {
            utilities.clearDebugOutput();

            g.colorMode(g.HSB, 1);
            g.ellipseMode(g.CENTER_RADIUS);

            g.background(.55, .8, .1);
            g.pushMatrix();
            g.translate(g.width / 2, g.height / 2);

            var view = this;

            g.pushMatrix();
            g.translate(-camera.center.x, -camera.center.y);

            // Calculate the active regions
            var border = 120;
            var region = {
                center : camera.center,
                w : dimensions.width + border * 2,
                h : dimensions.height + border * 2
            };
            region.left = region.center.x - region.w / 2;
            region.right = region.center.x + region.w / 2;
            region.top = region.center.y - region.h / 2;
            region.bottom = region.center.y + region.h / 2;

            stellarGame.drawQuadTree = true;

            activeQuadrants = universe.getQuadrantsInRegion(region, []);

            g.popMatrix();

            activeObjects = [];
            // Compile all the active objects

            var contentsArrays = [];
            $.each(activeQuadrants, function(index, quad) {
                contentsArrays[index] = quad.contents;
                //  utilities.debugOutput(quad);
                //     utilities.debugArrayOutput(contentsArrays[index]);

            });
            // Compile all the arrays of contents into a single array
            activeObjects = activeObjects.concat.apply(activeObjects, contentsArrays);
            utilities.debugOutput("Simulating/drawing: " + activeObjects.length + " objects");

            // do update stuff
            update(g.millis() * .001);
            if (stellarGame.touch)
                getTouchableAt(stellarGame.touch.currentPosition);

            // Draw eaach layer in order
            drawLayer(g, {
                layer : "bg",
            });

            drawLayer(g, {
                layer : "main",
            });

            drawLayer(g, {
                layer : "overlay",
            });

            // Draw the touch
            var touch = stellarGame.touch;

            if (touch.activeTool === undefined) {

            } else {
                touch.activeTool.drawCursor(g, touch.currentPosition);
            }
            g.popMatrix();

        };

        var setoUniversePosition = function(p, screenPos) {
            p.setTo(screenPos);
            p.add(camera.center);
        };

        var setToScreenPosition = function(p, objPos) {
            p.setTo(objPos);
            p.sub(camera.center);

        };

        var drawLayer = function(g, options) {
            var p = new Vector(0, 0);

            universe.draw(g, options);
            $.each(activeObjects, function(index, obj) {
                // figure out where this object is, and translate appropriately
                g.pushMatrix();
                if (obj.position !== undefined) {
                    setToScreenPosition(p, obj.position);
                    g.translate(p.x, p.y);

                }
                obj.draw(g, options);
                g.popMatrix();

            });

        };

        var getTouchableAt = function(p) {
            // utilities.debugOutput("Get touchable at " + p);

            var touchables = [];
            var target = new Vector(p.x + camera.center.x, p.y + camera.center.y, 0);

            var minDist = 10;
            // go through all the objects and find the closest (inefficient, but fine for now)
            // utilities.debugArrayOutput(activeObjects);

            var length = activeObjects.length;
            $.each(activeObjects, function(index, obj) {

                if (obj !== undefined) {

                    var d = obj.position.getDistanceTo(target);
                    // utilities.debugOutput(obj + ": " + Math.floor(d));
                    //  utilities.debugOutput(obj + ": " + d);
                    if (obj.radius)
                        d -= obj.radius;
                    if (d < minDist) {

                        touchables.push(obj);

                    }
                }

            });
            //          utilities.debugOutput("...done<br> ");
            // utilities.debugArrayOutput(touchables);

            return touchables;

        };

        // attaching the sketchProc function to the canvas
        console.log("START UNIVERSE VIEW");
        canvas = document.getElementById("universe_canvas");
        var initProcessing = function(g) {

            addDrawingUtilities(g);
            g.size(dimensions.width, dimensions.height);

            g.colorMode(g.HSB, 1);
            g.background(.45, 1, 1);

            g.draw = function() {
                if (stellarGame.ready) {

                    draw(g);
                }
            };
        };
        processing = new Processing(canvas, initProcessing);

        return {
            dimensions : dimensions,

            setUniverse : function(u) {
                universe = u;
                camera = universe.getCamera();

            },
            toWorldPosition : toWorldPosition,
            onUpdate : onUpdate,

            getTouchableAt : getTouchableAt,
        };
    })();

});

