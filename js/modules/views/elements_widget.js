/**
 * @author Kate Compton
 */

define(["modules/models/elementSet", "inheritance", "modules/models/vector", "modules/models/tools/feed", "raphael"], function(ElementSet, inheritance, Vector, FeedTool, RAPHAEL) {

    var makePolarSVG = function(r, theta, offset) {
        return Math.round(r * Math.cos(theta) + offset.x) + " " + Math.round(r * Math.sin(theta) + offset.y);
    };

    var makeWedgeLinepath = function(innerRadius, outerRadius, theta0, theta1, offset) {
        var linepath = "";
        linepath += 'M ' + makePolarSVG(outerRadius, theta0, offset);
        linepath += ' L ' + makePolarSVG(outerRadius, theta1, offset);
        linepath += ' L ' + makePolarSVG(innerRadius, theta1, offset);
        linepath += ' L ' + makePolarSVG(innerRadius, theta0, offset);
        linepath += ' z';
        return linepath;
    };

    // Create a widget to control the elements in your inventory
    var ElementsWidget = Class.extend({
        init : function(div) {
            var widget = this;
            stellarGame.player.setWidget(this);
            div.html("HELLO WIDGET");

            this.activeElement = undefined;

            // Create a round thing?
            this.ringCenter = new Vector(0, 0);
            this.ringRadius = 120;
            this.ringHolder = $('<div/>', {
                id : "element_widget_ring"
            });
            div.append(this.ringHolder);

            // create svg
            widget.graph = Raphael(document.getElementById('element_widget_ring'), 170, 170);

            // create all the element holders
            widget.elementHolders = [];
            this.activeElements = ElementSet.activeElements;

            $.each(ElementSet.activeElements, function(index, element) {
                var holder = widget.createElementHolder(element, index);
                widget.elementHolders.push(holder);
            });

        },

        resetAngles : function() {
            var widget = this;
            var totalAngle = Math.PI / 2;
            this.activeAngle = .4;
            var n = this.activeElements.length;
            var spacing = .02;
            // calculate all the angles
            if (this.activeElement)
                this.subAngle = (totalAngle - this.activeAngle) / n;
            else
                this.subAngle = (totalAngle - (n - 1) * spacing) / n;

            // Set the positions for all the elements
            var angle = 0;

            $.each(this.elementHolders, function(index, holder) {
                holder.ballRadius = 10;
                holder.ringRadius = 140;
                holder.startTheta = angle;

                if (holder.element !== widget.activeElement) {
                    holder.endTheta = angle + widget.subAngle;

                } else {
                    holder.endTheta = angle + widget.activeAngle;
                    holder.ringRadius *= 1.2;
                    holder.ballRadius *= 2.8;

                }

                angle = holder.endTheta + spacing;

            });

        },

        resetPositions : function() {
            this.elementBelt = stellarGame.player.elementBelt;

            var widget = this;

            $.each(this.elementHolders, function(index, holder) {
                var theta = (holder.endTheta + holder.startTheta) / 2;

                var x = Math.round(widget.ringCenter.x + holder.ringRadius * Math.cos(theta));
                var y = Math.round(widget.ringCenter.y + holder.ringRadius * Math.sin(theta));

                holder.div.css({
                    left : (x - holder.ballRadius) + "px",
                    top : (y - holder.ballRadius) + "px",
                    width : holder.ballRadius * 2 + "px",
                    height : holder.ballRadius * 2 + "px",
                });

                widget.resetBar(index, holder);
            });
        },

        resetBar : function(index, holder) {
            var widget = this;
            var amt = widget.elementBelt.quantity.elementQuantity[index];
            var capacity = widget.elementBelt.capacity[index];

            var pct = amt / capacity;
            var element = ElementSet.activeElements[index];

            var bgPath = makeWedgeLinepath(20, holder.ringRadius, holder.startTheta, holder.endTheta, widget.ringCenter);
            var barPath = makeWedgeLinepath(holder.ringRadius, holder.ringRadius * (1 - pct * .7), holder.startTheta, holder.endTheta, widget.ringCenter);

            holder.svgBG.attr("path", bgPath);
            holder.svgBar.attr("path", barPath);
            var element = holder.element;
            var hex = element.idColor.toHex();

            holder.svgBar.attr({
                fill : "#" + hex,
                stroke : 'none',
                'stroke-width' : 5
            });

            holder.svgBG.attr({
                fill : "#" + holder.bgColor.toHex(),
                stroke : 'none',
                'stroke-width' : 5
            });

        },

        disable : function(element) {

        },

        enable : function(element) {

        },

        deactivate : function(element) {
            if (this.activeElement === element) {
                this.activeElement = undefined;
                this.resetAngles();
                this.resetPositions();
            }
        },

        setActiveElement : function(element) {
            console.log("SET ACTIVE ELEMENT " + element);
            this.activeElement = element;
            this.resetAngles();
            this.resetPositions();
        },

        //====================================================================
        //====================================================================
        //====================================================================
        //====================================================================

        createElementHolder : function(element, index) {
            var widget = this;
            var theta = index * .2;

            var elementHolder = {
                div : $('<div/>', {
                    html : element.name,

                    "class" : "element_widget_element"
                }),

                excitement : {
                    power : 0,
                },

                svgBG : widget.graph.path("M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z"),
                svgBar : widget.graph.path("M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z"),
                bgColor : element.idColor.cloneShade(-.4, 1),
                highlightColor : element.idColor.cloneShade(.5, 1),
                element : element,
            }

            var onFeed = function() {
                console.log("FEEED " + elementHolder.element);
                elementHolder.excitement.power = 1;
                widget.resetBar(index, elementHolder);
                // update the amount in the bar
            };

            // Create a tool
            elementHolder.tool = new FeedTool(stellarGame.player.elementBelt.quantity, element, 1, onFeed);

            var div = elementHolder.div;
            this.ringHolder.append(div);

            //==========
            // Processing?
            var canvasFrameDiv = $('<div/>', {
                id : element.name + "_holder_frame",

                "class" : "element_holder_frame"
            });
            var canvasDiv = $('<canvas/>', {
                id : element.name + "_holder_canvas",
                html : element.name,

                "class" : "element_holder_canvas"
            });

            canvasDiv.appendTo(canvasFrameDiv);
            canvasFrameDiv.appendTo(div);

            var labelDiv = $('<div/>', {
                id : element.name + "_holder_label",
                html : element.name,

                "class" : "element_holder_label"
            });

            function initProcessing(processing) {
                var g = processing;
                var t = 0;
                g.ellipseMode(g.CENTER_RADIUS);
                processing.draw = function() {
                    var active = widget.activeElement === element
                    if (active)
                        t += .1 * (elementHolder.excitement.power + .05);
                    else
                        t += .003;

                    elementHolder.excitement.power *= .8;

                    g.colorMode(g.HSB, 1);

                    // Background
                    for (var i = 0; i < 8; i++) {
                        var r = 70 * utilities.pnoise(i + t);
                        var theta = 4 * i + t + element.number;
                        element.idColor.fill(g, -.4 + .4 * Math.sin(i + element.number), -.7);
                        g.noStroke();
                        g.ellipse(r * Math.cos(theta) + g.width / 2, r * Math.sin(theta) + g.height / 2, 20, 20);

                    }

                    for (var i = 0; i < 5; i++) {
                        var r = 70 * utilities.pnoise(i + t + element.number);
                        var theta = i + (Math.sin(i) + 3) * t;
                        element.idColor.fill(g, .4 + .4 * Math.sin(i), 1);
                        g.noStroke();
                        var radius = 3 + Math.sin(i);
                        if (active)
                            radius *= 2;
                        g.ellipse(r * Math.cos(theta) + g.width / 2, r * Math.sin(theta) + g.height / 2, radius, radius);

                    }
                }
            };

            var canvas = document.getElementById(element.name + "_holder_canvas");

            // attaching the sketchProc function to the canvas
            var processingInstance = new Processing(canvas, initProcessing);
            div.append(element.symbol);

            // Activate this, deactivate all others
            div.click(function() {
                if (stellarGame.focused) {
                    widget.setActiveElement(element);
                    elementHolder.tool.activate();
                }

            });

            return elementHolder;
        }
    });

    return ElementsWidget;
});

