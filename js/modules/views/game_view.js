/**
 * @author Kate Compton
 */

var debug, debugTouch, inspectionOutput;

var screenResolution = {
    width : 1024,
    height : 768
}

define(["modules/views/universe_view", "modules/views/elements_widget", "inheritance"], function(UniverseView, ElementsWidget, Inheritance) {

    var createOutput = function(divName) {
        var div = $("#" + divName);
     
        div.html("test");
        var outputLines = [];
        var output = {
            clear : function() {
                div = $("#" + divName);
                outputLines = [];
                this.updateOutput();
            },

            add : function(line) {
                outputLines.push(line);
                div.append(line + "<br>");
            },

            output : function(line) {
                outputLines.push(line);
                div.append(line + "<br>");
            },

            outputArray : function(lines) {
                var htmlLines = "";
                $.each(lines, function(index, line) {
                    htmlLines += line + "<br>";
                });
                div.append(htmlLines);
            },

            updateOutput : function() {
                var htmlLines = "";
                $.each(outputLines, function(index, line) {
                    htmlLines += line + "<br>";
                });
                div.html(htmlLines);
            }
        };
        return output;

    };
    debug = createOutput("debug_output_pane");
    debugTouch = createOutput("touch_output_pane");
    inspectionOutput = createOutput("inspection_output_pane");
 
    var GameView = Class.extend({
        init : function(universe) {
            var elementsWidget = new ElementsWidget($("#elements_pane"));

            elementsWidget.setActiveElement(undefined);

            this.universeView = new UniverseView(stellarGame.universe);
        }
    });

    return GameView;
});

