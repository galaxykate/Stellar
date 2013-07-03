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
        var camera;

        var activeQuadrants = [];
        var activeObjects = [];
        var updateFunctions = [];

        var time = {
            total : 0,
            ellapsed : 0.1,
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
            var region = {
                center : camera.center,
                w : dimensions.width,
                h : dimensions.height
            };
            if (stellarGame.drawQuadTree)
                activeQuadrants = universe.getQuadrantsInRegion(region, g);
            else
                activeQuadrants = universe.getQuadrantsInRegion(region);

            g.popMatrix();

            g.ellipse(camera.center.x, camera.center.y, 50, 50);

            activeObjects = [];
            // Compile all the active objects

            var contentsArrays = [];
            $.each(activeQuadrants, function(index, quad) {
                contentsArrays[index] = quad.contents;

            });
            // Compile all the arrays of contents into a single array
            activeObjects = activeObjects.concat.apply(activeObjects, contentsArrays);
            utilities.debugOutput("Simulating/drawing: " + activeObjects.length + " objects");

            // do update stuff
            update(g.millis() * .001);
            if (stellarGame.touch)
                getTouchableAt(stellarGame.touch.lastHover);

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
            var p = touch.lastHover;
            if (touch.activeTool === undefined) {
                g.fill(.8, 1, 1, .2);
                g.stroke(.8, .4, .3);
                g.ellipse(p.x, p.y, 20, 20);
            } else {
                touch.activeTool.drawCursor(g, p);
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

            var target = new Vector(p.x - processing.width / 2 + camera.center.x, p.y - processing.height / 2 + camera.center.y, 0);

            stellarGame.touch.universeTouch = target;

            var minDist = 10;
            var closest;
            // go through all the objects and find the closest (inefficient, but fine for now)

            var length = activeObjects.length;
            $.each(activeObjects, function(index, obj) {

                if (obj !== undefined) {

                    var d = obj.position.getDistanceTo(target);
                    if (obj.radius)
                        d -= obj.radius;
                    if (d < minDist) {
                        minDist = d;
                        closest = obj;

                    }
                }

            });
            utilities.debugOutput("Touchable at: " + target + ": " + closest);

            return closest;

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

                draw(g);
            };
        };
        processing = new Processing(canvas, initProcessing);

        return {
            dimensions : dimensions,

            setUniverse : function(u) {
                universe = u;
                camera = u.getCamera();
            },
            onUpdate : onUpdate,

            getTouchableAt : getTouchableAt,
        };
    })();

});

