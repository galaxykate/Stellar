/**
 * @author Kate Compton
 */

// Inventory class
// Contains tools, elements, etc

define(["modules/models/elementSet", "kcolor", "modules/models/vector", "particleTypes", "toolTypes"], function(ElementSet, KColor, Vector, particleTypes, toolTypes) {
    return (function() {
        var universe;
        //===========================================================
        //===========================================================

        // Make the Inventory class
        function Inventory() {
            var inventory = this;
            this.elements = new ElementSet(this);
            this.tools = [];

            // What should go in the inventory
            var moveTool = new toolTypes.Move(this, "Move", "move");
            this.defaultTool = moveTool;
            this.addTool(moveTool);

            // Define tools for each of the active elements
            $.each(ElementSet.activeElements, function(index, element) {
                var addElement = new toolTypes.Add(inventory, {
                    type : 'element',
                    element : element,
                    rate : 5,
                });
                inventory.addTool(addElement);
            });

            var spawnables = [{
                name : "Star",
                constructor : particleTypes.Star,
                spacing : 50
            }];

            $.each(spawnables, function(index, spawnable) {
                var spawnTool = new toolTypes.Spawn(inventory, "Spawn " + spawnable.name, "spawn" + "_" + spawnable.name);
                inventory.addTool(spawnTool);

            });

            this.defaultTool.activate();
        };

        // Shared class attributes
        Inventory.prototype = {

            updateElements : function() {
                // Do something with the new element amounts
            },

            // A method to add tools
            addTool : function(tool) {
                this.tools.push(tool);
            },

            setActiveTool : function(tool) {
                stellarGame.touch.activeTool = tool;
            },

            activateDefaultTool : function() {
                this.defaultTool.activate();
            },

            //===========================================================
            //===========================================================
            // View stuff

            createPaletteDiv : function(parent) {
                var palette = $('<div/>', {
                    html : "Palette<br>",
                    "class" : "palette ui_box",
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
