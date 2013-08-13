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
            initializeTool : function() {

            },

            // Release any dust
            onUp : function(touch) {

            },

            addElement : function(obj) {
                if (obj.elements !== undefined) {
                    utilities.touchOutput("add Hydrogen to " + obj);
                    // if (obj.siphonable)
                    obj.elements.addElement("Hydrogen", 100);
                }
            },

            // Choose mode
            onDown : function(touch) {
                var tool = this;
                // Add the element to whatevers underneath

                $.each(touch.overObjects, function(index, obj) {
                    tool.addElement(obj);

                });

            },

            onDrag : function(touch) {
                var tool = this;
                $.each(touch.overObjects, function(index, obj) {
                    tool.addElement(obj);

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
