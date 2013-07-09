/**
 * @author Kate Compton
 */

// poluting the namespace, fix at some point
var particleTypeNames = ["star", "dust", "trailhead"];
var particleTypePath = "modules/models/particles/";
var particleFiles = particleTypeNames.map(function(name, index) {
    return particleTypePath + name;
});

var particleKeyNames = particleTypeNames.map(function(name, index) {
    return name.charAt(0).toUpperCase() + name.slice(1);
});

particleFiles.push("uparticle");
particleKeyNames.push("UParticle");

console.log(particleFiles);
console.log(particleKeyNames);
define(particleFiles, function() {
    var typeConstructors = arguments;
    return (function() {
        var particleTypes = {};

        // Go through the arguments
        var length = typeConstructors.length;
        for (var i = 0; i < length; i++) {
            var name = particleKeyNames[i];
            console.log(name);
            particleTypes[name] = typeConstructors[i];
        }

        console.log(particleTypes);
        return particleTypes;
    })();

});
