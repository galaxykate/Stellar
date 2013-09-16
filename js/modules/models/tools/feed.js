/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "kcolor", "tool", "modules/models/elementSet", "particleTypes", "modules/models/ui/uiManager"], function(Vector, KColor, Tool, ElementSet, particleTypes, uiManager) {
    return (function() {

        //========================================================
        //========================================================
        //========================================================
        // Feed tool, feed a stream of elements into something

        FeedTool = Tool.extend({
            init : function(source, element, rate, onFeed) {
                this._super(undefined, element.name, element.name);
                this.source = source;
                this.element = element;
                this.rate = rate;
                this.maxTargets = 1;
                this.onFeed = onFeed;

            },

            onUp : function(touch) {

            },

            // Feed
            addTo : function(obj) {
                var tool = this;

                if (obj.feed !== undefined) {
                    // if (obj.siphonable)
                    var amt = tool.rate;
                    console.log("feed " + amt + " " + tool.element.name + " to " + obj.name);

                    // Remove it from the source
                    var actualAmt = this.source.remove(tool.element, amt);
                    console.log("   amt: " + actualAmt);
                    obj.feed(tool.element, actualAmt);

                    obj.excite(1);

                    this.onFeed(amt);
                    return true;
                }
            },

            // Add to a list of objects
            addToObjects : function(objects) {
                var tool = this;
                var count = 0;
                $.each(objects, function(index, obj) {
                    console.log(index + ": Add " + tool.element.name + " to " + obj);
                    if (count < tool.maxTargets) {
                        var successful = tool.addTo(obj);
                        if (successful)
                            count++;
                    }
                });
            },

            // Choose mode
            onDown : function(touch) {

                // Add the element to whatevers underneath
                this.addToObjects(touch.overObjects);
            },

            // Dragging, and holding
            onDrag : function(touch) {
                this.addToObjects(touch.overObjects);
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

        return FeedTool;
    })();

});
