/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(["modules/models/vector", "jQueryUITouchPunch", "jQueryHammer", "kcolor", "mousewheel"], function(Vector, $, $, KColor, mousewheel) {

    var maxHistory = 50;

    var universeDiv = $("#universe_canvas");

    var pagePositionToRelativePosition = function(div, pagePos) {

        //   var parentOffset = $(div).parent().offset();
        var parentOffset = $(div).offset();
        //or $(this).offset(); if you really just want the current element's offset

        var relPos = new Vector(pagePos.x - parentOffset.left, pagePos.y - parentOffset.top);
        return relPos;
    };

    var createNavComponents = function() {
        //=======================================================
        // Add UI components

        var zoomDefault = .2;

        $("#zoom_slider").slider({
            orientation : "vertical",
            range : "min",
            min : tuning.minZoom,
            max : tuning.maxZoom,
            value : zoomDefault,
            step : .01,
            slide : function(event, ui) {
                stellarGame.universeView.camera.setZoom(ui.value);
            }
        });

        stellarGame.universeView.camera.setZoom(zoomDefault);

        var rotationDefault = .2;
        $("#rotation_slider").slider({
            orientation : "vertical",
            range : "min",
            min : .01,
            max : 7,
            value : rotationDefault,
            step : .1,
            slide : function(event, ui) {

                stellarGame.universeView.setCamera({
                    rotation : ui.value,
                });
            }
        });

        $("#nav_home_button").click(function() {
            stellarGame.universeView.camera.setTarget(new Vector(0, 0));
        });

        stellarGame.universeView.setCamera({
            rotation : rotationDefault
        });

    };

    var createTouch = function() {
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

            center : new Vector(screenResolution.width / 2, screenResolution.height / 2),
            overObjects : [],

            pressed : false,

            // Update on the frame refresh
            update : function(time) {

            },

            updateTouchPositions : function(p) {
                var touch = this;
                if (p === undefined) {
                    p = touch.screenPosition;
                }

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
                // Convert the plane position to the screen position DOESN'T WORK!
                //  universeView.convertToScreenPosition(touch.planePosition, touch.screenPosition);

                // Set the offsets
                touch.screenOffset.setToAddMultiple(touch.screenPosition, 1, touch.screenLast, -1)

                touch.planeOffset.setToAddMultiple(touch.planePosition, 1, touch.planeLast, -1);

                // How far is the touch from the screen's center position on the plane?
                touch.planeCenterOffset.setToDifference(universeView.camera.position, touch.planePosition);

                touch.screenPct.setTo(touch.screenPosition);
                touch.screenPct.x /= screenResolution.width * .5;
                touch.screenPct.y /= screenResolution.height * .5;
                touch.screenPct.z = 0;

                // Add to the history
                touch.historyIndex = (touch.historyIndex + 1) % maxHistory;
                touch.history[touch.historyIndex] = new Vector(touch.planePosition);

            },

            toScreenPosition : function(p) {
                var p2 = new Vector(p);
                p2.sub(this.center);
                return p2;
            },

            // Clear the touch output and get the objects/regions that it's over
            updateTouchContext : function() {

                // Get the objects that the cursor is over
                touch.overObjects = universeView.getTouchableAt(touch.planePosition);

                // Get the regions that the cursor is over
                touch.region = universe.getRegion(touch.planePosition);
                var dragCount = 0;

            },

            output : function() {
                var touch = this;
                debugTouch.output("Last action: " + touch.lastAction);
                debugTouch.output("Current Tool: " + touch.activeTool);
                debugTouch.output("Last : " + touch.lastActionOutput);

                debugTouch.output("Touched");
                debugTouch.outputArray(touch.overObjects);
                debugTouch.output("Touch pos: " + touch.screenPosition);
                debugTouch.output("Touch pct: " + touch.screenPct.toString(2));

                debugTouch.output("Plane pos: " + touch.planePosition);
            },

            //============================================================
            //============================================================
            //============================================================
            //============================================================
            // Touch functions
            touchDrag : function(p) {
                debugTouch.clear();
                touch.updateTouchPositions(p);
                touch.updateTouchContext();

                if (touch.pressed) {

                    // Count how long it's been dragged
                    if (!touch.dragging) {
                        dragCount++;
                        if (dragCount > 2) {
                            touch.dragging = true;
                        }
                    }

                    if (touch.dragging) {
                        touch.updateTouchPositions(p);
                        touch.updateTouchContext();

                        if (touch.activeTool)
                            touch.activeTool.touchDrag(touch);
                            else 
                            console.log("Drag with no tool");
                    }
                }
                touch.output();
            },

            touchDoubletap : function(p) {
                console.log("DOUBLE TAP");
                console.log(touch.overObjects);
                debugTouch.clear();
                touch.updateTouchPositions(p);
                touch.updateTouchContext();

                // Do something with the clicked stuff
                if (touch.overObjects.length > 0) {

                    console.log("CLICK " + touch.overObjects[0]);
                    universeView.focusOn(touch.overObjects[0], .2);
                } else
                    console.log("CLICKED NOTHING");

                touch.output();
            },

            touchUp : function(p) {
                debugTouch.clear();
                touch.updateTouchPositions(p);
                touch.updateTouchContext();

                touch.dragging = false;
                touch.pressed = false;
                touch.dragOffset.mult(0);
                touch.lastReleased.setTo(p);

                // If there is an active tool, pass the event to it
                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchUp(touch);
                }
                dragCount = 0;

                touch.output();
            },

            touchDown : function(p) {
                debugTouch.clear();
                touch.updateTouchPositions(p);
                touch.updateTouchContext();

                touch.pressed = true;
                touch.lastPressed.setTo(p)

                if (touch.activeTool !== undefined) {
                    touch.activeTool.touchDown(touch);
                }
                dragCount = 0;

                touch.output();

            },
        };

        for (var i = 0; i < maxHistory; i++) {
            touch.history[i] = new Vector(0, 0, 0);
        }

        stellarGame.touch = touch;
    };

    var bindTouchFunctions = function() {
        var touch = stellarGame.touch;
        console.log("Bind touch events");
        // Mousewheel zooming
        $("#universe_canvas").mousewheel(function(event, delta) {
            console.log("Scroll universe");
            var zoomCurrent = universeView.camera.zoom;
            universeView.unfocus();
            universeView.camera.setZoom(zoomCurrent + delta * .003);
            event.preventDefault();
            
         

        });

        // Bind these events to hammer actions

        var eventToScreenPos = function(ev) {
            var p = new Vector(ev.gesture.center.pageX, ev.gesture.center.pageY);
            var relPos = pagePositionToRelativePosition(universeDiv, p);
            var screenPos = touch.toScreenPosition(relPos);

            return screenPos;
        };

        var hammertime = universeDiv.hammer();
        hammertime.on("touch", function(ev) {
            var p = eventToScreenPos(ev);
            touch.lastAction = "touch";
            touch.lastActionOutput = p;
            touch.touchDown(p);

        });

        hammertime.on("doubletap", function(ev) {
            var p = eventToScreenPos(ev);
            touch.lastAction = "doubleclick";
            touch.lastActionOutput = p;

            touch.touchDoubletap(p);

        });

        hammertime.on("drag", function(ev) {
            var p = eventToScreenPos(ev);
            touch.lastAction = "drag";
            touch.lastActionOutput = p;

            touch.touchDrag(p);

        });

        hammertime.on("release", function(ev) {
            var p = eventToScreenPos(ev);
            touch.lastAction = "release";
            touch.lastActionOutput = p;
            touch.touchUp(p);
        });

        touch.lastAction = "none";
        touch.update = function() {
            if (touch.pressed)
                touch.touchDrag();
        };

        //=====

    };

    //=======================================================
    // Initialize the universe controller

    console.log("START UNIVERSE CONTROLLER");
    createTouch();

    // Make the touch accessible from anywhere (but use sparingly!)
    var init = function() {

        createNavComponents();
        universe = stellarGame.universe;
        universeView = stellarGame.universeView;

        bindTouchFunctions();

        // set the universe touch marker to follow the plane position
        stellarGame.universe.touchMarker.position = stellarGame.touch.planePosition;

    };

    return {
        init : init
    };

});
