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


define(["inheritance", "modules/models/vector",'lifespan', particleTypePath + "dust", "modules/models/ui/glow", particleTypePath + 'sparkle'], function(Inheritance, Vector, Lifespan, Dust, Glow, Sparkle) {

	// Step 1 -- handled in star with help from elementSet
	
	// Step 2
    var collapse = function(star, collapseScale, duration) {
    	star.state = star.states[3];
    	if(duration === undefined) duration = 3;
    	
    	var lifespan = new Lifespan(duration);
        var startStarRadius = star.radius;
        var sizeToRemove = star.radius * collapseScale;
        if(startStarRadius - sizeToRemove <= 5) sizeToRemove = startStarRadius -5;
        if(sizeToRemove <= 0) sizeToRemove = 0;
        var triggeredFadeOut = false;

        var lifespanUpdate = function() {
            star.radius = startStarRadius - (lifespan.figuredPctCompleted * sizeToRemove);
            //utilities.debugOutput("star radius: " + star.radius);
            
			if(triggeredFadeOut === false && lifespan.lifespan - lifespan.progress <= 2.5){
				spiralOpacitySpan(star, false, Math.random() + 1.5);
				triggeredFadeOut = true;
			}
			
			if(star.state !== star.states[3]) lifespan.abort();
        };

        var lifespanOnEnd = function() {
			star.state = star.states[2];
			star.density += .5;
        };

        var lifespanOnStart = function() {
			spiralOpacitySpan(star, true, Math.random() + 1);
			shake(star, duration, Math.ceil(Math.random()*4 + 3)*2);
        };

        lifespan.onUpdate(lifespanUpdate);
        lifespan.onEnd(lifespanOnEnd);
        lifespan.onStart(lifespanOnStart);
        lifespan.addTag("starStageDependent");

        star.lifespans.push(lifespan);
    };
    
    var spiralOpacitySpan = function(star, fadeIn, duration) {
    	if(duration === undefined) duration = 1;
    	
    	var lifespan = new Lifespan(duration);

        var lifespanUpdate = function() {
        	if(fadeIn){
            	star.spiralOpacity = lifespan.figuredPctCompleted;
            } else {
            	star.spiralOpacity = 1 - lifespan.figuredPctCompleted;
            } 

        };
        var lifespanOnStart = function() {

        };

        lifespan.onUpdate(lifespanUpdate);
		lifespan.onStart(lifespanOnStart);
		
        star.lifespans.push(lifespan);

    };
    
    // Shakes from -swing/2 to swing/2 on the y axis
    // (which, on starting rotation, is side-to-side)
    var shake = function(star, duration, swing) {
    	if(duration === undefined) duration = 1;
    	if(swing === undefined) swing = 8;
    	
    	var lifespan = new Lifespan(duration);
    	//var startPosition = star.position.clone();
    	var updateCount = swing/4; // start at the center of the wiggle
		//console.log(star.idNumber + " swing:" + swing);
        var lifespanUpdate = function() {
			
        	if(updateCount%swing < swing/2) star.position.y++;
        	else star.position.y--;
        	
        	updateCount++;
        	
        	if(star.state !== star.states[3]) lifespan.abort();
        };
        
        var lifespanOnEnd = function() {
			//star.position.x = startPosition.x;
        };

        lifespan.onUpdate(lifespanUpdate);
		lifespan.onEnd(lifespanOnEnd);
		lifespan.addTag("starStageDependent");
		
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
    
    
    var generateSomeSparkles = function(star, num){
    	
		var numOfSparkles = Math.random() * 10 + 10;
		if(num !== undefined) numOfSparkles = num;
		
		star.mySparkleCount = Math.floor(numOfSparkles);
		
		for(var i = 0; i < numOfSparkles; i++){
			var newSparkle = new Sparkle(stellarGame.universe, undefined, star.idColor.clone());
			var SPARKLEEXPLOSIONVELOCITY = Math.random() * 1200 + 300;
			newSparkle.drag = .9999;
			newSparkle.position = star.position.clone();
    		
    		// give it a velocity directly away from the explosion
    		newSparkle.velocity.setTo(Math.random() * SPARKLEEXPLOSIONVELOCITY - (SPARKLEEXPLOSIONVELOCITY/2), Math.random()*SPARKLEEXPLOSIONVELOCITY - (SPARKLEEXPLOSIONVELOCITY/2));

    		stellarGame.universe.spawn(newSparkle);
		}
	};

    return {
        collapse:collapse,
        fullCollapse:fullCollapse, 
        explode:explode,
        generateSomeSparkles:generateSomeSparkles
    };

});
