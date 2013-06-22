/**
 * @author Kate Compton
 */

// Display the Universe
// It's using a singleton pattern
define(["processing", "modules/models/vector"], function(PROCESSING, Vector) {
    console.log("Init universe view");

    return (function() {
        var processing;
        var drawables = [];
        var updateFunctions = [];
        var time = {
            total : 0,
            ellapsed : 0
        };

        var onUpdate = function(f) {
            updateFunctions.push(f);
        };

        var update = function(currentTime) {
            //   console.log("update " + currentTime);
            time.ellapsed = currentTime - time.total;
            time.total = currentTime;

            $.each(updateFunctions, function(index, f) {
                f.call(undefined, time);
            });
        };

        var draw = function(g) {

            // do update stuff
            update(g.millis() * .001);

            g.background(.55, .1, 1);
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

        var drawLayer = function(g, options) {
            var p = new Vector.Vector(0, 0);
            $.each(drawables, function(index, drawable) {

                // Get all the drawable objects from this *thing*
                var drawableObjects = drawable.getDrawableObjects();
                $.each(drawableObjects, function(index, obj) {
                    // figure out where this object is, and translate appropriately
                    p.setTo(obj.position);
                   // console.log(p);
                    
                    g.pushMatrix();
                    g.translate(p.x, p.y);
                    obj.draw(g, options);
                    g.popMatrix();
                });
            });
        };

        // attaching the sketchProc function to the canvas
        console.log("START UNIVERSE VIEW");
        canvas = document.getElementById("universe_canvas");
        var initProcessing = function(g) {
            g.size(600, 400);
            g.colorMode(g.HSB, 1);
            g.background(.45, 1, 1);

            g.draw = function() {
                draw(g);
            };
        };

        console.log(canvas);
        processing = new Processing(canvas, initProcessing);

        return {

            onUpdate : onUpdate,

            addDrawable : function(d) {
                drawables.push(d);
            },
        };
    })();

});

