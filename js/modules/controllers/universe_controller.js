/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["modules/models/vector", "jQueryUITouchPunch", "jQueryHammer"], function(Vector, $) {
    var maxHistory = 50;
    return (function() {

        // Attach mouse events to the world window
        var universeDiv = $("#universe_canvas");
        var touch = {
            lastPressed : new Vector(0, 0),
            lastReleased : new Vector(0, 0),
            dragOffset : new Vector(0, 0),
            lastOffset : new Vector(0, 0),

            // History function
            history : [],
            historyIndex : 0,
            getHistory : function(stepsBack) {
                var index = (this.history.length + this.historyIndex - stepsBack) % this.history.length;
                return this.history[index];
            },

            getOffsetToHistory : function(stepsBack) {
                var p = this.getHistory(stepsBack);

                return this.currentPosition.getOffsetTo(p);
            },

            currentUniversePosition : new Vector(0, 0),
            currentPosition : new Vector(0, 0),
            center : new Vector(0, 0),
            overObjects : [],

            toWorldPosition : function(p) {
                return universeView.toWorldPosition(p);

            },

            transformScreenToUniverse : function(p) {
                return universeView.transformScreenToUniverse(p);

            },

            pressed : false,
        };

        for (var i = 0; i < maxHistory; i++) {
            touch.history[i] = new Vector(0, 0, 0);
        }

        //=====
        var initTouchFunctions = function() {

            // Move the primary touch/mouse to this positon
            var touchMove = function(p) {

                var w = universeView.dimensions.width;
                var h = universeView.dimensions.height;

                // Find the offset since the last movement
                touch.lastOffset.setTo(p.x + touch.currentPosition.x, p.y + touch.currentPosition.y);
                touch.currentPosition.setTo(p.x - w / 2, p.y - h / 2);
                touch.currentUniversePosition.setTo(touch.currentPosition);
                touch.transformScreenToUniverse(touch.currentUniversePosition);

                touch.historyIndex = (touch.historyIndex + 1) % maxHistory;
                touch.history[touch.historyIndex] = touch.currentPosition.clone();

                touch.overObjects = universeView.getTouchableAt(touch.currentPosition);

                if (touch.pressed) {

                    touch.dragOffset.setTo(-touch.lastPressed.x + p[0], -touch.lastPressed.y + p[1]);
                    if (touch.activeTool !== undefined) {
                        touch.activeTool.touchDrag(touch);

                    }

                } else {
                    touch.activeTool.touchMove(touch);

                }
                controlUpdated();
            };

            var touchUp = function(p) {
                touch.pressed = false;
                touch.dragOffset.mult(0);
                touch.lastReleased.setTo(p);

                // If there is an active tool, pass the event to it
                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchUp(touch);
                }
            };

            var touchDown = function(p) {
                touch.pressed = true;

                touch.lastPressed.setTo(p)

                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchDown(touch);
                }

            };

            var hammertime = universeDiv.hammer();
            hammertime.on("touch", function(ev) {
                var p = new Vector(ev.gesture.center.pageX, ev.gesture.center.pageY);
                var relPos = pagePositionToRelativePosition(universeDiv, p);

                touch.lastAction = "touch";
                touch.lastActionOutput = relPos;
                touchDown(relPos);

            });

            hammertime.on("drag", function(ev) {
                var p = new Vector(ev.gesture.center.pageX, ev.gesture.center.pageY);
                var relPos = pagePositionToRelativePosition(universeDiv, p);

                touch.lastAction = "drag";
                touch.lastActionOutput = relPos;
                touchMove(relPos);

            });

            hammertime.on("release", function(ev) {
                var p = new Vector(ev.gesture.center.pageX, ev.gesture.center.pageY);
                var relPos = pagePositionToRelativePosition(universeDiv, p);

                touch.lastAction = "release";
                touch.lastActionOutput = relPos;
                touchUp(relPos);
            });

            touch.lastAction = "none";

        };
        //=====

        var universeView;

        var setUniverseView = function(view) {
            universeView = view;
            touch.center.setTo(view.dimensions.width / 2, view.dimensions.height / 2);

            touch.setoUniversePosition = universeView.setoUniversePosition;

        };

        var controlUpdateFunction = [];

        var onControl = function(f) {
            controlUpdateFunction.push(f);
        };

        var controlUpdated = function() {
            $.each(controlUpdateFunction, function(index, f) {
                f.call(undefined, touch);
            });
        };

        var pagePositionToRelativePosition = function(div, pagePos) {

            //   var parentOffset = $(div).parent().offset();
            var parentOffset = $(div).offset();
            //or $(this).offset(); if you really just want the current element's offset

            var relPos = new Vector(pagePos.x - parentOffset.left, pagePos.y - parentOffset.top);
            return relPos;
        };

        //=======================================================
        // Initialize the universe controller

        console.log("START UNIVERSE CONTROLLER");

        // Make the touch accessible from anywhere (but use sparingly!)
        var init = function() {
            stellarGame.touch = touch;
            initTouchFunctions();
        };

        return {
            init : init,
            onControl : onControl,
            setUniverseView : setUniverseView,

        };
    })();

});
