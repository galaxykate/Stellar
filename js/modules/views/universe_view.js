/**
 * @author Kate Compton
 */

// Display the Universe
// It's using a singleton pattern
define(['inheritance', "processing", "modules/models/vector", "edge", "three"], function(Inheritance, PROCESSING, Vector, Edge, THREE) {
    console.log("Init universe view");

    var getModeFromDistance = function(d) {
        var divisions = [300, 350, 500, 1000];
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

    stellarGame.addOption("drawCameraQuad", false);
    var processing;

    var universe;
    // attaching the sketchProc function to the canvas
    console.log("START UNIVERSE VIEW");

    var UniverseView = Class.extend({

        // Initialize this universeView to look at this universe
        init : function(u) {
            console.log("Init View");
            this.universe = u;

            this.dimensions = {
                width : 600,
                height : 400
            };
            this.screenBorder = 80;

            this.activeQuadrants = [];
            this.activeObjects = [];

            this.time = {
                total : 0,
                ellapsed : 0.1,
            };

            this.camera = this.universe.camera;

            // Initialize the universe view to use processing
            var universeView = this;
            initProcessing = function(g) {
                g.size(universeView.dimensions.width, universeView.dimensions.height);

                g.colorMode(g.HSB, 1);
                g.background(.45, 1, 1);

                // Set the drawing function of processing (used for both drawing and updating)
                g.draw = function() {
                    if (stellarGame.ready) {
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
            for (var i = 0; i < 10; i++) {
                var div = $('<div/>', {
                    'class' : 'star_overlay',
                });
                console.log(div);
              
                div.css({
                    top : Math.round(Math.random() * 300) + "px",
                    left : Math.round(Math.random() * 300) + "px",
                });
                
                starUIHolder.append(div);
            }

        },

        isOnScreen : function(p) {
            var w = this.dimensions.width - (this.screenBorder * 2);
            var h = this.dimensions.height - (this.screenBorder * 2);
            return p.z > 0 && utilities.within(p.x, -w / 2, w / 2) && utilities.within(p.y, -h / 2, h / 2);
        },

        // Update according to the current time
        update : function(currentTime) {
            utilities.clearDebugOutput();

            // make sure that the ellapsed time is neither to high nor too low
            var time = this.time;
            time.ellapsed = currentTime - time.total;
            if (time.ellapsed === undefined)
                time.ellapsed = .03;
            utilities.constrain(time.ellapsed, .01, .1);

            stellarGame.time.universeTime = time.total;

            time.total = currentTime;
            utilities.debugOutput("Update " + time.total.toFixed(2) + " fps: " + (1 / time.ellapsed).toFixed(2));

            var angle = -Math.PI / 2 - .1 - this.camera.zoom;
            this.camera.setOrbit(this.camera.center.position, 300 + this.camera.distance * 1000, this.camera.rotation, Math.PI + angle);

            this.activeQuadrants = [];

            // Compile all of the quadrants that are on screen
            this.universe.quadTree.compileOnscreenQuadrants(this.activeQuadrants, this);

            // Compile all the active objects
            this.activeObjects = [];
            var contentsArrays = [];
            $.each(this.activeQuadrants, function(index, quad) {
                contentsArrays[index] = quad.contents;
            });

            // Compile all the arrays of contents into a single array
            this.activeObjects = this.activeObjects.concat.apply(this.activeObjects, contentsArrays);
            utilities.debugOutput("Simulating/drawing: " + this.activeObjects.length + " objects");

            // Update the universe
            this.universe.update(time, this.activeObjects);

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
                mode : getModeFromDistance(this.camera.orbitDistance),
                angle : this.camera.orbitPhi,
            };

            // Draw eaach layer in order
            context.layer = "bg";
            this.drawLayer(context);

            context.layer = "main";
            this.drawLayer(context);

            context.layer = "overlay";
            this.drawLayer(context);

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
                if (touch.planePosition) {
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

            $.each(this.activeObjects, function(index, obj) {

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
            });

        },

        getTouchableAt : function(target) {
            utilities.touchOutput("Get touchable at " + target);
            var touchables = [];

            var minDist = 40;
            // go through all the objects and find the closest (inefficient, but fine for now)
            // utilities.debugArrayOutput(activeObjects);

            var length = this.activeObjects.length;
            $.each(this.activeObjects, function(index, obj) {

                if (obj !== undefined) {

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
            var WIDTH = this.dimensions.width, HEIGHT = this.dimensions.height;
            var createTestScene = false;

            // set some camera attributes
            var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

            // create a WebGL renderer, camera
            // and a scene
            var camera = this.camera;
            camera.screenQuadCorners = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)];
            camera.screenQuadEdges = [];
            for (var i = 0; i < 4; i++) {
                camera.screenQuadEdges[i] = new Edge(camera.screenQuadCorners[i], camera.screenQuadCorners[(i + 1) % 4]);
            }

            this.camera.threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            var threeCamera = this.camera.threeCamera;
            this.projector = new THREE.Projector();

            camera.setOrbit = function(center, r, theta, phi) {
                camera.orbitDistance = r;
                camera.orbitTheta = theta;
                camera.orbitPhi = phi;
                camera.orbitPosition = new Vector(center);
                camera.orbitPosition.addSpherical(r, theta, phi);
                threeCamera.position.set(center.x + r * Math.cos(theta) * Math.cos(phi), center.y + r * Math.sin(theta) * Math.cos(phi), center.z + r * Math.sin(phi));
                threeCamera.up = new THREE.Vector3(0, 0, 1);
                threeCamera.lookAt(center);

                threeCamera.updateMatrix();
                // make sure camera's local matrix is updated
                threeCamera.updateMatrixWorld();
                // make sure camera's world matrix is updated
                threeCamera.matrixWorldInverse.getInverse(threeCamera.matrixWorld);

                // Find the forward, etc vectors for the camera
                var forward = new THREE.Vector3(0, 0, -1);
                forward.applyEuler(threeCamera.rotation, threeCamera.eulerOrder);
                camera.forward = new Vector(forward);

                var up = new THREE.Vector3(0, 1, 0);
                up.applyEuler(threeCamera.rotation, threeCamera.eulerOrder);
                camera.up = new Vector(up);

                var right = new THREE.Vector3(1, 0, 0);
                right.applyEuler(threeCamera.rotation, threeCamera.eulerOrder);
                camera.right = new Vector(right);

                // Calculate the quad points

                for (var i = 0; i < 2; i++) {
                    var xSide = i * 2 - 1;
                    for (var j = 0; j < 2; j++) {
                        var ySide = j * 2 - 1;

                        // Calculate the intersection with the ground plane
                        var x = (i - .5) * (view.dimensions.width - view.screenBorder * 2);
                        var y = (j - .5) * (view.dimensions.height - view.screenBorder * 2);
                        view.projectToPlanePosition(new Vector(x, y), camera.screenQuadCorners[i * 2 + j]);
                    }
                }
                // Swap 2 and 3
                var temp = new Vector(camera.screenQuadCorners[2]);
                camera.screenQuadCorners[2].setTo(camera.screenQuadCorners[3]);
                camera.screenQuadCorners[3].setTo(temp);

            };

            camera.isInScreenQuad = function(p) {
                // Go through all the segments
                var setSide = 0;
                for (var i = 0; i < 4; i++) {
                    var angle = camera.screenQuadEdges[i].getAngleTo(p);
                    utilties.debugOutput(angle);
                }
            };

        },
        createTestScene : function() {
            var scene, renderer, threeCamera;

            threeCamera = camera.threeCamera;
            camera.testRender = function() {

                renderer.render(scene, threeCamera);
            };

            camera.setOrbit(new Vector(0, 0, 0), 1200, 1.2, .6);
            scene = new THREE.Scene();

            // add the camera to the scene
            scene.add(camera.threeCamera);

            // Create a test scene

            // start the renderer

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(WIDTH, HEIGHT);

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

            var frame = 0;

            // shim layer with setTimeout fallback
            window.requestAnimFrame = (function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            (function animloop() {
                frame++;
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
            for (var i = 0; i < points.length; i++) {
                this.convertToScreenPosition(points[i], screenPos);
                screenPos.vertex(g);
                var r = 300;
                var theta = 2 * i * Math.PI / points.length;
                // g.vertex(r * Math.cos(theta), r * Math.sin(theta));
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
            var d = p.getDistanceTo(this.camera.threeCamera.position);

            p.cloneInto(threeVector)
            var threeScreen = this.projector.projectVector(threeVector, this.camera.threeCamera);
            var scale = .5;
            screenPos.setTo(threeScreen.x * this.dimensions.width * scale, -threeScreen.y * this.dimensions.height * scale, d);
        },

        projectToPlanePosition : function(screenPos, planePos) {
            // Calculate the intersection with the ground plane
            var camera = this.camera;
            var sweep = .0415;
            var p = new Vector(camera.orbitPosition);
            var v = new Vector(0, 0, 0);
            var x = (screenPos.x);
            var y = (screenPos.y);
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

