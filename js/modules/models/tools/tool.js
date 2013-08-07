/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "uparticle", "kcolor"], function(Vector, UParticle, KColor) {
    return (function() {

        var toolCount = 0;
        var Tool = Class.extend({

            // label is the human readable version
            // id is the no-spaces version
            init : function(inventory, label, id) {
                this.id = id;

                this.idNumber = toolCount;
                this.inventory = inventory;
                toolCount++;

                this.label = label;
                this.idColor = new KColor((0.091 * this.idNumber + 0.19) % 1, 1, 1);
                this.direction = new Vector(0, 0);
                this.initializeTool();
            },

            activate : function() {
                console.log("activate " + this);
                this.inventory.setActiveTool(this);
            },

            deactivate : function() {
                console.log("deactivate " + this);
                this.inventory.activateDefaultTool();

            },

            createPaletteButton : function(parent) {
                var tool = this;

                var paletteButton = $('<div/>', {
                    html : this.label,
                    id : this.id,
                    "class" : "palette_button"
                });
                var rgb = this.idColor.toRGB();
                var hex = this.idColor.toHex();

                paletteButton.css({
                    "color" : "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + " )",
                });

                parent.append(paletteButton);
                paletteButton = $("#palette_button");

                $("#" + this.id).on("click", function(e) {
                    tool.activate();
                });

            },

            //========================================================================
            //========================================================================
            //========================================================================
            // Drawing utilities

            drawDirection : function(g, p) {
                g.stroke(1, 0, 1, .8);

                if (this.direction) {
                    p.drawArrow(g, this.direction, 4);
                }
            },

            drawHistoryTrail : function(g) {
                var length = stellarGame.touch.history.length;
                var history = stellarGame.touch.history;
                var historyIndex = stellarGame.touch.historyIndex;
                g.fill(1);
                var t = stellarGame.time.universeTime;

                for (var i = 0; i < 0; i++) {

                    var p2 = stellarGame.touch.getHistory(i);
                    var r = (20 * (length - i) / length + 2) * (1 + .2 * Math.sin(-12 * t + .2 * i));
                    g.fill((1 + (i * .049 + .2 - 3 * t) % 1) % 1, 1, 1);
                    g.ellipse(p2.x, p2.y, r, r);
                }
            },

            // Draw the cursor for this tool into graphics g, at point p
            drawCursor : function(g, p, scale) {
                var noise = utilities.noiseInstance;
                g.noFill();
                this.idColor.stroke(g, .3, 1);
                g.strokeWeight(4);
                g.ellipse(p.x, p.y, 10, 10);
                g.noStroke();

                g.fill(1);
                g.text(this.label, p.x, p.y - 10);

                var t = stellarGame.time.universeTime;
                for (var i = 0; i < 30; i++) {
                    this.idColor.fill(g, .3 + .5 * Math.sin(i), 1);
                    var r = 10 * (1 + noise.noise2D(t, i));
                    var theta = i + (.3 * i + 1) * t;
                    g.ellipse(p.x + r * Math.cos(theta), p.y + r * Math.sin(theta), 2, 2);
                }

            },
            toString : function() {
                return this.label;
            },

            //==========================================================
            //==========================================================
            // Standard movement

            moveWithOffset : function(touch) {

                this.direction.mult(0);

                var d = touch.planeOffset.magnitude();
                //this.direction.mult(-.4);

                if (d === 0 || d === NaN) {
                    console.log("DIRECTION MAGNITUDE ERROR: " + d);
                    d = .00001;
                }
                //  this.direction.addMultiple(touch.planeOffset, Math.pow(d, .5) / d);

                // Add some movement based on the edge that we're pointing at
         
                var edgeStrength = touch.screenPct.magnitude();
                var moveStrength = 300*Math.pow(edgeStrength, 1.5);
                this.direction.addMultiple(touch.planeCenterOffset, -moveStrength / touch.planeCenterOffset.magnitude());
                   utilities.touchOutput(touch.screenPct);
               utilities.touchOutput(edgeStrength);
                utilities.touchOutput(this.direction.toString(2));

                stellarGame.universe.addScrollingMovement(this.direction);

            },

            //==========================================================
            //==========================================================
            // Tool event handlers
            initializeTool : function() {

            },

            touchMove : function(touch) {
                this.distanceSinceLastSpawn += touch.planeOffset.magnitude();
                if (this.onMove)
                    this.onMove(touch);
            },
            touchDrag : function(touch) {

                this.distanceSinceLastSpawn += touch.planeOffset.magnitude();
                if (this.onDrag)
                    this.onDrag(touch);

            },
            touchDown : function(touch) {
                console.log(this + " down!");
                this.distanceSinceLastSpawn = 0;
                if (this.onDown)
                    this.onDown(touch);
            },
            touchUp : function(touch) {
                console.log(this + " up!");
                if (this.onUp)
                    this.onUp(touch);

                this.deactivate();
            },
        });

        return Tool;
    })();

});
