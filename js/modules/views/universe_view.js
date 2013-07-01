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
        
        var processing;
        var camera;

        var drawables = [];
        var updateFunctions = [];
        var touchableObjects = [];
        var time = {
            total : 0,
            ellapsed : 0
        };

        var onUpdate = function(f) {
            updateFunctions.push(f);
        };

        var update = function(currentTime) {
            utilities.clearDebugOutput();
            //   console.log("update " + currentTime);
            time.ellapsed = currentTime - time.total;
            time.total = currentTime;
            utilities.debugOutput("Update " + time.total.toFixed(2) + " fps: " + (1 / time.ellapsed).toFixed(2));

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

            var view = this;

            // do update stuff
            update(g.millis() * .001);

            // Compile a list of all the drawable objects
            view.currentDrawables = [];
            $.each(drawables, function(index, drawable) {
                //  console.log("add " + drawable);
                view.currentDrawables = view.currentDrawables.concat(drawable.getDrawableObjects());
            });

            // Initialize a list of objects that are touchable
            touchableObjects = [];

            g.colorMode(g.HSB, 1);
            g.ellipseMode(g.CENTER_RADIUS);

            g.background(.55, .8, .1);

            g.pushMatrix();
            g.translate(g.width / 2, g.height / 2);

            drawLayer(g, {
                layer : "bg",
            });

            drawLayer(g, {
                layer : "main",
            });

            drawLayer(g, {
                layer : "overlay",
            });

            g.popMatrix();

        };

        var setToScreenPosition = function(p, objPos) {
            p.setTo(objPos);
            p.sub(camera.center);

        };

        var drawLayer = function(g, options) {
            var p = new Vector(0, 0);
            $.each(this.currentDrawables, function(index, obj) {
                // figure out where this object is, and translate appropriately
                g.pushMatrix();
                if (obj.position !== undefined) {
                    setToScreenPosition(p, obj.position);
                    g.translate(p.x, p.y);

                }
                obj.draw(g, options);
                g.popMatrix();

                if (options.layer === "main" && obj.touchable) {
                    var data = [obj, new Vector(p)];
                    touchableObjects.push(data);

                }
            });

        };

        var getTouchableAt = function(p) {

            var target = new Vector(p.x - processing.width / 2, p.y - processing.height / 2, 0);
            stellarGame.touch.universeTouch = target;
            console.log("Get touchable at: " + target);

            var minDist = 130;
            var closest;
            // go through all the objects and find the closest (inefficient, but fine for now)
            $.each(touchableObjects, function(index, objData) {

                var obj = objData[0];

                var d = obj.position.getDistanceTo(target);
                console.log("    " + d + " to " + obj);

                if (d < minDist) {
                    minDist = d;
                    closest = obj;
                    console.log("      Obj found: " + obj);

                }

            });
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

        console.log(canvas);
        processing = new Processing(canvas, initProcessing);

        return {
            dimensions : dimensions,
            setCamera : function(c) {
                camera = c;
            },
            onUpdate : onUpdate,

            addDrawable : function(d) {
                drawables.push(d);
            },

            getTouchableAt : getTouchableAt,
        };
    })();

});

