/**
 * @author Kate Compton
 */

// Inventory class
// Contains tools, elements, etc

define(["modules/models/elementSet", "modules/models/kcolor", "modules/models/vector", "particleTypes"], function(ElementSet, KColor, Vector, ParticleTypes) {
    return (function() {
        var universe;

        // Private functions

        var toolCount = 0;

        // A tool to move the camera
        var moveTool = new Tool("Move", "move", {
            init : function() {
            },

            onDrag : function(touch) {
                this.moveWithOffset(touch);

                $.each(touch.overObjects, function(index, obj) {
                    obj.remove();
                });

            },

            drawCursor : function(g, p) {
                g.stroke(1, 0, 1, .8);
                g.fill(1, 0, 1, .4);
                g.ellipse(p.x, p.y, 10, 10);
                if (stellarGame.touch.pressed) {
                    if (this.direction) {
                        p.drawArrow(g, this.direction, 2);

                    }
                }
                g.fill(.5, .4, 1);
                g.text(this.distSinceLastPlacement, p.x, p.y - 30);

                var length = stellarGame.touch.history.length;
                var history = stellarGame.touch.history;
                var historyIndex = stellarGame.touch.historyIndex;
                g.fill(1);
                g.text(historyIndex, p.x, p.y - 18);
                var t = stellarGame.time.universeTime;

                for (var i = 0; i < 0; i++) {

                    var p2 = stellarGame.touch.getHistory(i);
                    var r = (20 * (length - i) / length + 2) * (1 + .2 * Math.sin(-12 * t + .2 * i));
                    g.fill((1 + (i * .049 + .2 - 3 * t) % 1) % 1, 1, 1);
                    g.ellipse(p2.x, p2.y, r, r);
                }
            }
        });

        var spawnTool = new Tool("Spawn", "spawn", {
            init : function() {
                this.distSinceLastPlacement = 0;
            },

            onDrag : function(touch) {
                this.moveWithOffset(touch);

                var objs = touch.overObjects;

                var d = stellarGame.touch.getOffsetToHistory(1).magnitude();
                this.distSinceLastPlacement += d;

                if (this.distSinceLastPlacement > 50 + Math.random() * 40) {

                    var p = new UParticle();
                    if (Math.random() > .8)
                        p = new Star.Star();
                    p.position.setTo(touch.toWorldPosition(touch.currentPosition));
                    p.velocity.setToMultiple(this.direction, .5);
                    universe.spawn(p);
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

        function Tool(name, id, handlers) {
            this.id = id;
            this.idNumber = toolCount;
            this.name = name + "(" + this.idNumber + ")";
            toolCount++;
            this.idColor = new KColor((0.091 * this.idNumber + 0.19) % 1, 1, 1);
            var tool = this;
            this.direction = new Vector(0, 0);

            if (handlers) {
                $.each(handlers, function(name, handler) {
                    tool[name] = handler;
                });
            }
            if (this.init)
                this.init();
        };

        Tool.prototype.activate = function() {
            console.log("activate " + this.name);
            stellarGame.touch.activeTool = this;
        };

        Tool.prototype.deactivate = function() {
            console.log("deactivate " + this.name);
            stellarGame.touch.activeTool = moveTool;
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
                tool.activate();
            });

        };

        // Draw the cursor for this tool into graphics g, at point p
        Tool.prototype.drawCursor = function(g, p) {
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
        };

        Tool.prototype.toString = function() {
            return this.name;
        };

        // Tool event handlers
        Tool.prototype.moveWithOffset = function(touch) {
            this.direction.setTo(stellarGame.touch.getOffsetToHistory(5));
            this.direction.mult(-.4);
            var d = stellarGame.touch.currentPosition.magnitude();
            this.direction.addMultiple(stellarGame.touch.currentPosition, .0002 * d);

            universe.addScrollingMovement(this.direction);
        }

        Tool.prototype.touchMove = function(touch) {
            this.distanceSinceLastSpawn += touch.lastOffset.magnitude();
            if (this.onMove)
                this.onMove(touch);
        };

        Tool.prototype.touchDrag = function(touch) {

            this.distanceSinceLastSpawn += touch.lastOffset.magnitude();
            if (this.onDrag)
                this.onDrag(touch);

        };
        Tool.prototype.touchDown = function(touch) {
            console.log(this + " down!");
            this.distanceSinceLastSpawn = 0;
        };

        Tool.prototype.touchUp = function(touch) {
            console.log(this + " up!");

            this.deactivate();
        };

        //===========================================================
        //===========================================================

        // Make the Inventory class
        function Inventory(_universe) {
            universe = _universe;
            this.elements = new ElementSet();
            this.tools = [];
            for (var i = 0; i < 5; i++) {
                this.addTool(new Tool("TestTool" + i, "testtool" + i));
            }

            this.addTool(moveTool);
            this.addTool(spawnTool);
            moveTool.activate();
        };

        // Shared class attributes
        Inventory.prototype = {
            // A way to construct tools
            Tool : Tool,

            // A method to add tools
            addTool : function(tool) {
                this.tools.push(tool);
            },

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
