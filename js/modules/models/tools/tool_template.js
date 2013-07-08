/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "uparticle"], function(Vector, UParticle) {
    return (function() {

        var toolCount = 0;
        var Tool = Class.extend({

            // label is the human readable version
            // id is the no-spaces version
            init : function(label, id) {
                this.id = id;
                this.idNumber = toolCount;
                toolCount++;

                this.label = label;
                this.idColor = new KColor((0.091 * this.idNumber + 0.19) % 1, 1, 1);
                this.direction = new Vector(0, 0);

            },

            activate : function() {
                console.log("activate " + this.name);
                stellarGame.touch.activeTool = this;
            },

            deactivate : function() {
                console.log("deactivate " + this.name);
                stellarGame.touch.activeTool = moveTool;
            },

            createPaletteButton : function(parent) {
                var tool = this;

                var paletteButton = $('<div/>', {
                    html : this.name,
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

            // Draw the cursor for this tool into graphics g, at point p
            drawCursor : function(g, p) {
                var noise = utilities.noiseInstance;
                g.noFill();
                this.idColor.stroke(g, .3, 1);
                g.strokeWeight(4);
                g.ellipse(p.x, p.y, 10, 10);
                g.noStroke();

                g.fill(1);
                g.text(this.name, p.x, p.y - 10);

                var t = stellarGame.time.universeTime;
                for (var i = 0; i < 30; i++) {
                    this.idColor.fill(g, .3 + .5 * Math.sin(i), 1);
                    var r = 10 * (1 + noise.noise2D(t, i));
                    var theta = i + (.3 * i + 1) * t;
                    g.ellipse(p.x + r * Math.cos(theta), p.y + r * Math.sin(theta), 2, 2);
                }

                utilities.debugArrayOutput(stellarGame.touch.overObjects);
            },
            toString : function() {
                return this.name;
            },

            //==========================================================
            //==========================================================
            // Tool event handlers

            moveWithOffset : function(touch) {
                this.direction.setTo(stellarGame.touch.getOffsetToHistory(5));
                this.direction.mult(-.4);
                var d = stellarGame.touch.currentPosition.magnitude();
                this.direction.addMultiple(stellarGame.touch.currentPosition, .0002 * d);

                universe.addScrollingMovement(this.direction);
            },
            //==========================================================
            //==========================================================
            // Tool event handlers

            touchMove : function(touch) {
                this.distanceSinceLastSpawn += touch.lastOffset.magnitude();
                if (this.onMove)
                    this.onMove(touch);
            },
            touchDrag : function(touch) {

                this.distanceSinceLastSpawn += touch.lastOffset.magnitude();
                if (this.onDrag)
                    this.onDrag(touch);

            },
            touchDown : function(touch) {
                console.log(this + " down!");
                this.distanceSinceLastSpawn = 0;
            },
            touchUp : function(touch) {
                console.log(this + " up!");

                this.deactivate();
            },
        });

        return MyParticle;
    })();

});
