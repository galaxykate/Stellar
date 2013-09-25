/**
 * @author Kate Compton
 */

define(["inheritance", "modules/models/vector", "uparticle", "three"], function(Inheritance, Vector, UParticle, THREE) {
    return (function() {

        // Make the star class
        //  Extend the star
        var Camera = UParticle.extend({

            init : function() {
                this._super();
                this.zoom = 1;
                this.rotation = -Math.PI;
                this.name = "Camera";
                this.drawUntransformed = true;

                // set some camera attributes
                this.width = screenResolution.width;
                this.height = screenResolution.height;
                var VIEW_ANGLE = 45, ASPECT = this.width / this.height, NEAR = 0.001, FAR = 100000;
                this.threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                this.setZoom(1);
            },

            setView : function(universeView) {
                this.universeView = universeView;
            },

            setZoom : function(value) {

                this.distance = Math.pow(value, 3) + .01;
                this.zoom = value;

            },

            finishUpdate : function(time) {
                //utilities.debugOutput("Camera pos: " + this.position);
                this._super(time);

                // Set to the current orbit
                var angle = -Math.PI / 2 - .1 - this.zoom;
                this.setOrbit(100 + this.distance * 1000, this.rotation, Math.PI + angle);

            },

            setOrbit : function(r, theta, phi) {
                var camera = this;
                var threeCamera = this.threeCamera;
                stellarGame.cameraDistance = r;
                camera.orbitDistance = r;
                camera.orbitTheta = theta;
                camera.orbitPhi = phi;
                var center = this.position;
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
                var screenBorder = 20;
                var quadWidth = this.width - screenBorder * 2;
                var quadHeight = this.height - screenBorder * 2;

                for (var i = 0; i < 2; i++) {
                    var xSide = i * 2 - 1;
                    for (var j = 0; j < 2; j++) {
                        var ySide = j * 2 - 1;

                        // Calculate the intersection with the ground plane
                        var x = (i - .5) * quadWidth;
                        var y = (j - .5) * quadHeight;
                        this.universeView.projectToPlanePosition(new Vector(x, y), camera.screenQuadCorners[i * 2 + j]);
                    }
                }
                // Swap 2 and 3
                var temp = new Vector(camera.screenQuadCorners[2]);
                camera.screenQuadCorners[2].setTo(camera.screenQuadCorners[3]);
                camera.screenQuadCorners[3].setTo(temp);

            },
            zoomIn : function() {
                console.log("Zoom in");

            },
            zoomOut : function() {
                console.log("Zoom out");
            },
            drawBackground : function(context) {

            },

            drawMain : function(context) {
                if (stellarGame.options.drawCamera) {
                    g.noFill();
                    g.strokeWeight(1);
                    g.stroke(.55, 1, 1);
                    g.ellipse(0, 0, 50, 50);

                    var segments = 12;
                    var points = [];
                    for (var i = 0; i < segments; i++) {
                        points[i] = new Vector(this.position);
                        points[i].addPolar(30, i * 2 * Math.PI / segments);
                    }
                    context.universeView.drawShape(g, points);
                }
            },
            drawOverlay : function(context) {

            },
        });

        return Camera;
    })();

});
