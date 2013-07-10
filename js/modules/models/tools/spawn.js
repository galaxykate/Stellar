/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "kcolor", "tool", "particleTypes"], function(Vector, KColor, Tool, particleTypes) {
    return (function() {

        //========================================================
        //========================================================
        //========================================================
        // SpawnTool: A tool to spawn stuff while moving the camera
        var SpawnTool = Tool.extend({
            initializeTool : function() {
                this.distSinceLastPlacement = 0;
            },

            onDrag : function(touch) {
                this.moveWithOffset(touch);

                var objs = touch.overObjects;

                var d = stellarGame.touch.getOffsetToHistory(1).magnitude();
                this.distSinceLastPlacement += d;

                if (this.distSinceLastPlacement > 50 + Math.random() * 40) {

                    var p = new particleTypes.Star();
                    p.position.setTo(touch.toWorldPosition(touch.currentPosition));

                    var v = this.direction.clone();
                    v.constrainMagnitude(0, 10);
                    p.velocity.setToMultiple(v, .05);
                    stellarGame.universe.spawn(p);
                    this.distSinceLastPlacement = 0;
                }

                // Drag

            },

            onMove : function(touch) {
            },

            drawCursor : function(g, p) {
                g.stroke(1, 0, 1, .8);
                g.fill(1, 0, 1, .4);
                g.ellipse(p.x, p.y, 10, 10);

            }
        });

        return SpawnTool;
    })();

});
