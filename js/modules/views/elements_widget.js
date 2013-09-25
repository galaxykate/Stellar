/**
 * @author Kate Compton
 */

define(["modules/models/elementSet", "inheritance", "modules/models/vector", "modules/models/tools/feed", "raphael"], function(ElementSet, inheritance, Vector, FeedTool, RAPHAEL) {
    // Displays how much of the player's belt contains
    var ElementHolder = Class.extend({
        init : function(widget, element) {
            console.log("Create holder for " + element);
            // Create the div
            var elementHolder = this;
            this.widget = widget;
            this.element = element;

            this.holder = $('<div/>', {

                "class" : "element_widget_element"
            });

            this.holder.appendTo(widget.ringHolder);

            this.bar = $('<div/>', {
                "class" : "element_widget_bar"
            });

            this.barFill = $('<div/>', {
                html : element.name,
                "class" : "element_widget_bar_fill"
            });

            this.endBall = $('<div/>', {

                "class" : "element_widget_ball"
            });

            this.bar.appendTo(this.holder);
            this.barFill.appendTo(this.bar);
            //  this.endBall.appendTo(this.bar);

            this.bgColor = element.idColor.cloneShade(-.7, 1);
            this.highlightColor = element.idColor.cloneShade(.5, 1);
            this.baseColor = element.idColor.cloneShade(.1, 1);

            // Set the color
            this.endBall.css({
                "background-color" : this.baseColor.toCSS()
            });

            this.bar.css({
                "background-color" : this.bgColor.toCSS(),
                "box-shadow" : "inset 0 0 10px " + this.baseColor.toCSS(),
            });

            this.barFill.css({
                "background-color" : this.baseColor.toCSS()
            });

            this.excitement = {
                power : 0,
            };

            this.tool = new FeedTool(stellarGame.player.elementBelt, element, 1, function() {
                elementHolder.onFeed();
            });

            // Activate this, deactivate all others
            this.holder.click(function() {
                if (stellarGame.focused) {
                    widget.setActiveElement(elementHolder.element);
                    elementHolder.tool.activate();
                }

            });

            this.setPositions();

        },

        disable : function() {
            this.holder.hide();
            this.disabled = true;
        },

        enable : function() {
            this.holder.show();
            this.disabled = false;
        },

        setPositions : function() {
            var pct = this.widget.belt.getCapacityPct(this.element.index);
            var ballR = 12;
            var barLength = 160;
            var barHeight = 20;
            if (this.selected) {
                barLength *= 1.2;
                barHeight *= 1.4;
            }
            var spacing = 2;

            var x = pct * barLength;
            this.endBall.css({
                left : Math.round(-ballR + x) + "px"
            });

            this.bar.css({
                width : barLength + "px",
                height : barHeight + "px",
                left : "0px",
            });
            this.barFill.css({
                width : Math.round(x) + "px",
                height : (barHeight - spacing * 2) + "px",
                left : "0px",
            });
        },
        createProcessingBall : function() {

        },
        onFeed : function() {
            console.log("FEEED " + this.element);
            this.excitement.power = 1;
            this.widget.resetPositions([this.element.index]);
            // update the amount in the bar
        },
        draw : function() {
            var pct = widget.belt.getCapacityPct(this.element.index);

            // Draw this as a tube?
            var h = 20;
            var w = 100;

            this.bgColor.fill(g);
            g.rect(0, 0, w, h);

            this.bgColor.fill(g);
            g.rect(0, 0, w, h);

        },
    });

    // Create a widget to control the elements in your inventory
    var ElementsWidget = Class.extend({
        init : function(div) {
            var widget = this;
            this.belt = stellarGame.player.elementBelt;
            stellarGame.player.elementBelt.changedValue = function() {
                widget.resetPositions();
            };

            stellarGame.player.setWidget(this);

            this.activeElement = undefined;

            // Create a round thing?
            this.ringCenter = new Vector(0, 0);
            this.ringRadius = 120;
            this.ringHolder = $("#element_widget_ring");

            // create all the element holders
            widget.elementHolders = [];
            this.activeElements = ElementSet.activeElements;

            $.each(ElementSet.activeElements, function(index, element) {
                var holder = new ElementHolder(widget, element);
                widget.elementHolders.push(holder);
            });

        },

        disable : function(element) {
            this.elementHolders[element.index].disable();
            this.resetPositions();
        },

        enable : function(element) {
            this.elementHolders[element.index].enable();

            this.resetPositions();
        },

        // Set things based on what element is currently active
        resetPositions : function(changedIndices) {
            $.each(this.elementHolders, function(index, holder) {
                holder.setPositions();
            });
        },

        deactivate : function(element) {
            if (this.activeElement === element) {
                this.elementHolders[this.activeElement.index].selected = false;
                this.resetPositions();
            }
        },

        setActiveElement : function(element) {
            if (element.name === "Hydrogen") {
                stellarGame.qManager.satisfy("Feed a Star " + element.name, 0);
            }

            console.log("SET ACTIVE ELEMENT " + element);

            if (this.activeElement && this.activeElement !== element)
                this.elementHolders[this.activeElement.index].selected = false;

            this.activeElement = element;
            this.elementHolders[element.index].selected = true;
            this.resetPositions();
        },
        //====================================================================
        //====================================================================
        //====================================================================
        //====================================================================

    });

    return ElementsWidget;
});

