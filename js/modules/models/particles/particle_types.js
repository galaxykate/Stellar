/**
 * @author Kate Compton
 */

// poluting the namespace, fix at some point

var particleTypeNames = ["star", "star2", "dust", "trailhead", "critter", "sparkle", "spring", "region", "camera"];

var particleTypePath = "modules/models/particles/";
var particleFiles = particleTypeNames.map(function(name, index) {
    return particleTypePath + name;
});

var particleKeyNames = particleTypeNames.map(function(name, index) {
    return name.charAt(0).toUpperCase() + name.slice(1);
});

particleFiles.push("uparticle");
particleKeyNames.push("UParticle");

define(particleFiles, function() {
    var typeConstructors = arguments;
    return (function() {
        var particleTypes = {};

        // Go through the arguments
        var length = typeConstructors.length;
        for (var i = 0; i < length; i++) {
            var name = particleKeyNames[i];

            particleTypes[name] = typeConstructors[i];
        }

        return particleTypes;
    })();

});
