/**
 * @author Kate Compton
 */

var debug, debugTouch;

var screenResolution = {
    width : 1024,
    height : 768
}

define(["modules/views/universe_view"], function(universeView) {

    var createOutput = function(divName) {
        var div = $("#" + divName);
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
                outputLines = outputLines.concat(lines);
                div.append(lines);
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
    return {
        universeView : universeView
    }
});

