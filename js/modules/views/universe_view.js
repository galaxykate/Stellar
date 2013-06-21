/**
 * @author Kate Compton
 */

// Display the Universe

define(["processing"], function(PROCESSING) {
    var processing;

    var init = function() {

        console.log("START UNIVERSE VIEW");
        canvas = document.getElementById("universe_canvas");

        // attaching the sketchProc function to the canvas
        var initProcessing = function(g) {
            g.size(canvas.width, canvas.height);
            g.colorMode(g.HSB, 1);
            g.background(.45, 1, 1);
        };

        console.log(canvas);
        processing = new Processing(canvas, initProcessing);
    };

    return {
        init : init,
    };

});
