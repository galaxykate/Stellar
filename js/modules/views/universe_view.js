/**
 * @author Kate Compton
 */

// Display the Universe
// It's using a singleton pattern
define(["processing", "modules/models/vector", "three"], function(PROCESSING, Vector, THREE) {
    console.log("Init universe view");

    return (function() {

        var dimensions = {
            width : 600,
            height : 400
        };

        var processing;
        var universe;

        var activeQuadrants = [];
        var activeObjects = [];

        var time = {
            total : 0,
            ellapsed : 0.1,
        };

        var transformScreenToUniverse = function(p) {
            p.x += camera.center.x;
            p.y += camera.center.y;
        };

        var toWorldPosition = function(p) {
            var p2 = new Vector(p);
            p2.x += camera.center.x;
            p2.y += camera.center.y;
            return p2;

        };

        var update = function(currentTime) {

            // make sure that the ellapsed time is neither to high nor too low
            time.ellapsed = currentTime - time.total;
            if (time.ellapsed === undefined)
                time.ellapsed = .03;
            utilities.constrain(time.ellapsed, .01, .1);

            time.total = currentTime;
            utilities.debugOutput("Update " + time.total.toFixed(2) + " fps: " + (1 / time.ellapsed).toFixed(2));

            var angle = Math.PI / 2 - .1 - camera.zoom;
            camera.setOrbit(camera.center, 300 + camera.distance * 1000, Math.PI / 2, Math.PI + angle);

            universe.update(time, activeObjects);

        };

        var addDrawingUtilities = function(g) {
            g.polarVertex = function(r, theta) {
                this.vertex(r * Math.cos(theta), r * Math.sin(theta));
            }
        };

        var draw = function(g) {
            utilities.clearDebugOutput();

            g.colorMode(g.HSB, 1);
            g.ellipseMode(g.CENTER_RADIUS);

            g.background(.55, .8, .1);
            g.pushMatrix();
            g.translate(g.width / 2, g.height / 2);

            drawThreeTest(g);

            var view = this;

            g.pushMatrix();
            g.translate(-camera.center.x, -camera.center.y);

            // Calculate the active regions
            var border = 120;
            var region = {
                center : camera.center,
                w : dimensions.width + border * 2,
                h : dimensions.height + border * 2
            };
            region.left = region.center.x - region.w / 2;
            region.right = region.center.x + region.w / 2;
            region.top = region.center.y - region.h / 2;
            region.bottom = region.center.y + region.h / 2;

            stellarGame.drawQuadTree = true;

            activeQuadrants = universe.getQuadrantsInRegion(region, []);

            g.popMatrix();

            activeObjects = [];
            // Compile all the active objects

            var contentsArrays = [];
            $.each(activeQuadrants, function(index, quad) {
                contentsArrays[index] = quad.contents;
                //  utilities.debugOutput(quad);
                //     utilities.debugArrayOutput(contentsArrays[index]);

            });
            // Compile all the arrays of contents into a single array
            activeObjects = activeObjects.concat.apply(activeObjects, contentsArrays);
            utilities.debugOutput("Simulating/drawing: " + activeObjects.length + " objects");

            // do update stuff
            update(g.millis() * .001);

            // Draw eaach layer in order
            drawLayer(g, {
                layer : "bg",
            });

            drawLayer(g, {
                layer : "main",
            });

            drawLayer(g, {
                layer : "overlay",
            });

            // Draw the touch
            var touch = stellarGame.touch;

            if (touch.activeTool === undefined) {

            } else {
                touch.activeTool.drawCursor(g, touch.currentPosition);
            }
            g.popMatrix();

        };

        var setoUniversePosition = function(p, screenPos) {
            p.setTo(screenPos);
            p.add(camera.center);
        };

        var setToScreenPosition = function(p, objPos) {
            p.setTo(objPos);
            p.sub(camera.center);

        };

        var drawLayer = function(g, options) {
            var p = new Vector(0, 0);

            universe.draw(g, options);
            $.each(activeObjects, function(index, obj) {
                // figure out where this object is, and translate appropriately
                g.pushMatrix();

                if (!obj.drawUntransformed && obj.position !== undefined) {
                    setToScreenPosition(p, obj.position);

                    g.translate(p.x, p.y);

                }
                obj.draw(g, options);
                g.popMatrix();

            });

        };

        var getTouchableAt = function(p) {

            var touchables = [];
            var target = new Vector(p.x + camera.center.x, p.y + camera.center.y, 0);

            var minDist = 10;
            // go through all the objects and find the closest (inefficient, but fine for now)
            // utilities.debugArrayOutput(activeObjects);

            var length = activeObjects.length;
            $.each(activeObjects, function(index, obj) {

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

        };

        // attaching the sketchProc function to the canvas
        console.log("START UNIVERSE VIEW");
        canvas = document.getElementById("universe_canvas");
        var initProcessing = function(g) {

            addDrawingUtilities(g);
            g.size(dimensions.width, dimensions.height);

            g.colorMode(g.HSB, 1);
            g.background(.45, 1, 1);

            g.draw = function() {
                if (stellarGame.ready) {

                    draw(g);
                }
            };
        };

        function init(u) {
            universe = u;
            camera = universe.getCamera();
            processing = new Processing(canvas, initProcessing);
            createThreeCamera();
        };

        //============================================================================
        //============================================================================
        //============================================================================
        //============================================================================
        // Create a camera from Three.js
        function createThreeCamera() {
            // set the scene size
            var WIDTH = dimensions.width, HEIGHT = dimensions.height;

            // set some camera attributes
            var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

            // create a WebGL renderer, camera
            // and a scene

            camera.threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            camera.threeCamera.position.set(300, 200, 30);

            camera.setOrbit = function(center, r, theta, phi) {
                this.threeCamera.position.set(center.x + r * Math.cos(theta) * Math.cos(phi), center.y + r * Math.sin(theta) * Math.cos(phi), center.z + r * Math.sin(phi));
                this.threeCamera.up = new THREE.Vector3(0, 0, 1);
                this.threeCamera.lookAt(center);
            };

            var scene, renderer, threeCamera;
            threeCamera = camera.threeCamera;
            camera.testRender = function() {

                renderer.render(scene, threeCamera);
            };

            camera.setOrbit(new Vector(), 1200, 1.2, .6);

            // Create a test scene
            scene = new THREE.Scene();

            // add the camera to the scene
            scene.add(camera.threeCamera);

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
            camera.testRender();

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

        };

        function drawThreeTest(g) {

            var detail = 4;
            var spacing = 60;
            g.noStroke();
            var screenPos = new Vector();
            var worldPos = new Vector();
            for (var i = 0; i <= detail; i++) {
                for (var j = 0; j <= detail; j++) {
                    for (var k = 0; k <= detail; k++) {
                        worldPos.setTo((i - detail / 2) * spacing, (j - detail / 2) * spacing, (k - detail / 2) * spacing);

                        convertToScreenPosition(worldPos, screenPos);
                        g.fill(.9 * i / detail + .04, j / detail, k / detail);
                        var d = screenPos.z / 1000;
                        d = Math.pow(d, 2);
                        var r = 10 / d;
                        g.ellipse(screenPos.x, screenPos.y, r, r);
                        //  g.text(Math.round(screenPos.z), screenPos.x + 5, screenPos.y + 5);
                    }
                }
            }
        };

        var projector = new THREE.Projector();
        var threeVector = new THREE.Vector3();
        var convertToScreenPosition = function(p, screenPos) {
            var d = p.getDistanceTo(camera.threeCamera.position);

            p.cloneInto(threeVector)
            var threeScreen = projector.projectVector(threeVector, camera.threeCamera);
            var scale = .5;
            screenPos.setTo(threeScreen.x * dimensions.width * scale, -threeScreen.y * dimensions.height * scale, d);
        };

        //============================================================================
        //============================================================================
        //============================================================================
        //============================================================================

        function setZoom(zoom, distance) {
            camera.zoom = zoom;
            camera.distance = distance;
        };

        return {
            init : init,
            dimensions : dimensions,

            setZoom : setZoom,
            transformScreenToUniverse : transformScreenToUniverse,
            toWorldPosition : toWorldPosition,

            getTouchableAt : getTouchableAt,
        };
    })();

});

