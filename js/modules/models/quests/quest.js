/**
 * @author April
 */

define(["inheritance", "modules/models/quests/condition"], function(Inheritance, Condition) {
    return (function() {

        // Private functions
        var Quest = Class.extend({
        	
            init : function(id, questScreenDivID) {
                this.idNumber = id;
                
                this.started = false;
                this.finished = false;
                this.satisfiedCount = 0;
                this.figuredPctCompleted = 0;
                this.conditions = [];
                
                this.parentDivID = questScreenDivID;
                this.divID = questScreenDivID + "_quest" + this.idNumber;
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
            		//QuestManager.addQuestToActive(this);
            		console.log("Quest started: " + this.name);
            	}
            	
            	//console.log("lifespan " + this.idNumber + " started!: " + this.startTime + ", " + this.progress + ", " + this.proposedEndTime);
            },
            
            update: function(){
            	// Quests must be started before they will be updated
            	if(this.started === true && this.finished === false){
            	
	            	this.satisfiedCount = 0;
	            	for(var i = 0; i < this.conditions.length; i++){
	            		//console.log(this.conditions[i].truthCheck);
	            		if(this.conditions[i].truthCheck() === true){
	            			this.conditions[i].satisfied = true;
	            			//console.log("satisfied: " + this.conditions[i].satisfied);
	            			console.log("satisfied conditon: " + this.conditions[i].description);
	            			this.satisfiedCount++;
	            		}
	            	}
	            	this.figuredPctCompleted = this.satisfiedCount/this.conditions.length;
	            	if(this.figuredPctCompleted === 1){
	            		console.log("QUEST COMPLETED: " + this.name);
	            		this.end();
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
            	//QuestManager.removeQuestFromActive(this);
            	
            },
            
            restart : function() {
            	this.started = false;
                this.finished = false;
            },
            
            /**** VIEW STUFF ****/
            createDiv : function() {
            	var options = {
	                html : this.toString(true),
	                "class" : "quest",
	                "id" : this.divID
	            };
	            
				var div = $('<div/>', options);
				var parent = $("#" + this.parentDivID);
				parent.append(div); 
            },
           
            updateHTMLText : function(){
            	var div = $("#" + this.divID);
	    		div.html(this.toString(true));
            },
            /********************/
            
            toString : function(html) {
            	
            	var newline;
            	var str = "";
            	
            	if(html !== undefined && html === true) {
            		newline = "<br>";
            		str += "<b>" + this.name + "</b>";
            	} else { 
            		newline = "/n";
            		str += this.name;
            	}
            	
            	if(this.finished) str += ": COMPLETED!";
            	else str += "  (" + this.figuredPctCompleted*100 + "%)";
            	
            	for(var i = 0; i < this.conditions.length; i++){
            		str += newline;
            		str += " - " + this.conditions[i].description + ": ";
            		//utilities.debugOutput("Satisfied?: " + this.conditions[i].satisfied);
            		if(this.conditions[i].satisfied === true) str += "Satisfied";
            		else str += "Not Satisfied";
            	}
            	
            	return str;
            	
            }
        });
        return Quest;
    })();

});
