/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["modules/models/vector", "jQueryUITouchPunch", "jQueryHammer"], function(Vector, $) {
    var maxHistory = 50;
    return (function() {

        // Attach mouse events to the world window
        var universeView, universe;

        var universeDiv = $("#universe_canvas");
        var touch = {
            lastPressed : new Vector(0, 0),
            lastReleased : new Vector(0, 0),
            dragOffset : new Vector(0, 0),

            screenOffset : new Vector(0, 0),
            planeOffset : new Vector(0, 0),
            planeLast : new Vector(0, 0),
            screenLast : new Vector(0, 0),
            screenPosition : new Vector(0, 0),
            planePosition : new Vector(0, 0),
            planeCenterOffset : new Vector(0, 0),
            screenPct : new Vector(0, 0),

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

            center : new Vector(0, 0),
            overObjects : [],

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

                utilities.clearTouchOutput();
     utilities.touchOutput("Current Tool: " + touch.activeTool);
           
                // set the last positions to the current position;
                touch.planeLast.setTo(touch.planePosition);
                touch.screenLast.setTo(touch.screenPosition);
                touch.screenPosition.setTo(p.x - w / 2, -p.y + h / 2);

                // where is the plane position?  Project that back so that the screen position has depth

                universeView.projectToPlanePosition(touch.screenPosition, touch.planePosition);
                universeView.convertToScreenPosition(touch.planePosition, touch.screenPosition);

                // Set the offsets
                touch.screenOffset.setToAddMultiple(touch.screenPosition, 1, touch.screenLast, -1)

                touch.planeOffset.setToAddMultiple(touch.planePosition, 1, touch.planeLast, -1);

                // How far is the touch from the screen's center position on the plane?
                touch.planeCenterOffset.setToDifference(universeView.camera.center.position, touch.planePosition);

                touch.screenPct.setTo(touch.screenPosition);
                touch.screenPct.x /= w;
                touch.screenPct.y /= h;
                touch.screenPct.z = 0;
                utilities.touchOutput("ScreenPct: " + touch.screenPct.toString(2) + " w: " + w + " h: " + h);

                // Add to the history
                touch.historyIndex = (touch.historyIndex + 1) % maxHistory;
                touch.history[touch.historyIndex] = new Vector(touch.planePosition);

                touch.overObjects = universeView.getTouchableAt(touch.planePosition);
                utilities.touchOutput(touch.overObjects);

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

        var setUniverseView = function(view) {
            universeView = view;
            touch.center.setTo(view.dimensions.width / 2, view.dimensions.height / 2);

            touch.setoUniversePosition = universeView.setoUniversePosition;

        };

        var setUniverse = function(u) {
            universe = u;
            // set the universe touch marker to follow the plane position
            universe.touchMarker.position = touch.planePosition;

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
        // Add UI components

        var addUI = function() {

            var zoomDefault = .2;
            function setZoom(value) {
                var distance = Math.pow(value, 3);
                universeView.setCamera({
                    distance : distance,
                    zoom : value
                });
            };
            $("#zoom_slider").slider({
                orientation : "vertical",
                range : "min",
                min : .01,
                max : 1,
                value : zoomDefault,
                step : .01,
                slide : function(event, ui) {
                    setZoom(ui.value);
                }
            });
            setZoom(zoomDefault);

            var rotationDefault = .2;
            $("#rotation_slider").slider({
                orientation : "vertical",
                range : "min",
                min : .01,
                max : 7,
                value : rotationDefault,
                step : .1,
                slide : function(event, ui) {

                    universeView.setCamera({
                        rotation : ui.value,
                    });
                }
            });
            universeView.setCamera({
                rotation : rotationDefault
            });

        }
        //=======================================================
        // Initialize the universe controller

        console.log("START UNIVERSE CONTROLLER");

        // Make the touch accessible from anywhere (but use sparingly!)
        var init = function() {
            stellarGame.touch = touch;
            initTouchFunctions();
            addUI();
        };

        return {
            init : init,
            onControl : onControl,
            setUniverseView : setUniverseView,
            setUniverse : setUniverse,

        };
    })();

});
