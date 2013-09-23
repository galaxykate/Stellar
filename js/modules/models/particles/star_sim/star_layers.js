/**
 * @author Kate Compton
 */

var starSimPrefix = "modules/models/particles/star_sim/";
define(["modules/models/elementSet", starSimPrefix + "star_layer_graph", starSimPrefix + "star_layer_bubble", starSimPrefix + "fusion"], function(ElementSet, LayerGraph, LayerBubble, Fusion) {

    var StarLayers = Class.extend({

        init : function(star) {
            var layers = this;
            this.star = star;
            this.bubbles = [];

            this.gravity = 1;

            this.setRadius(90);
            this.mass = 0;
            this.gravity = 0;
            this.fusionJuice = 0;
            this.burnRate = 0;
            this.luminosity = 0;

            this.divPool = [];
            this.fusions = [];

            var maxBubbles = 120;
            this.divHolder = $("#inspection_layer_elements");
            this.bubbleInspector = $("#inspection_bubble_inspector");
            this.bubbleInspector.hide();

            for (var i = 0; i < maxBubbles; i++) {
                this.createBubbleDiv(i);
            }

            var graphDetail = 30;
            this.graphs = {
                energy : new LayerGraph(this, "energy", graphDetail),
                temperature : new LayerGraph(this, "temperature", graphDetail),
            }

            this.graphs.temperature.logScale = true;

            // Make a bunch of layer bubbles
            for (var i = 0; i < 5; i++) {
                var index = Math.round(Math.random() * Math.random() * 1);
                var element = ElementSet.activeElements[index];
                var bubble = this.addBubble(element);
                bubble.position.y = -(i + 1) * this.radius / 10;
                bubble.position.x = (i%5 - 2)*3;
            }
        },

        setRadius : function(radius) {
            this.radius = radius;
            // Zoom the camera to where this fits on screen
            var zoomRadius = .015 * Math.pow(radius, .7);
            stellarGame.universeView.setZoom(zoomRadius, false);
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
            bubble.initAsParticle();
            bubble.mass = element.number;
            bubble.position.y = -this.radius;
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

                    var power = 100 * Math.pow(d2, -.7) * stellarGame.tunings.bubbleForce;
                    power = utilities.constrain(power, 0, 1000);
                    pressureForce.addMultiple(offset, -power / d);

                    if (Fusion.canFuse(bubble, target, d)) {
                        var temperature = 1000;
                        var reaction = Fusion.getReactionFor(bubble, target, temperature);
                        if (reaction !== undefined)
                            layers.potentialFusions.push(new Fusion(layers, bubble, target, reaction));
                    }
                }
            }

            return pressureForce;
        },

        updateSimulation : function(time) {
            this.potentialFusions = [];
            var layers = this;

            this.mass = 0;

            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[i];
                this.mass += bubble.mass;

                // Get the thermal pressure for the top and bottom
                bubble.upwardsPressure = 0;
                bubble.downwardsPressure = 0;
                if (i > 0)
                    bubble.upwardsPressure = this.bubbles[i - 1].getThermalPressure();
                if (i < this.bubbles.length - 1)
                    bubble.downwardPressure = this.bubbles[i + 1].getThermalPressure();

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

            // Set the territories
            var innerRadius = 0;
            $.each(this.bubbles, function(index, bubble) {
                var min = -5 * (1 + Math.sin(bubble.idNumber + time.total));
                bubble.position.y = Math.min(bubble.position.y, min);

                var outerRadius = bubble.position.y;
                bubble.setTerritory(innerRadius, outerRadius);
                innerRadius = outerRadius;

            });

            // Clear and set all the graphs
            $.each(this.graphs, function(index, graph) {
                graph.clear();
            });

            $.each(this.bubbles, function(index, bubble) {
                // bubbles lose a little energy
                bubble.energyLoss = bubble.energy * .1 * time.ellapsed;
                bubble.energy -= bubble.energyLoss;

                layers.graphs.energy.addValue(bubble.energy, bubble.territory);
                layers.graphs.temperature.addValue(20000 * bubble.energy / bubble.territory.volume, bubble.territory);
            });

            layers.graphs.temperature.blur();
            var total = 0;

            // Attempt to fuse

            layers.fusionJuice += stellarGame.tunings.juiceRefill * .001 * layers.graphs.temperature.total;

            // Start some number of fusions
            $.each(layers.potentialFusions, function(index, fusion) {
                if (layers.fusionJuice > 2000) {
                    layers.fusionJuice -= 2000;
                    layers.fusions.push(fusion);
                    fusion.start();
                } else {
                    fusion.cancel();
                }

            });
            layers.fusionJuice *= .9;

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

            this.gravity = stellarGame.tunings.gravity * Math.max(1, Math.pow(this.mass, .6) * .1);

        },
        draw : function(g) {
            this.setRadius(this.radius);

            // Draw graphs
            var graphOffset = 10;
            var side = 1;
            $.each(this.graphs, function(index, graph) {

                graph.draw(g, graphOffset, side);

                if (index % 2 === 1)
                    graphOffset += 40;

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
                fusion.draw(g);
            });
        },
    });

    return StarLayers;
});

