/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define([], function() {

    return (function() {

        // Attach mouse events to the world window
        var universeDiv = $("#universe_canvas");
        var touch = {
            lastPressed : [0, 0],
            dragOffset : [0, 0],
            pressed : false,
        };
        var universeView;

        var setUniverseView = function(view) {
            universeView = view;
        }
        var controlUpdateFunction = [];

        var onControl = function(f) {
            controlUpdateFunction.push(f);
        };

        var initTouchFunctions = function() {
            universeDiv.click(function(e) {
                var p = toRelative(this, e);

            });

            universeDiv.mousemove(function(e) {
                var p = toRelative(this, e);
                if (touch.pressed) {
                    touch.dragOffset = getOffset(p, touch.lastPressed);
                }
                controlUpdated();

            });

            universeDiv.mouseup(function(e) {
                touch.pressed = false;
                var p = toRelative(this, e);
                touch.dragOffset = [0, 0];
                if (touch.heldObject !== undefined) {
                    console.log("Touch ended " + touch.heldObject);
                    touch.heldObject.touchEnd();
                }
            });

            universeDiv.mousedown(function(e) {
                touch.pressed = true;
                var p = toRelative(this, e);
                touch.lastPressed[0] = p[0];
                touch.lastPressed[1] = p[1];
            
                // Figure out what this is pressed *on*
                touch.heldObject = universeView.getTouchableAt(touch.lastPressed);
                if (touch.heldObject !== undefined) {
                    console.log("Touch " + touch.heldObject);
                    touch.heldObject.touchStart();
                }

            });
        };

        var controlUpdated = function() {
            $.each(controlUpdateFunction, function(index, f) {
                f.call(undefined, touch);
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

        // Make the touch accessible from anywhere (but use sparingly!)
        stellarGame.touch = touch;
        initTouchFunctions();

        return {
            onControl : onControl,
            setUniverseView : setUniverseView,

        };
    })();

});
