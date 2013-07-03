/**
 * @author Kate Compton
 */

// Inventory class
// Contains tools, elements, etc

define(["modules/models/elementSet", "modules/models/kcolor", "noise"], function(ElementSet, KColor, Noise) {
    return (function() {
        var noise = new Noise();

        // Private functions

        var toolCount = 0;

        function Tool(name, id, onClick, onDrag) {
            this.id = id;
            this.idNumber = toolCount;
            this.name = name + "(" + this.idNumber + ")";
            this.onClick = onClick;
            this.onDrag = onDrag;

            toolCount++;
            this.idColor = new KColor((0.091 * this.idNumber + 0.19) % 1, 1, 1);

        };

        Tool.prototype.createPaletteButton = function(parent) {
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
                stellarGame.touch.activeTool = tool;
                // alert(tool);
            });

        };

        // Draw the cursor for this tool into graphics g, at point p
        Tool.prototype.drawCursor = function(g, p) {
            g.noFill();
            this.idColor.stroke(g, .3, 1);
            g.strokeWeight(4);
            g.ellipse(p.x, p.y, 20, 20);
            g.noStroke();

            var t = stellarGame.time.universeTime;
            for (var i = 0; i < 30; i++) {
                this.idColor.fill(g, .3 + .5 * Math.sin(i), 1);
                var r = 30 * (1 + noise.noise2D(t, i));
                var theta = i + (.3 * i + 1) * t;
                g.ellipse(p.x + r * Math.cos(theta), p.y + r * Math.sin(theta), 5, 5);
            }
        };

        Tool.prototype.toString = function() {
            return this.name;
        };

        // Tool event handlers
        Tool.prototype.touchDown = function() {
            console.log(this + " down!");
        };

        Tool.prototype.touchUp = function() {
            console.log(this + " up!");
            stellarGame.touch.activeTool = undefined;
        };

        //===========================================================
        //===========================================================

        // Make the Inventory class
        function Inventory() {
            this.elements = new ElementSet();
            this.tools = [];
            for (var i = 0; i < 10; i++) {
                this.tools.push(new Tool("TestTool" + i, "TestTool" + i));
            }
        };

        // Shared class attributes
        Inventory.prototype = {

            //===========================================================
            //===========================================================
            // View stuff

            createPaletteDiv : function(parent) {
                var palette = $('<div/>', {
                    html : "Palette<br>",
                    "class" : "palette",
                });
                parent.append(palette);

                // add all the tool buttons
                $.each(this.tools, function(index, tool) {
                    palette.append(tool.createPaletteButton(palette));

                });

            },

            //===========================================================
            //===========================================================

            toString : function() {
                return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
            },
        };

        return Inventory;
    })();

});
