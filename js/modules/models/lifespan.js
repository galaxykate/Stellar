/**
 * @author April
 */

// NOTE: Runs on universeTime

define(["inheritance"], function(Inheritance) {
    return (function() {

        // Private functions
        var idCount = 0;

        var Lifespan = Class.extend({
        	
            init : function(lifeDuration) {
                this.idNumber = idCount;
                idCount++;
                
                this.started = false;
                this.finished = false;
                this.onUpdatePcts = [];
                this.lifespan = lifeDuration; // In game time
                //console.log("lifespan initiated: " + this.idNumber + " with duration " + this.lifespan);
            },
            
            // =============== custom functions to be set by the implementer ==============
            onStart : function(func){
            	this.onStartFunction = func;
            	//console.log("lifespan " + this.idNumber + " onStart!");
            	//console.log(func);
            },
            
            onEnd : function(func){
            	this.onEndFunction = func;
            	//console.log("lifespan " + this.idNumber + " onEnd!");
            	//console.log(func);
            },
            
            onUpdate: function(func){
            	this.onUpdateFunction = func;
            	//console.log("lifespan " + this.idNumber + " onUpdate!");
            	//console.log(func);
            },
            
            // pct is on a 0-1 scale
            onUpdatePct: function(func, pct){
            	var updatePct = {
            		onUpdate: func,
            		percent: pct,
            		triggered: false
            	};
            	this.onUpdatePcts.push(updatePct);
            },
            
            // =============== action items ==============
            start : function(){
            	this.startTime = stellarGame.time.universeTime;
            	this.duration = 0;
            	console.log("... " + this.startTime + ", " + this.lifespan);
            	this.proposedEndTime = this.startTime + this.lifespan;
            	
            	if(this.onStartFunction !== undefined){
            		this.onStartFunction();
            	} else {
            		console.log("notice (lifeSpan): custom onStartFunction not set");
            	}
            	
            	this.started = true;
            	//console.log("lifespan " + this.idNumber + " started!: " + this.startTime + ", " + this.duration + ", " + this.proposedEndTime);
            },
            
            update: function(){
            	// update will start an unstarted lifespan. MAY WANT TO MAKE AN OPTION!!!
            	if(this.started === false){
            		this.start();
            	}
            	
            	// Update only updates a non-finished lifespan
            	if(this.finished === false){
	            	// update time variables
	            	this.duration = stellarGame.time.universeTime - this.startTime;
	            	this.figuredPctCompleted = this.duration/this.lifespan;
	            	
	            	//utilities.debugOutput("lifespan " + this.idNumber + " updating...! " + utilities.roundNumber(this.duration) + ", " + utilities.roundNumber(this.figuredPctCompleted*100, 0) + "%");
	            	// If we have passed any thresholds for specific pct progress and not yet triggered it, TRIGGER IT!
	            	for(var i = 0; i < this.onUpdatePcts.length; i++){
	            		if(this.onUpdatePcts[i].percent <= this.figuredPctCompleted && this.onUpdatePcts[i].triggered === false){
	            			this.onUpdatePcts[i].onUpdate();
	            		}
	            	}
	            	
	            	// update in general
	            	if(this.onUpdateFunction !== undefined){
	            		this.onUpdateFunction();
	            	} else {
	            		console.log("notice (lifeSpan): custom onUpdateFunction not set");
	            	}
	            	
					if(this.figuredPctCompleted >= 1){
						// If we have run the course of our duration, FINISH IT!
						console.log("notice (lifeSpan): finishing lifespan");
						console.log(this);
						this.end();
					}
            	}
            },
            
            end : function(){
            	this.finished = true;
            	
            	if(this.onEndFunction !== undefined){
            		this.onEndFunction();
            	} else {
            		console.log("notice (lifeSpan): custom onEndFunction not set");
            	}
            	
            	// If we have passed any thresholds for specific pct progress and not yet triggered it, ERROR!
            	for(var i = 0; i < this.onUpdatePcts.length; i++){
            		if(this.onUpdatePcts[i].percent <= this.figuredPctCompleted && this.onUpdatePcts[i].triggered === false){
            			console.log("ERROR (lifeSpan): We did not trigger an event!!! Did no updates happen?!");
            			console.log(this.onUpdatePcts[i]);
            		}
            	}
            },
            
            restart : function() {
            	this.started = false;
                this.finished = false;
                
                for(var i = 0; i < this.onUpdatePcts.length; i++){
                	this.onUpdatePcts[i].triggered = false;
            	}
                
                console.log("~~~ lifespan " + this.idNumber + " restarted ~~~");
            }


        });
        return Lifespan;
    })();

});
