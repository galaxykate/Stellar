/**
 * @author Kate Compton
 */

// Display the Universe
// It's using a singleton pattern
define(['inheritance', "processing", "modules/models/vector", "modules/models/edge", "three", "modules/views/inspection_hud"], function(Inheritance, PROCESSING, Vector, Edge, THREE, InspectionHUD) {

    var P_WIDTH = screenResolution.width;
    var P_HEIGHT = screenResolution.height;
    var SCREEN_BORDER = 20;

    var threePosToString = function(threeScreen) {
        return threeScreen.x.toFixed(2) + " " + threeScreen.y.toFixed(2) + " " + threeScreen.z.toFixed(2);

    };

    var getLODFromDistance = function(d) {
        var divisions = [300, 350, 500, 900, 2500, 12000];
        for (var i = 0; i < divisions.length - 1; i++) {
            var start = divisions[i];
            var end = divisions[i + 1];
            if (d >= start && d < end) {
                var pct = (d - start) / (end - start);
                return {
                    index : i,
                    pct : pct,
                }
            }

        }

        if (d >= divisions[divisions.length - 1]) {
            return {
                index : divisions.length - 2,
                pct : 0,
            }
        }
        return {
            index : 0,
            pct : 0,
        }

    };

    var UniverseView = Class.extend({

        // Initialize this universeView to look at this universe
        init : function(universe) {
            this.universe = universe;
            this.camera = universe.camera;

            stellarGame.universeView = this;
            var universeView = this;

            console.log("Init Universe View");

            this.inspectionHUD = new InspectionHUD();
            this.activeQuadrants = [];
            this.activeObjects = [];

            this.time = {
                total : 0,
                ellapsed : 0.1,
                frame : 0,
            };

            this.focus = undefined;

            // Initialize the universe view to use processing
            initProcessing = function(g) {
                g.size(P_WIDTH, P_HEIGHT);

                g.colorMode(g.HSB, 1);
                g.background(.45, 1, 1);

                // Set the drawing function of processing (used for both drawing and updating)
                g.draw = function() {

                    if (stellarGame.ready) {
                        universeView.time.frame++;
                        universeView.update(g.millis() * .001);
                        universeView.draw(g);
                    }
                };
            };

            canvas = document.getElementById("universe_canvas");
            this.processing = new Processing(canvas, initProcessing);

            this.createThreeCamera();

            // Create a pool of divs
            this.starUIDivs = [];
            var starUIHolder = $("#star_overlay_holder");
            for (var i = 0; i < 0; i++) {
                var div = $('<div/>', {
                    'class' : 'star_overlay',
                });

                div.css({
                    top : Math.round(Math.random() * 300) + "px",
                    left : Math.round(Math.random() * 300) + "px",
                });

                starUIHolder.append(div);
            }

        },

        unfocus : function() {
            this.camera.unfocus();
            if (this.focus)
                this.focus.inFocus = false;

            this.focus = undefined;
            this.inspectionHUD.unfocus();
            stellarGame.activateMove();

        },

        focusOn : function(obj) {
            console.log("Focus on");
            console.log(obj);
            this.inspectionHUD.focusOn(obj);
            stellarGame.setActiveTool(undefined);

            // Remove focus from previous
            if (this.focus)
                this.focus.inFocus = false;

            this.focus = obj;
            obj.inFocus = true;
            // Lock the camera
            this.camera.focusOn({
                target : obj,
                distance : .8
            });
            
            this.setZoom(.1);
            
            // May need to check that this is not the star we start with
            stellarGame.qManager.satisfy("Navigating Space", 2);
        },

        isOnScreen : function(p) {
            var w = P_WIDTH - (SCREEN_BORDER * 2);
            var h = P_HEIGHT - (SCREEN_BORDER * 2);
            return p.z > 0 && utilities.within(p.x, -w / 2, w / 2) && utilities.within(p.y, -h / 2, h / 2);
        },

        onFirstFrame : function() {
            if (time.frame == 0) {
                // Start by focusing on the center star
                this.focusOn(this.universe.startStar);
            }

        },

        // Update according to the current time
        update : function(currentTime) {

            debug.clear();
            inspectionOutput.clear();
            
            debug.output("Focus on " + this.focus);

            // make sure that the ellapsed time is neither to high nor too low
            var time = this.time;
            time.ellapsed = currentTime - time.total;
            if (time.ellapsed === undefined)
                time.ellapsed = .03;
            utilities.constrain(time.ellapsed, .01, .1);

            stellarGame.time.universeTime = time.total;

            time.total = currentTime;
            debug.output("Update " + time.total.toFixed(2) + " fps: " + (1 / time.ellapsed).toFixed(2));

            this.activeQuadrants = [];

            // Compile all of the quadrants that are on screen
            this.universe.quadTree.compileOnscreenQuadrants(this.activeQuadrants, this);

            // Compile all the active objects
            this.activeObjects = [];
            var contentsArrays = [];
            if (stellarGame.options.outputActiveQuads) {
                debug.output(this.activeQuadrants);
            }

            $.each(this.activeQuadrants, function(index, quad) {
                contentsArrays[index] = quad.contents;
            });

            // Compile all the arrays of contents into a single array
            this.activeObjects = this.activeObjects.concat.apply(this.activeObjects, contentsArrays);

            if (stellarGame.options.outputActiveObjects) {
                debug.output("======================================");
                debug.output("updating " + this.activeObjects.length);
                for (var i = 0; i < this.activeObjects.length; i++) {
                    debug.output(i + ": " + this.activeObjects[i]);
                }
                debug.output("======================================");
            }

            // Update the universe
            this.universe.update(time, this.activeObjects);

            // Output to the inspection pane
            this.inspectionHUD.update();

        },
        //=================================================================================
        //=================================================================================
        //=================================================================================
        // Camera Control

        setZoom : function(zoom) {
        	
            this.zoom = zoom;
            debug.output("ZOOM: " + zoom);
            this.camera.setZoom(zoom);
        },

        //=================================================================================
        //=================================================================================
        //=================================================================================
        // Draw

        draw : function(g) {
            var view = this;

            g.colorMode(g.HSB, 1);
            g.ellipseMode(g.CENTER_RADIUS);
            g.background(.55, .8, .1);

            // Translate to screen center
            g.pushMatrix();
            g.translate(g.width / 2, g.height / 2);

            //  drawThreeTest(g);

            // Setup a context object to keep track of the all the drawing stuff
            var context = {
                g : g,
                universeView : this,
                LOD : getLODFromDistance(this.camera.orbitDistance),
                angle : this.camera.orbitPhi,
                time : this.time,
            };

            // Draw eaach layer in order

            context.layer = "bg";
            this.drawLayer(context);

            context.layer = "main";
            this.drawLayer(context);

            context.layer = "overlay";
            this.drawLayer(context);

            if (stellarGame.options.drawActiveQuads) {
                // Draw all the active quads
                $.each(this.activeQuadrants, function(index, leaf) {
                    leaf.drawLeaf(context);
                });
            }

            // draw the quad
            if (stellarGame.options.drawCameraQuad) {
                g.noStroke();
                g.fill(.55, 1, 1, .5);
                this.drawShape(g, this.camera.screenQuadCorners);

                // Test the angle to for the corners
                var testCenter = new Vector(0, 0, 0);
                var edges = this.camera.screenQuadEdges;
                for (var i = 0; i < 4; i++) {

                    // draw the quad corner
                    g.fill(1);
                    var corner = this.camera.screenQuadCorners[i];
                    this.drawText(g, "Corner " + i + " " + corner, corner, 0, 0);

                    var angle = edges[i].getAngleTo(testCenter);
                    var side = edges[i].getSide(testCenter);
                    var testShape = [];
                    var offset = edges[i].getOffset();
                    var offset2 = edges[i].start.getOffsetTo(testCenter);

                    g.stroke(1, 1, 1);
                    testShape[0] = new Vector(edges[i].start);
                    testShape[1] = new Vector(edges[i].start);
                    testShape[1].addMultiple(offset2, .7)
                    testShape[2] = new Vector(edges[i].start);
                    testShape[2].addMultiple(offset, .3)

                    var angle = offset.getAngleTo(offset2);
                    testShape[2] = new Vector(edges[i].start);
                    testShape[2].addPolar(30, angle);

                }
            }

            // Draw the touch
            var touch = stellarGame.touch;

            if (touch.activeTool === undefined) {

            } else {
                if (touch.planePosition && touch.pressed) {
                    var scale = 500 / touch.screenPosition.z;
                    touch.activeTool.drawCursor(g, touch.screenPosition, scale);
                }
            }

            // Draw the camera's plane positions

            g.popMatrix();

        },

        // calculate whether each corner is inside the box
        drawInsideTest : function(g, corners) {

        },

        drawLayer : function(context) {
            var view = this;
            var screenPos = new Vector(0, 0);
            context.screenPos = screenPos;

            this.universe.draw(context);
            var drawAll = true;
            $.each(this.activeObjects, function(index, obj) {

                var centerDistance = view.camera.position.getDistanceTo(obj.position);

                // Figure out the actual lod of this object
                context.LOD = getLODFromDistance(view.camera.orbitDistance + centerDistance);

                /*
                if (view.focus !== undefined) {
                console.log(view.focus);
                if (view.focus === obj)
                context.LOD = 1;
                else
                context.LOD = 12;
                }
                */

                // If this object should draw at all at this distance
                if (drawAll || obj.minLOD === undefined || obj.minLOD >= context.LOD.index) {
                    // figure out where this object is, and translate appropriately
                    g.pushMatrix();

                    // convert into the screen positon

                    view.convertToScreenPosition(obj.position, context.screenPos);
                    context.distanceScale = Math.pow(500 / screenPos.z, 1);
                    if (!obj.drawUntransformed && obj.position !== undefined) {

                        g.translate(screenPos.x, screenPos.y);
                        g.scale(context.distanceScale, context.distanceScale);

                    }

                    obj.draw(context);
                    g.popMatrix();
                }
            });

        },
        
        getTouchableAt : function(target) {
            debugTouch.output("Get touchable at " + target);
            var touchables = [];

            var minDist = 40;
            // go through all the objects and find the closest (inefficient, but fine for now)

            var length = this.activeObjects.length;
            $.each(this.activeObjects, function(index, obj) {

                if (obj !== undefined && obj.touchable) {

                    var d = obj.position.getDistanceTo(target);

                    if (obj.radius)
                        d -= obj.radius;

                    if (d < minDist) {

                        touchables.push(obj);

                    }
                }

            });

            return touchables;

        },

        //============================================================================
        //============================================================================
        //============================================================================
        //============================================================================
        // Create a camera from Three.js

        createThreeCamera : function() {
            var view = this;
            // set the scene size
            var createTestScene = false;

            // create a WebGL renderer, camera
            // and a scene
            var camera = this.camera;
            camera.setView(this);
            camera.screenQuadCorners = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)];
            camera.screenQuadEdges = [];
            for (var i = 0; i < 4; i++) {
                camera.screenQuadEdges[i] = new Edge(camera.screenQuadCorners[i], camera.screenQuadCorners[(i + 1) % 4]);
            }

            var threeCamera = this.camera.threeCamera;
            this.projector = new THREE.Projector();

        },
        createTestScene : function() {
            var view = this;
            var scene, renderer, threeCamera;

            threeCamera = camera.threeCamera;
            camera.testRender = function() {

                renderer.render(scene, threeCamera);
            };

            scene = new THREE.Scene();

            // add the camera to the scene
            scene.add(camera.threeCamera);

            // Create a test scene

            // start the renderer

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(P_WIDTH, P_HEIGHT);

            // attach the render-supplied DOM element
            $("#three_window").append(renderer.domElement);

            // set up the sphere vars
            var radius = 50, segments = 16, rings = 16;

            // create a new mesh with
            // sphere geometry - we will cover
            // the sphereMaterial next!
            // create the sphere's material
            var sphereMaterial = new THREE.MeshLambertMaterial({
                color : 0xCC0000
            });

            var sphere = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), sphereMaterial);

            // add the sphere to the scene
            scene.add(sphere);

            var pointLight = new THREE.PointLight(0xFFFFFF);

            // set its position
            pointLight.position.x = 320;
            pointLight.position.y = 250;
            pointLight.position.z = 330;

            // add to the scene
            scene.add(pointLight);

            // draw!

            view.frame = 0;

            // shim layer with setTimeout fallback
            window.requestAnimFrame = (function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            (function animloop() {
                view.frame++;
                requestAnimFrame(animloop);
                camera.testRender();
            })();

        },
        drawThreeTest : function(g) {

            var detail = 4;
            var spacing = 60;
            g.noStroke();
            var screenPos = new Vector();
            var worldPos = new Vector();
            for (var i = 0; i <= detail; i++) {
                for (var j = 0; j <= detail; j++) {
                    for (var k = 0; k <= detail; k++) {
                        worldPos.setTo((i - detail / 2) * spacing, (j - detail / 2) * spacing, (k - detail / 2) * spacing);

                        this.convertToScreenPosition(worldPos, screenPos);
                        g.fill(.9 * i / detail + .04, j / detail, k / detail);

                        var r = 2 * spacing * 126 / screenPos.z;
                        g.ellipse(screenPos.x, screenPos.y, r, r);
                        //  g.text(Math.round(screenPos.z), screenPos.x + 5, screenPos.y + 5);
                    }
                }
            }
        },

        // Draw a shape with some number of points
        drawShape : function(g, points) {
            var screenPos = new Vector();
            g.beginShape();

            var screenPositions = "";
            var s = "";

            // Convert all the points to screen pos
            for (var i = 0; i < points.length; i++) {
                var inFrontOfCamera = this.convertToScreenPosition(points[i], screenPos);
                if (stellarGame.options.outputShapeDrawing) {
                    screenPositions += screenPos;
                    s += points[i];
                }
                if (inFrontOfCamera)
                    screenPos.vertex(g);
            }
            g.endShape(g.CLOSE);

        },
        drawText : function(g, text, center, xOffset, yOffset) {
            var screenPos = new Vector();
            this.convertToScreenPosition(center, screenPos);
            g.text(text, screenPos.x + xOffset, screenPos.y + yOffset);

        },

        //============================================================================
        //============================================================================
        //============================================================================
        //============================================================================
        // Converting position

        convertToScreenPosition : function(p, screenPos) {

            var threeVector = new THREE.Vector3();
            p.cloneInto(threeVector)

            var d = p.getDistanceTo(this.camera.threeCamera.position);

            var ray = Vector.sub(p, this.camera.threeCamera.position);
            if (!this.camera.forward)
                return false;

            var angle = Vector.angleBetween(this.camera.forward, ray);

            var threeScreen = this.projector.projectVector(threeVector, this.camera.threeCamera);
            var scale = .5;
            screenPos.setTo(threeScreen.x * P_WIDTH * scale, -threeScreen.y * P_HEIGHT * scale, d);

            if (angle < 0)
                return false;
            return true;
        },
        projectToPlanePosition : function(screenPos, planePos) {
            // Calculate the intersection with the ground plane
            var camera = this.camera;
            var sweep = .0215;
            var p = new Vector(camera.orbitPosition);
            var v = new Vector(0, 0, 0);
            var x = (screenPos.x);
            var y = (-screenPos.y);
            v.addMultiple(camera.forward, 20);
            v.addMultiple(camera.up, sweep * y);
            v.addMultiple(camera.right, sweep * x);

            var m = -p.z / v.z;
            planePos.setTo(camera.orbitPosition);
            planePos.addMultiple(v, m);

        },

        //============================================================================
        //============================================================================
        //============================================================================
        //============================================================================
        // Setting zoom

        setCamera : function(value) {
            if (value.distance !== undefined)
                this.camera.distance = value.distance;
            if (value.rotation !== undefined)
                this.camera.rotation = value.rotation;

            if (value.zoom !== undefined)
                this.camera.zoom = value.zoom;
        }
    });
    //======

    return UniverseView;

});

