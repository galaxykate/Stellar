/**
 * @author April Grow
 * 
 * A collection of functions that create lifespans through the stages of star supernova
 * 1. Star fuses most of its lowest element
 * 2. Star collapses and gains temp until it can fuse its next lowest element
 * 3. Repeat stages 1 and 2 until hitting iron
 * 4. Star fully collapses without any other fusion stages
 * 5. Once dense enough, star bursts forth in full supernova
 * 
 * SNS stands for SuperNovaStage
 */


define(["inheritance", "modules/models/vector",'lifespan', particleTypePath + "dust", "modules/models/ui/glow"], function(Inheritance, Vector, Lifespan, Dust, Glow) {

	// Step 1
    var fusionOfElement = function(star) {
    	
    };
	
	// Step 2
    var collapse = function(star) {
    	star.state = star.states[3];
    	
    	var lifespan = new Lifespan(3);
        var startStarRadius = star.radius;
        var sizeToRemove = star.radius * 0.2;
        var triggeredFadeOut = false;

        var lifespanUpdate = function() {
            star.radius = startStarRadius - (lifespan.figuredPctCompleted * sizeToRemove);
            //utilities.debugOutput("star radius: " + star.radius);
			if(triggeredFadeOut === false && lifespan.lifespan - lifespan.progress <= 1){
				spiralOpacitySpan(star, false);
				triggeredFadeOut = true;
			}
        };

        var lifespanOnEnd = function() {
			star.state = star.states[2];
        };

        var lifespanOnStart = function() {
			spiralOpacitySpan(star, true);
        };

        lifespan.onUpdate(lifespanUpdate);
        lifespan.onEnd(lifespanOnEnd);
        lifespan.onStart(lifespanOnStart);

        star.lifespans.push(lifespan);
    };
    
    var spiralOpacitySpan = function(star, fadeIn) {
    	var lifespan = new Lifespan(1);

        var lifespanUpdate = function() {
        	if(fadeIn){
            	star.spiralOpacity = lifespan.figuredPctCompleted;
            } else {
            	star.spiralOpacity = 1 - lifespan.figuredPctCompleted;
            } 

        };

        lifespan.onUpdate(lifespanUpdate);

        star.lifespans.push(lifespan);
    };
    
    // Step 4
    var fullCollapse = function(star) {
    	
    };
    
    // Step 5
    var explode = function(star) {
		var dustExplosionVelocity = Math.random() * 300 + 600;
        var elemsToShed = star.elements.calcShedElements(1, .5, .5);
        var numDustToSpawn = Math.ceil(Math.random() * 5) + 2;
        for (var j = 0; j < elemsToShed.length; j++) {
            elemsToShed[j] = elemsToShed[j] / numDustToSpawn;
        }

        for (var i = 0; i < numDustToSpawn; i++) {
            // spawn a new dust
            var newDustObj = new Dust();
            // give it elemsToShed/numDustToSpawn of each element
            newDustObj.elements.clearAllElements();
            star.elements.transferAmountsTo(newDustObj.elements, elemsToShed);
            // place it at the center of the star
            newDustObj.position = star.position.clone();
            // give it a velocity directly away from the star
            newDustObj.velocity.setTo(Math.random() * dustExplosionVelocity - (dustExplosionVelocity / 2), Math.random() * dustExplosionVelocity - (dustExplosionVelocity / 2));
            stellarGame.universe.spawn(newDustObj);
        }

        //star.burningFuel = false;
       
    };

    return {
        fusionOfElement:fusionOfElement,
        collapse:collapse,
        fullCollapse:fullCollapse, 
        explode:explode
    };

});
