/**
 * @author Kate Compton
 */

// Create the way that the game will render on-screen

define(['modules/controllers/universe_controller'], function(universeController) {

    // Add developer options
    stellarGame.addOption("showText", false);
    stellarGame.addOption("showStarNames", true);
    stellarGame.addOption("simStarEvolution", false);
    stellarGame.addOption("drawQuadTree", false);
    stellarGame.addOption("outputStarDrawing", false);
    stellarGame.addOption("drawCameraQuad", false);
    stellarGame.addOption("drawCamera", false);
    stellarGame.addOption("drawActiveQuads", false);
    stellarGame.addOption("drawTouchMarker", false);
    stellarGame.addTuning("moveSpeed", .5, 0, 1);

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
        console.log(range);

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
    var inventoryPanel = createSlidePanel({
        id : "inventory_panel",
        direction : "left",
        rangeStart : 10,
        rangeEnd : 300,
        thickness : 150,

    });

    var toolsPane = $('<div/>', {
        id : "tools_pane",
        html : "Tools",
        "class" : "slideout_pane",
    });

    var elementsPane = $('<div/>', {
        id : "elements_pane",
        html : "Elements",
        "class" : "slideout_pane",
    });

    var backpackPane = $('<div/>', {
        id : "elements_pane",
        html : "Elements",
        "class" : "slideout_pane",
    });

    inventoryPanel.div.append(toolsPane);
    inventoryPanel.div.append(elementsPane);
    inventoryPanel.div.append(backpackPane);

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
        html : "Elements",
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

    $("#universe_canvas").keypress(function() {
        toggleDevPanels();
    });

    $.each(allPanels, function(index, panel) {
        setToActive(panel, true);
    });

    return {
        universeController : universeController,
    };

});
