/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define([], function() {

    return (function() {

        var initMouseFunctions = function() {
            universeDiv.click(function(e) {
                var p = toRelative(this, e);

            });

            universeDiv.mousemove(function(e) {
                var p = toRelative(this, e);

            });

            universeDiv.mouseup(function(e) {
                var p = toRelative(this, e);
                mouse.dragOffset = getOffset(p, mouse.lastPressed);
                console.log(mouse.dragOffset);

            });

            universeDiv.mousedown(function(e) {
                var p = toRelative(this, e);
                mouse.lastPressed[0] = p[0];
                mouse.lastPressed[1] = p[1];
                console.log(mouse.lastPressed);
            });
        };

        var toRelative = function(div, e) {

            var parentOffset = $(div).parent().offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            return [relX, relY];
        };

        var getOffset = function(p0, p1) {
            return [p0[0] - p1[0], p0[1] - p1[1]];
        };
        
        //=======================================================
        // Initialize the universe controller

        console.log("START UNIVERSE CONTROLLER");

        // Attach mouse events to the world window
        var universeDiv = $("#universe_canvas");
        var mouse = {
            lastPressed : [0, 0],
            dragOffset : [0, 0],
        };
        initMouseFunctions();

        return {

            // public interface
            publicMethod1 : function() {
                // all private members are accesible here
            },
            publicMethod2 : function() {
            }
        };
    })();

});
