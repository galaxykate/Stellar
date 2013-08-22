/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "kcolor", "tool", "modules/models/elementSet", "particleTypes", "modules/models/ui/uiManager"], function(Vector, KColor, Tool, ElementSet, particleTypes, uiManager) {
    return (function() {

        //========================================================
        //========================================================
        //========================================================
        // MoveTool: A tool to move the camera

        AddTool = Tool.extend({
            init : function(inventory, item) {
                this._super(inventory, 'add_' + item.element.name, item.element.name);

                console.log("Create add tool for ");
                console.log(item.element);
                this.item = item;
                this.rate = item.rate;
            },

            // Release any dust
            onUp : function(touch) {

            },

            addElement : function(obj) {
                if (this.item.element) {

                    var element = this.item.element;
                    if (obj.elements !== undefined) {
                        console.log("Add element " + element);
                        utilities.touchOutput("add " + element.name + " to " + obj);
                        // if (obj.siphonable)
                        obj.elements.addElement(element.name, 100);
                    }

                }
            },

            // Choose mode
            onDown : function(touch) {
                var tool = this;
                // Add the element to whatevers underneath
                $.each(touch.overObjects, function(index, obj) {
                    tool.addElement(obj, tool.item.element);
                });
            },

            // Dragging, and holding
            onDrag : function(touch) {
                var tool = this;
                $.each(touch.overObjects, function(index, obj) {
                    tool.addElement(obj, tool.item.element);
                });

            },
            drawCursor : function(g, p, scale) {

                var t = stellarGame.time.universeTime;

                g.pushMatrix();
                g.translate(p.x, p.y);
                g.scale(scale);

                g.strokeWeight(2);
                g.stroke(1, 1, 1, .8);
                g.fill(1, 1, 1, .4);
                g.ellipse(0, 0, 10, 10);

                g.popMatrix();
            }
        });

        return AddTool;
    })();

});
