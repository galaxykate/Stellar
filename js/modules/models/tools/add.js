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
                this._super(inventory, item.label, item.id);
                this.item = item;
                this.rate = item.rate;
            },

            // Release any dust
            onUp : function(touch) {

            },

            addTo : function(obj) {
                var item = this.item;
                // console.log("Add " + this.label + " to " + obj.name);

                switch(item.type) {

                    // Add an element
                    case 'element' :
                        var element = this.item.element;
                        if (obj.elements !== undefined) {
                            // if (obj.siphonable)
                            obj.elements.addElement(element.name, 100);
                        }

                        break;

                    // Add or remove temperature
                    case 'temperature':
                        if (obj.addTemperature)
                            obj.addTemperature(item.rate);
                        break;

                    case 'pressure':
                        if (obj.addPressure)
                            obj.addPressure(item.rate);
                        break;

                    default:
                        break;
                }

            },

            // Choose mode
            onDown : function(touch) {
                var tool = this;
                // Add the element to whatevers underneath
                $.each(touch.overObjects, function(index, obj) {

                    tool.addTo(obj);
                });
            },

            // Dragging, and holding
            onDrag : function(touch) {
                var tool = this;
                $.each(touch.overObjects, function(index, obj) {
                    tool.addTo(obj);
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
