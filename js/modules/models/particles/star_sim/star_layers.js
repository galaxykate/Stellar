/**
 * @author Kate Compton
 */

var starSimPrefix = "modules/models/particles/star_sim/";
define(["modules/models/elementSet", starSimPrefix + "star_layer_graph", starSimPrefix + "star_layer_bubble", starSimPrefix + "fusion", "modules/models/particles/dust"], function(ElementSet, LayerGraph, LayerBubble, Fusion, Dust) {
    var calculateShellVolume = function(innerR, outerR) {
        return (4 / 3) * Math.PI * (Math.pow(outerR, 2) - Math.pow(innerR, 2));
    };
    var graphDetail = 30;
    var minTerritory = 10;

    var StarLayers = Class.extend({

        init : function(star) {
            var layers = this;
            this.star = star;
            this.bubbles = [];

            this.screenScale = 1;

            this.radius = 10;
            this.screenRadius = 250;
            this.setRadius(90);
            this.mass = 0;

            this.fusionJuice = 0;
            this.burnRate = 0;
            this.luminosity = 0;
            this.zoomScale = 1;

            this.divPool = [];
            this.fusions = [];

            var maxBubbles = 120;
            this.divHolder = $("#inspection_layer_elements");
            this.bubbleInspector = $("#inspection_bubble_inspector");
            this.bubbleInspector.hide();

            for (var i = 0; i < maxBubbles; i++) {
                this.createBubbleDiv(i);
            }

            this.graphs = {

                moles : new LayerGraph(this, "moles", graphDetail),
                volume : new LayerGraph(this, "volume", graphDetail),
                kineticEnergy : new LayerGraph(this, "kinEnergy", graphDetail),

                temperature : new LayerGraph(this, "temperature", graphDetail),
                gasPressure : new LayerGraph(this, "gasPressure", graphDetail),
                mass : new LayerGraph(this, "mass", graphDetail),
                gravity : new LayerGraph(this, "gravity", graphDetail),
                /*
                 radiationPressure : new LayerGraph(this, "radPressure", graphDetail),
                 */
            }

            var graphIndex = 0;
            $.each(this.graphs, function(index, graph) {
                graph.setDisplayNumber(graphIndex);
                graphIndex++;
            });

            // Make a bunch of layer bubbles
            for (var i = 0; i < 5; i++) {
                var index = Math.round(Math.random() * Math.random() * 1);
                var element = ElementSet.activeElements[index];
                var bubble = this.addBubble(element);
                bubble.position.y = -(i + 1) * this.radius / 10 + 10 * Math.random();
            }

            this.graphDiv = $("#inspection_graph_labels");
            // Create labels for each graph
            $.each(this.graphs, function(index, graph) {
                $("<div/>", {
                    id : graph.name + "_label",
                    "class" : "inspector_graph_label",
                    html : graph.name,

                }).appendTo(layers.graphDiv);

                graph.label = $("#" + graph.name + "_label");
                graph.label.css({
                    left : Math.round(graph.position.x) + "px",
                    top : Math.round(graph.position.y) + "px"
                })
            });
        },

        setRadius : function(radius) {
            //this.radius = radius;
            this.radius = radius;

            // Zoom the camera to where this fits on screen
            var zoomRadius = .095 * Math.pow(this.radius, .5);
            stellarGame.universeView.setZoom(zoomRadius, false);

            // What is the correct zoom scale to fit this on screen?
            var targetZoomScale = 300 / this.radius;
            var focusScale = this.star.focusScale;
            this.zoomScale = utilities.lerp(targetZoomScale, this.zoomScale, .98);

        },

        //=========================================================================
        //=========================================================================
        //=========================================================================
        // Div management

        openBubbleInspector : function(div) {
            var inspector = this.bubbleInspector;

            // Only open it if its not currently in use
            if (inspector.bubble === undefined) {

                inspector.bubble = div.bubble;
                inspector.show();
                inspector.html("Look, it's a " + div.bubble.element.name);
                inspector.css({
                    opacity : 1,
                    width : "auto",
                    height : "auto",

                    left : div.bubble.screenX,
                    top : div.bubble.screenY,

                });
            }
        },
        closeBubbleInspector : function(div) {
            var inspector = this.bubbleInspector;

            if (inspector.bubble === div.bubble) {
                // this.bubbleInspector.hide();
                inspector.bubble = undefined;
                inspector.html("");
                inspector.css({
                    width : "0px",
                    height : "0px",
                    opacity : 0,

                });
            }
        },
        createBubbleDiv : function(idNumber) {
            var layers = this;
            var r = 120;
            var id = "element_bubble" + idNumber;
            $('<div/>', {
                html : "???",
                class : "element_bubble",
                id : id,

            }).appendTo(this.divHolder);

            var div = $("#" + id);
            div.css({
                left : Math.round(Math.random() * 1200) + "px",
                top : Math.round(Math.random() * 1200) + "px",
                width : r + "px",
                height : r + "px",
            });
            div.hide();

            // Create the return-to-pool function for when it's not needed
            div.returnToPool = function() {
                layers.divPool.push(this);
                this.hide();
            };

            // Create a popup overlay for this
            div.hover(function() {
                layers.openBubbleInspector(div)
            }, function() {
                layers.closeBubbleInspector(div)
            });

            layers.divPool.push(div);

        },
        getFreeDiv : function() {
            var div = this.divPool.pop();

            // activate
            if (div) {
                div.show();
            }
            return div;
        },

        //=========================================================================
        //=========================================================================
        //=========================================================================

        addBubble : function(element) {
            var bubble = new LayerBubble(this, element);

            bubble.position.y = -this.radius;
            bubble.position.x = (bubble.idNumber % 5 - 2) * 2.43;

            this.bubbles.push(bubble);
            return bubble;
        },
        applyToBubbles : function(fxn, arg) {
            $.each(this.bubbles, function(index, bubble) {
                bubble[fxn](arg);
            });
        },

        // Calculate the pressure from all the other bubbles on this bubble
        getForceOn : function(target) {
            var layers = this;
            var pressureForce = new Vector();

            var temperature = this.getValue("temperature", target.y);
            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[i];
                if (bubble !== target) {
                    var offset = target.position.getOffsetTo(bubble.position);

                    var d = offset.magnitude();
                    if (d === 0) {
                        offset.x = 1;
                        d = 1;
                    }

                    var d2 = Math.max(0, d - (target.radius - bubble.radius));

                    var power = 20 * Math.pow(d2, -.7) * stellarGame.tunings.bubbleForce;
                    power = utilities.constrain(power, 0, 1000);
                    pressureForce.addMultiple(offset, -power / d);

                    if (Fusion.canFuse(bubble, target, d)) {

                        var reaction = Fusion.getReactionFor(bubble, target, temperature);
                        if (reaction !== undefined)
                            layers.potentialFusions.push(new Fusion(layers, bubble, target, reaction));
                    }
                }
            }

            return pressureForce;
        },

        generateGraphs : function() {
            var layers = this;
            var gasConstant = stellarGame.tunings.gasPressureConstant;

            // Clear and set all the graphs
            $.each(this.graphs, function(index, graph) {
                graph.clear();
            });

            // Set the volume of each layer
            var stepSize = this.radius / graphDetail;
            this.graphs.volume.displayMultiplier = .01;

            for (var i = 0; i < graphDetail; i++) {
                var innerR = i * stepSize;
                var outerR = (i + 1) * stepSize;

                var volume = calculateShellVolume(innerR, outerR);
                this.graphs.volume.set(i, volume);
            }

            // Add all the kinetic energy of the bubbles
            //  each bubble has a territory of at least n
            var moles = this.graphs.moles;
            var mass = this.graphs.mass;
            moles.displayMultiplier = 30;

            var kineticEnergy = layers.graphs.kineticEnergy;
            kineticEnergy.displayMultiplier = 3;
            $.each(this.bubbles, function(index, bubble) {
                var start = bubble.territory.innerRadius;
                var end = bubble.territory.outerRadius;
                if (end - start < minTerritory)
                    end = start + minTerritory;

                var range = (end - start) / stepSize;

                kineticEnergy.addValue(bubble.kineticEnergy / range, start, end);

                moles.addValue(1 / range, start, end);
                mass.addValue(bubble.mass / range, start, end);

            });

            var temperature = this.graphs.temperature;
            temperature.displayMultiplier = 30;
            // Set all the temperature layers
            //   What temperature is a layer?  The sum of all the kinetic energy in it, divided by the volume
            for (var i = 0; i < graphDetail; i++) {
                var temp = kineticEnergy.values[i] / this.graphs.volume.values[i];
                temperature.set(i, temp);
            }

            // Calculate the gas pressure
            var gasPressure = this.graphs.gasPressure;
            gasPressure.displayMultiplier = 130;
            for (var i = 0; i < graphDetail; i++) {
                var press = moles.values[i] * gasConstant * temperature.values[i] / this.graphs.volume.values[i];

                gasPressure.set(i, press);
            }
            gasPressure.blur();

            // Calculate the cumulative mass and gravity
            var gravity = this.graphs.gravity;
            var cumMass = 0;
            for (var i = 0; i < graphDetail; i++) {
                cumMass += mass.values[i];
                var r = stepSize * (i + 1);
                var g = cumMass / r + 1;
                gravity.set(i, g);
            }

            $.each(this.graphs, function(index, graph) {
                graph.calculateTotal();
            });
        },
        getValue : function(graphName, y) {
            return this.graphs[graphName].sampleAt(y);
        },
        updateSimulation : function(time) {
            this.potentialFusions = [];
            var layers = this;

            this.mass = 0;

            this.generateGraphs();

            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[i];
                this.mass += bubble.mass;

                // Get the thermal pressure for the top and bottom
                bubble.upwardsPressure = 0;
                bubble.downwardsPressure = 0;

            }

            // Simulate the motion of all the bubbles
            this.applyToBubbles("beginUpdate", time);
            this.applyToBubbles("addForces", time);

            // Add fusion pulls
            $.each(this.fusions, function(index, fusion) {
                fusion.applyForce(time);
            });

            this.applyToBubbles("updatePosition", time);
            this.applyToBubbles("finishUpdate", time);

            // sort the bubbles
            this.bubbles.sort(function(a, b) {
                return -a.position.y + b.position.y;
            });

            // Update the radius
            var targetRadius = this.bubbles[this.bubbles.length - 1].territory.outerRadius;
            this.setRadius(utilities.lerp(this.radius, targetRadius, .04));

            // Set the territories
            var innerRadius = 0;
            $.each(this.bubbles, function(index, bubble) {
                // Limit the bubbles positions
                var min = .5 * (1 + Math.sin(bubble.idNumber + time.total));
                var max = -.5 * (1 + Math.sin(bubble.idNumber + time.total)) + layers.radius + 10000;
                bubble.position.y = -utilities.constrain(-bubble.position.y, min, max);

                var outerRadius = Math.abs(bubble.position.y);
                bubble.setTerritory(innerRadius, outerRadius);
                innerRadius = outerRadius;

            });

            // bubbles lose a little energy

            $.each(this.bubbles, function(index, bubble) {
                bubble.energyLoss = bubble.kineticEnergy * .1 * time.ellapsed;
                bubble.kineticEnergy -= bubble.energyLoss;
            });

            var total = 0;

            // Attempt to fuse

            //  layers.fusionJuice += stellarGame.tunings.juiceRefill * .001 * layers.graphs.temperature.total;

            // Start some number of fusions
            layers.fusionJuice += 20 * layers.graphs.gasPressure.total / layers.radius;
            $.each(layers.potentialFusions, function(index, fusion) {
                if (layers.fusionJuice > 200) {
                    layers.fusionJuice -= 200;
                    layers.fusions.push(fusion);
                    fusion.start();
                    console.log("start " + fusion);
                } else {
                    fusion.cancel();
                }

            });
            layers.fusionJuice *= .98;

            $.each(this.fusions, function(index, fusion) {

                // Spend some juice to activate fusions
                fusion.update(time);
            });

            // Cleanup
            this.bubbles = _.filter(this.bubbles, function(bubble) {
                return !bubble.deleted;
            });

            this.fusions = _.filter(this.fusions, function(fusion) {
                return !fusion.deleted;
            });

            if (this.radius < 10)
                this.supernova();

        },

        supernova : function() {
            stellarGame.universeView.unfocus();
            this.star.remove();

            // Create a bunch of dust
            for (var i = 0; i < this.bubbles.length; i++) {
                var radius = 1 + 2*Math.pow(i, .7);
                var theta = 5 + 1.2*Math.pow(i, .7);
                var d = new Dust();
                d.drag = .97;
                d.position.setTo(this.star.position);
                d.position.addPolar(radius, theta);
                d.velocity.setToPolar(30 + 120*Math.random(), theta);
                d.elements.set(this.bubbles[i].element, 1);
                stellarGame.universe.spawn(d);
                console.log(d);
                
            }
        },

        draw : function(g) {
            var layers = this;

            g.fill(1, 0, 1, .3);
            g.ellipse(0, 0, this.radius, this.radius);
            //   this.screenScale = this.star.focusScale;
            this.screenRadius = this.radius * this.zoomScale;

            // Draw graphs
            var graphOffset = 10;
            var side = 1;
            $.each(this.graphs, function(index, graph) {

                graph.draw(g, layers.screenRadius);

                graphOffset += 20;

                side *= -1;
            });

            // Draw the bubbles territories

            for (var i = 0; i < this.bubbles.length; i++) {
                this.bubbles[i].drawTerritory(g);
            }

            // Draw bg
            $.each(this.bubbles, function(index, bubble) {
                g.pushMatrix();
                bubble.position.translateTo(g);
                bubble.drawBackground(g);
                g.popMatrix();
            });

            // Draw main
            $.each(this.bubbles, function(index, bubble) {
                g.pushMatrix();
                bubble.position.translateTo(g);
                bubble.drawMain(g);
                g.popMatrix();
            });

            // Draw all potential fusions
            $.each(this.fusions, function(index, fusion) {
                fusion.draw(g, layers.zoomScale);
            });

        },
    });

    return StarLayers;
});

