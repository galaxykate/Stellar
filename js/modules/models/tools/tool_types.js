/**
 * @author Kate Compton
 */

// poluting the namespace, fix at some point
var toolTypeNames = ["move", "spawn"];
var toolTypePath = "modules/models/tools/";
var toolFiles = toolTypeNames.map(function(name, index) {
    return toolTypePath + name;
});

// Make the list of filenames into good constructor names (eg "star" => "Star")
var toolKeyNames = toolTypeNames.map(function(name, index) {
    return name.charAt(0).toUpperCase() + name.slice(1);
});

define(toolFiles, function() {
    var typeConstructors = arguments;
    return (function() {
        var toolTypes = {};

        // Go through the arguments
        var length = typeConstructors.length;
        for (var i = 0; i < length; i++) {
            var name = toolKeyNames[i];
            console.log(name);
            toolTypes[name] = typeConstructors[i];
        }
        console.log(toolTypes);
        return toolTypes;
    })();

});
