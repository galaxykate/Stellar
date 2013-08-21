/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(['modules/controllers/universe_controller', 'jQueryUI'], function(universeController, $) {
    // Return the singleton here:
    return (function() {

        console.log("Init singleton game controller");
        var privateVar = '';
        stellarGame.addOption("showText", true);
        stellarGame.addOption("showStarNames", false);
        stellarGame.addOption("simStarEvolution", true);

        function initializeDevUI() {

            // Find the controls window
            var controls = $("#controls");

            // Turn all the settings into buttons at the top
            // Add new toggles here
            var settings = [{
                id : "drawFaces",
                displayName : "Draw Faces"
            }, {
                id : "drawElements",
                displayName : "Draw Elements"
            }, {
                id : "drawStars",
                displayName : "Draw Stars"
            }, {
                id : "drawDust",
                displayName : "Draw Dust"
            }, {
                id : "drawCritters",
                displayName : "Draw Critters"
            }, ];

            // Go through and add each as a labelled checkbox, then turn those into a JQUERYUI toggle
            $.each(settings, function(index, setting) {

                var label = $('<label/>', {
                    "for" : setting.id,
                    html : setting.displayName,

                });

                var input = $('<input/>', {
                    id : setting.id,
                    type : "checkbox",

                });

                controls.append(label);
                controls.append(input);

                var toggleButton = $("#" + setting.id);
                toggleButton.button();
                
                if(stellarGame[setting.id]) {
                	console.log("Detected " + setting.id + " as true");
                	toggleButton[0].checked = true;
                	toggleButton.button("refresh");
                }

                // Add the event listener to set the settings when the box is checked/unchecked
                toggleButton.click(function() {
                    console.log("Toggle " + setting.id);
                    if ($(this).is(':checked')) {
                        stellarGame[setting.id] = true;
                    } else {
                        stellarGame[setting.id] = false;
                    }
               
                });

            });
            
            
            // Fill up the palette with things to spawn
            var spawnables = ["Star"];
            
        };

        initializeDevUI();

        return {

            // public interface
            publicMethod1 : function() {
                // all private members are accesible here
            },
            publicMethod2 : function() {
            },
            universeController : universeController,

        };
    })();

});
