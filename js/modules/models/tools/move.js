/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "kcolor", "tool", "modules/models/elementSet", "particleTypes", "modules/models/ui/uiManager"], function(Vector, KColor, Tool, ElementSet, particleTypes, uiManager) {
    return (function() {
        var minDustMass = 10;
        //========================================================
        //========================================================
        //========================================================
        // MoveTool: A tool to move the camera
        var MOVE = 0;
        var COLLECT = 1;
        var HEAT = 2;

        MoveTool = Tool.extend({
            initializeTool : function() {
                this.elements = new ElementSet(this);

                this.mode = MOVE;
            },
            updateElements : function() {
                // Do something with the new element amounts
            },

            // Release any dust
            onUp : function(touch) {
                var tool = this;
                // Release all the elements as a dust cloud

                if (touch.overObjects.length > 0 && touch.overObjects[0].acceptsDust) {
                    // All objects that "acceptDust" must have a .feedDust() public function
                    touch.overObjects[0].feedDust(touch, tool);

                } else {
                    if (tool.elements.totalMass > minDustMass) {

                        // Transfer 100% of the elements to the new popup Inventory!
                        var playerInventory = uiManager.getPlayerInventory();

                        tool.elements.transferTo(playerInventory.contents["playerElements"].elementsHolder.elements, 1);
                        playerInventory.contents["playerElements"].elementsHolder.elements.updateAllElementsInDiv();

                    }
                }
            },

            // Choose mode
            onDown : function(touch) {

            },

            onDrag : function(touch) {
                var tool = this;
                this.moveWithOffset(touch);

                $.each(touch.overObjects, function(index, obj) {
                    
                   utilities.touchOutput("Siphon " + obj);
                    if (obj.siphonable)
                        tool.elements.siphon(obj.elements, 1);

                });

            },
            drawCursor : function(g, p, scale) {

                var t = stellarGame.time.universeTime;

                g.pushMatrix();
                g.translate(p.x, p.y);
                g.scale(scale);

                g.strokeWeight(2);
                g.stroke(1, 0, 1, .8);
                g.fill(1, 0, 1, .4);
                g.ellipse(0, 0, 10, 10);

                this.drawDirection(g, p);

                g.fill(1, 0, 1);
                g.text(this.elements.totalMass, 5, 15);

                if (this.mode === MOVE) {
                    // Removing touch pressed for now for UI interaction
                    //

                    this.elements.drawAsDustCloud(g, 20);

                    if (stellarGame.touch.pressed) {
                        // Draw a spiral
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
