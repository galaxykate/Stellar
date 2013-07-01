/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["modules/models/vector"], function(Vector) {

    return (function() {

        // Attach mouse events to the world window
        var universeDiv = $("#universe_canvas");
        var touch = {
            lastPressed : new Vector(0, 0),
            dragOffset : new Vector(0, 0),
            lastHover : new Vector(0, 0),
            center : new Vector(0, 0),
            pressed : false,
        };
        var universeView;

        var setUniverseView = function(view) {
            universeView = view;
            touch.center.setTo(view.dimensions.width / 2, view.dimensions.height / 2);
          //  console.log(touch.center);
           // console.log(view.dimensions);
        };

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

                    touch.dragOffset.setTo(-touch.lastPressed.x + p[0], -touch.lastPressed.y + p[1]);
                }
                touch.lastHover.setTo(p[0], p[1]);
               
                touch.lastHover.sub(touch.center);
                controlUpdated();

            });

            universeDiv.mouseup(function(e) {
                touch.pressed = false;
                var p = toRelative(this, e);
                touch.dragOffset.mult(0);
                if (touch.heldObject !== undefined) {
                    console.log("Touch ended " + touch.heldObject);
                    touch.heldObject.touchEnd();
                }
            });

            universeDiv.mousedown(function(e) {
                touch.pressed = true;
                var p = toRelative(this, e);
                touch.lastPressed.setTo(p[0], p[1])

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

         //   var parentOffset = $(div).parent().offset();
          var parentOffset =$(div).offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            return [relX, relY];
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
