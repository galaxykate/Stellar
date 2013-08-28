/**
 * @author April
 */

define(["inheritance", "modules/models/quests/condition"], function(Inheritance, Condition) {
    return (function() {

        // Private functions
        var idCount = 0;

        var Quest = Class.extend({
        	
            init : function() {
                this.idNumber = idCount;
                idCount++;
                
                this.started = false;
                this.finished = false;
                this.satisfiedCount = 0;
                this.figuredPctCompleted = 0;
                this.conditions = [];
            },
            
			addCondition : function (func, desc){
				this.conditions.push(new Condition(func, desc));
			},
			
            onEnd : function(func){
            	this.onEndFunction = func;
            },
            
            setQuestName : function(qname){
            	this.name = qname;
            },
            
            
            // =============== action items ==============
            start : function(){
            	this.startTime = stellarGame.time.universeTime;

            	if(this.conditions.length === 0){
            		utilities.debugOutput("ERROR (Quest): No condition, not starting");
            	} else {
            		this.started = true;
            	}
            	
            	//console.log("lifespan " + this.idNumber + " started!: " + this.startTime + ", " + this.progress + ", " + this.proposedEndTime);
            },
            
            update: function(){
            	// update will start an unstarted lifespan. MAY WANT TO MAKE AN OPTION!!!
            	if(this.started === false){
            		this.start();
            	} else {
            	
	            	this.satisfiedCount = 0;
	            	// Update only updates a non-finished lifespan
	            	if(this.finished === false){
		            	for(var i = 0; i < this.conditions.length; i++){
		            		if(this.conditions[i].truthCheck) this.satisfiedCount++;
		            	}
		            	this.figuredPctCompleted = this.satisfiedCount/this.conditions.length;
		            	if(this.figuredPctCompleted === 1){
		            		this.end();
		            	}
	            	}
            	}
            },
            
            end : function(){
            	this.finished = true;
            	
            	if(this.onEndFunction !== undefined){
            		this.onEndFunction();
            	} else {
            		//console.log("notice (lifeSpan): custom onEndFunction not set");
            	}
            	
            },
            
            restart : function() {
            	this.started = false;
                this.finished = false;
            }
        });
        return Quest;
    })();

});
