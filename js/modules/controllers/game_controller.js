/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(['modules/controllers/universe_controller', 'modules/models/tools/move'], function(universeController, MoveTool) {

    var addOption = function(key, defaultValue) {

        stellarGame.options[key] = defaultValue;

        // add a div for the checkbox
        var div = $('<div/>', {
            id : key + '_checkbox',
            "class" : "option_checkbox_holder",
            text : key
        });

        var checkbox = $('<input/>', {
            type : "checkbox",
            name : key,
        });
        checkbox.appendTo(div);
        checkbox.prop('checked', defaultValue);

        checkbox.change(function() {
            stellarGame.options[key] = this.checked;
        });

        div.appendTo("#options_panel");

    };

    var createSlider = function(parent, name, label, settings, onChange) {
        var holder = $("<div/>", {
            id : name + "_slider",
            "class" : "tuning_slider_holder"
        });
        parent.append(holder);

        holder.html("");

        var bar = $("<div/>", {
            id : name + "_bar",
            "class" : "slider_bar"
        });

        var valueOutput = $("<div/>", {
            id : name + "_label",
            "class" : "slider_label"
        });

        holder.append(bar);
        holder.append(valueOutput);
        var changeValue = function(value) {
            valueOutput.html(label + ": " + value);
            stellarGame.tunings[name] = Math.pow(value, 2);
        };

        settings.slide = function(event, ui) {
            changeValue(ui.value);

        };
        bar.slider(settings);

        bar.setValue = function(value) {

            bar.slider('value', value);
            changeValue(value);
        };

        bar.setValue(settings.value);

        bar.setMax = function(max) {
            bar.slider('option', {
                min : 0,
                max : max
            });

        };

        return bar;
    };

    var tuningHolder = $("#tuning_panel");
    var addTuning = function(key, defaultValue, min, max) {

        stellarGame.tunings[key] = defaultValue;

        var slider = createSlider(tuningHolder, key, key, {
            min : min,
            max : max,
            step : .03,
            value : defaultValue,
        });

    };

    var GameController = Class.extend({
        init : function() {

            // Add developer options
            addOption("showText", false);
            addOption("showStarNames", true);
            addOption("simStarEvolution", false);
            addOption("drawQuadTree", false);
            addOption("outputStarDrawing", false);
            addOption("drawCameraQuad", false);
            addOption("drawCamera", false);
            addOption("drawActiveQuads", false);
            addOption("drawTouchMarker", false);
            addOption("outputActiveObjects", false);
            addOption("outputActiveQuads", false);
            addOption("hideDevPanels", true);
            addOption("showBubbleForces", false);

            addOption("showUpdateQuests", true);

            addTuning("moveSpeed", .3, .1, 5);
            addTuning("gravity", 1, .1, 5);
            addTuning("thermalPressure", 1, .1, 5);
            addTuning("gasPressureConstant", 40, 10, 500);

            addTuning("juiceRefill", .1, .1, 5);
            addTuning("bubbleForce", .4, 0, 5);
            addTuning("containerForce", .3, .01, 5);

            //================================================================
            //================================================================
            //================================================================
            // Tool management
            stellarGame.activeTool = undefined;

            // Hide the nav bar
            $("#nav_controls").hide();

            var moveTool = new MoveTool(this, "Move", "move");
            stellarGame.setActiveTool = function(tool) {
                if (stellarGame.touch.activeTool)
                    stellarGame.touch.activeTool.deactivate();
                stellarGame.touch.activeTool = tool;
            };

            stellarGame.activateMove = function() {
                if (stellarGame.touch.activeTool)
                    stellarGame.touch.activeTool.deactivate();

                moveTool.activate();

            };

            stellarGame.activateMove();

            //================================================================
            //================================================================
            //================================================================

            var slidePanels = [];

            var panelHolder = $("#overlay_panels");

            var devPanels = [];
            var allPanels = [];

            var setToDevPanel = function(panel) {
                panel.div.addClass("dev_panel");
                devPanels.push(panel);
            };

            var setToActive = function(panel, isActive) {
                if (isActive)
                    panel.div.css(panel.extended);
                else
                    panel.div.css(panel.retracted);
            };

            var createSlidePanel = function(options) {

                var panelDiv = $("#" + options.id);
                if (panelDiv.size() === 0) {

                    panelDiv = $('<div/>', {
                        id : options.id,
                        html : options.id,
                        class : "slideout_panel",

                    });
                } else {
                    panelDiv.addClass("slideout_panel");
                }

                panelHolder.append(panelDiv);
                var panel = {
                    div : panelDiv,
                    direction : options.direction,
                };

                var range = options.rangeEnd - options.rangeStart;

                var extendedPos = -10;
                var retractedPos = -options.thickness - 30;
                var startPos = options.rangeStart;
                panel.extended = {};
                panel.retracted = {};
                panel.extended[panel.direction] = extendedPos + "px";
                panel.retracted[panel.direction] = retractedPos + "px";

                // vertical
                if (panel.direction === 'left' || panel.direction === 'right') {
                    panelDiv.css({
                        width : options.thickness,
                        height : range,
                    });

                    panel.extended.top = startPos + "px";
                    panel.retracted.top = startPos + "px";
                }
                // horizontal
                else {
                    panelDiv.css({
                        width : range,
                        height : options.thickness,
                    });
                    panel.extended.left = startPos + "px";
                    panel.retracted.left = startPos + "px";

                }

                allPanels.push(panel);

                return panel;

            };

            var makeTestPanels = function(direction, count, start) {
                // Make some test panels

                var width = 140;
                var spacing = 6;
                for (var i = 0; i < count; i++) {

                    var end = Math.round(Math.random() * 150) + start;
                    var panel = createSlidePanel({
                        id : "test" + i,
                        direction : direction,
                        rangeStart : start,
                        rangeEnd : end,
                        thickness : width,
                    });

                    if (Math.random() > .2) {
                        setToDevPanel(panel);
                    }

                    setToActive(panel, false);

                    start = end + spacing;
                }
            };
            var devPanelsActive = false;

            //======================================================
            //======================================================
            //======================================================
            // Inventory

            var toolsPane = $('#tools_pane');
            var elementsPane = $('#elements_pane');
            var backpackPane = $('#backpack_pane');
            var inventoryPanes = [toolsPane, elementsPane, backpackPane];

            $.each(inventoryPanes, function(index, pane) {
                pane.addClass("slideout_pane");
            });

            //======================================================
            //======================================================
            //======================================================
            // Debug

            var optionsPanel = createSlidePanel({
                id : "options_panel",
                direction : "top",
                rangeStart : 460,
                rangeEnd : 590,
                thickness : 190,

            });

            var tuningPanel = createSlidePanel({
                id : "tuning_panel",
                direction : "top",
                rangeStart : 620,
                rangeEnd : 730,
                thickness : 150,

            });

            var debugOutputPanel = createSlidePanel({
                id : "output_panel",
                direction : "right",
                rangeStart : 10,
                rangeEnd : 600,
                thickness : 250,

            });

            var debugOutput = $('<div/>', {
                id : "debug_output_pane",
                html : "debug output",
                "class" : "slideout_pane output_pane",
            });

            var touchOutput = $('<div/>', {
                id : "touch_output_pane",
                html : "touch output",
                "class" : "slideout_pane output_pane",
            });

            setToDevPanel(debugOutputPanel);
            setToDevPanel(tuningPanel);
            setToDevPanel(optionsPanel);

            debugOutputPanel.div.append(debugOutput);
            debugOutputPanel.div.append(touchOutput);

            //======================================================
            //======================================================
            //======================================================
            //

            var toggleDevPanels = function() {
                devPanelsActive = !devPanelsActive;

                $.each(devPanels, function(index, panel) {
                    setToActive(panel, devPanelsActive);
                });
            };

            $("#app").keypress(function(event) {
                var key = event.which;
                var c = String.fromCharCode(key);
                if (c === 'd')
                    toggleDevPanels();

                if (key >= 48 && key <= 57) {
                    var index = key - 48;
                    stellarGame.player.elementBelt.setQuantityToPctCapacity(index, 1);
                }

            });

            $.each(allPanels, function(index, panel) {
                setToActive(panel, true);
            });
            toggleDevPanels();
            if (stellarGame.options.hideDevPanels)
                toggleDevPanels();

            universeController.init();

        }
    });

    return GameController;
});
