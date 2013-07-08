/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "kcolor", "tool"], function(Vector, KColor, Tool) {
    return (function() {

        //========================================================
        //========================================================
        //========================================================
        // MoveTool: A tool to move the camera
        var MOVE = 0;
        var COLLECT = 1;
        var HEAT = 2;

        MoveTool = Tool.extend({
            initializeTool : function() {
                this.contents = 0;
                this.mode = MOVE;
            },

            // Release any dust
            onUp : function(touch) {

            },

            // Choose mode
            onDown : function(touch) {

            },
            onDrag : function(touch) {
                this.moveWithOffset(touch);

                $.each(touch.overObjects, function(index, obj) {
                    obj.remove();
                });

            },
            drawCursor : function(g, p) {
                var t = stellarGame.time.universeTime;

                g.strokeWeight(2);
                g.stroke(1, 0, 1, .8);
                g.fill(1, 0, 1, .4);
                g.ellipse(p.x, p.y, 10, 10);

                g.pushMatrix();
                   this.drawDirection(g, p);
                     
                g.translate(p.x, p.y);
                if (this.mode === MOVE) {
                    if (stellarGame.touch.pressed) {

                        g.stroke(1, 0, 1, .8);

                        var streaks = 30;
                        for (var i = 0; i < streaks; i++) {
                            var theta = i * Math.PI * 2 / streaks + .2 * Math.sin(i + t);

                            var rPct = ((i * 1.413124 - 1 * 3 * t) % 1 + 1) % 1;

                            rPct = Math.pow(rPct, .8);
                            g.strokeWeight(4 * (1 - rPct));
                            g.stroke(1, 0, 1, 1 - rPct);
                            rPct = rPct * 1.6 - .4;
                            var r = 30 + 10 * Math.sin(i + 4 * t);
                            var rInner = r * utilities.constrain(rPct - .1, 0, 1) + 10;
                            var rOuter = r * utilities.constrain(rPct + .1, 0, 1) + 10;
                            var spiral = -.06;
                            var cInnerTheta = Math.cos(theta + spiral * rInner);
                            var sInnerTheta = Math.sin(theta + spiral * rInner);
                            var cOuterTheta = Math.cos(theta + spiral * rOuter);
                            var sOuterTheta = Math.sin(theta + spiral * rOuter);
                            g.line(rInner * cInnerTheta, rInner * sInnerTheta, rOuter * cOuterTheta, rOuter * sOuterTheta);

                        }
                    }
                }

                if (this.mode === COLLECT) {
                    if (stellarGame.touch.pressed) {
                        this.drawDirection(g, p);
                    }
                }
                g.popMatrix();
            }
        });

        return MoveTool;
    })();

});
