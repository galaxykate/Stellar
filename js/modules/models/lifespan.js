/**
 * @author April
 */

// Its the Universe!

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
            },
            
            // =============== custom functions to be set by the implementer ==============
            onStart : function(func){
            	this.onStartFunction = func;
            },
            
            onEnd : function(func){
            	this.onEndFunction = func;
            },
            
            onUpdate: function(func){
            	this.onUpdateFunction = func;
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
            	this.startTime = stellarGame.time.gameTime;
            	this.duration = 0;
            	this.propsedEndTime = this.startTime + this.lifespan;
            	
            	if(this.onStartFunction !== undefined){
            		this.onStartFunction();
            	} else {
            		console.log("notice (lifeSpan): custom onStartFunction not set");
            	}
            	
            	this.started = true;
            },
            
            update: function(){
            	// update will start an unstarted lifespan. MAY WANT TO MAKE AN OPTION!!!
            	if(this.started === false){
            		this.start();
            	}
            	
            	// Update only updates a non-finished lifespan
            	if(this.finished === false){
	            	// update time variables
	            	this.duration = stellarGame.time.gameTime - this.startTime;
	            	this.figuredPctCompleted = this.duration/this.proposedEndTime;
	            	
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
						end();
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


        });
        return Lifespan;
    })();

});
