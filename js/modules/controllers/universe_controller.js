/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["modules/models/vector", "jQueryUITouchPunch", "jQueryHammer", "kcolor", "mousewheel"], function(Vector, $, $, KColor, mousewheel) {
    var maxHistory = 50;
    return (function() {

        var player = {
            idColor : new KColor(Math.random(), 1, 1),
        };

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

        var updateTouchPositions = function(p) {
            if (p === undefined) {
                p = touch.screenPosition;
            }

            var w = universeView.dimensions.width;
            var h = universeView.dimensions.height;

            // If the position is updated
            // set the last positions to the current position;
            touch.planeLast.setTo(touch.planePosition);
            touch.screenLast.setTo(touch.screenPosition);
            touch.screenPosition.setTo(p);
            if (touch.pressed) {

                touch.dragOffset.setTo(-touch.lastPressed.x + p.x, -touch.lastPressed.y + p.y);
            }

            // where is the plane position?  Project that back so that the screen position has depth

            universeView.projectToPlanePosition(touch.screenPosition, touch.planePosition);
            universeView.convertToScreenPosition(touch.planePosition, touch.screenPosition);

            // Set the offsets
            touch.screenOffset.setToAddMultiple(touch.screenPosition, 1, touch.screenLast, -1)

            touch.planeOffset.setToAddMultiple(touch.planePosition, 1, touch.planeLast, -1);

            // How far is the touch from the screen's center position on the plane?
            touch.planeCenterOffset.setToDifference(universeView.camera.position, touch.planePosition);

            touch.screenPct.setTo(touch.screenPosition);
            touch.screenPct.x /= w;
            touch.screenPct.y /= h;
            touch.screenPct.z = 0;
            utilities.touchOutput("ScreenPct: " + touch.screenPct.toString(2) + " w: " + w + " h: " + h);

            // Add to the history
            touch.historyIndex = (touch.historyIndex + 1) % maxHistory;
            touch.history[touch.historyIndex] = new Vector(touch.planePosition);

        };

        var toScreenPosition = function(p) {
            var w = universeView.dimensions.width;
            var h = universeView.dimensions.height;
            return new Vector(p.x - w / 2, -p.y + h / 2);
        };

        var initTouchFunctions = function() {

            // Mousewheel zooming
            $("body").mousewheel(function(event, delta) {
                console.log(delta);

                var zoomCurrent = universeView.camera.zoom;
                universeView.camera.setZoom(zoomCurrent + delta * .003);
                event.preventDefault();

            });

            // Clear the touch output and get the objects/regions that it's over
            var updateTouchContext = function() {
                utilities.clearTouchOutput();

                utilities.touchOutput("Last action: " + touch.lastAction);
                utilities.touchOutput("Current Tool: " + touch.activeTool);
                utilities.touchOutput("Last : " + touch.lastActionOutput);

                // Get the objects that the cursor is over
                touch.overObjects = universeView.getTouchableAt(touch.planePosition);

                // Get the regions that the cursor is over
                touch.region = universe.getRegion(touch.planePosition);
                utilities.touchOutput(touch.overObjects);
            };

            var dragCount = 0;
            // Move the primary touch/mouse to this positon
            var touchDrag = function(p) {
                utilities.touchOutput("drag count : " + dragCount);

                if (touch.pressed) {

                    // Count how long it's been dragged
                    if (!touch.dragging) {
                        dragCount++;
                        if (dragCount > 30) {
                            touch.dragging = true;
                            console.log("Dragging set to " + touch.dragging);
                        }
                    }

                    if (touch.dragging) {
                        if (p !== undefined) {
                            updateTouchPositions(p);
                        }

                        updateTouchContext();

                        if (touch.region)
                            touch.region.setOwner(player);

                        if (touch.activeTool)
                            touch.activeTool.touchDrag(touch);
                    }
                }
            };

            var touchDoubletap = function(p) {
                if (p !== undefined) {
                    updateTouchPositions(p);
                }
                updateTouchContext();

                // Do something with the clicked stuff
                if (touch.overObjects.length > 0) {

                    console.log("CLICK " + touch.overObjects[0]);
                    universeView.camera.focusOn(touch.overObjects[0]);
                } else
                    console.log("CLICKED NOTHING");
            };

            var touchUp = function(p) {
                console.log("TOUCH UP");
                updateTouchContext();

                touch.dragging = false;
                touch.pressed = false;
                touch.dragOffset.mult(0);
                touch.lastReleased.setTo(p);

                // If there is an active tool, pass the event to it
                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchUp(touch);
                }
                dragCount = 0;
                console.log("Dragging " + touch.dragging);
            };

            var touchDown = function(p) {
                updateTouchContext();
                touch.pressed = true;
                touch.lastPressed.setTo(p)

                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchDown(touch);
                }
                dragCount = 0;

            };

            // Bind these events to hammer actions

            var eventToScreenPos = function(ev) {
                var p = new Vector(ev.gesture.center.pageX, ev.gesture.center.pageY);
                var relPos = pagePositionToRelativePosition(universeDiv, p);
                return toScreenPosition(relPos);
            };

            var hammertime = universeDiv.hammer();
            hammertime.on("touch", function(ev) {
                var p = eventToScreenPos(ev);
                touch.lastAction = "touch";
                touch.lastActionOutput = p;
                touchDown(p);

            });

            hammertime.on("doubletap", function(ev) {
                var p = eventToScreenPos(ev);
                touch.lastAction = "doubleclick";
                touch.lastActionOutput = p;
                touchDoubletap(p);

            });

            hammertime.on("drag", function(ev) {
                var p = eventToScreenPos(ev);
                touch.lastAction = "drag";
                touch.lastActionOutput = p;
                touchDrag(p);

            });

            hammertime.on("release", function(ev) {
                var p = eventToScreenPos(ev);
                touch.lastAction = "release";
                touch.lastActionOutput = p;
                touchUp(p);
            });

            touch.lastAction = "none";
            touch.update = function() {
                if (touch.pressed)
                    touchDrag();
            };

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

            $("#zoom_slider").slider({
                orientation : "vertical",
                range : "min",
                min : tuning.minZoom,
                max : tuning.maxZoom,
                value : zoomDefault,
                step : .01,
                slide : function(event, ui) {
                    universeView.camera.setZoom(ui.value);
                }
            });
            
            universeView.camera.setZoom(zoomDefault);

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

            $("#nav_home_button").click(function() {
                universeView.camera.setTarget(new Vector(0, 0));
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
            setUniverseView : setUniverseView,
            setUniverse : setUniverse,

        };
    })();

});
