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
                var addElementTool = new toolTypes.Add(inventory, {
                    type : 'element',
                    label : element.symbol,
                    id : "add_" + element.symbol,
                    element : element,
                    rate : 5,
                });
                inventory.addTool(addElementTool);
            });

            var reactions = [{
                input : {
                    "hydrogen" : 2,
                    "helium" : 1,
                    "minTemp" : 1000,
                },
                output : {
                    "gold" : 1,
                    "adamantium" : 20,
                    "heat" : 100,
                }
            }, {
                input : {
                    "carbon" : 2,
                    "oxygen" : 1,
                    "minTemp" : 5000,
                },
                output : {
                    "iron" : 1,
                    "heat" : -10000,
                }
            }];

            // Add heat and cold tools
            var heatTool = new toolTypes.Add(inventory, {
                type : 'temperature',
                label : "Heat",
                id : "add_heat",
                rate : 50,
            });

            var coldTool = new toolTypes.Add(inventory, {
                type : 'temperature',
                label : "Cold",
                id : "add_cold",
                rate : -50,
            });

            inventory.addTool(heatTool);
            inventory.addTool(coldTool);

            // Add inflate and squeeze tools
            var squeezeTool = new toolTypes.Add(inventory, {
                type : 'pressure',
                label : "Squeeze",
                id : "add_pressure",
                rate : 50,
            });

            var inflateTool = new toolTypes.Add(inventory, {
                type : 'pressure',
                label : "Inflate",
                id : "sub_pressure",
                rate : -50,
            });

            inventory.addTool(squeezeTool);
            inventory.addTool(inflateTool);

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

            toString : function() {
                return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
            },
        };

        return Inventory;
    })();

});
