/**
 * @author April Grow
 */

// Its the Universe!

define(["modules/models/quests/quests", "modules/models/quests/quest", "modules/models/ui/uiManager"], function(Quests, Quest, uiManager) {

    return (function() {
    	var questLibrary = [];
    	var questIDByName = [];
    	var currentLevel = 0;
    	var questScreenDivID = "";

        function init() {
            console.log("INIT QUESTS");
            questScreenDivID = uiManager.getQuestScreen().contents["quests"].parentDivID;
            //var div = $("#" + questScreenDivID);
	    	//div.html("Quest Log");
            //console.log("Quest div: " + questScreenDivID);
            console.log(Quests);
            
			for(var i = 0; i < Quests.length; i++){
				var q = new Quest(i, questScreenDivID);
				q.setQuestName(Quests[i].name);
				q.level = Quests[i].level;
				q.giverType = Quests[i].giver;
				q.onComplete = Quests[i].onComplete;
				
				for(var j = 0; j < Quests[i].conditions.length; j++){
					q.addCondition(Quests[i].conditions[j].desc);
				}
				questLibrary.push(q);
				questIDByName[q.name] = i;
			}
			
			startAllViableQuests();
			setVisibility();
			
			stellarGame.qManager = this;
			
			// CURRENTLY DOES NOT WORK!!! My need to call after widget is initialized
			//lockAllElementsExceptHydrogen()
			
			// DEBUG
			//unlockAllQuests();
        };
        
        // CURRENTLY DOES NOT WORK!!! My need to call after widget is initialized
        function lockAllElementsExceptHydrogen(){
        	$.each(stellarGame.activeElements, function(index, element) {
                if(index > 0){
                	console.log("qManager disabiling " + index + ", " + element.name);
                	stellarGame.elementWidget.disable(element)
                }
            });
        	
        };
        
        function unlockAllQuests(){
        	currentLevel = 999;
        	startAllViableQuests();
        };
        
        function startAllViableQuests(){
        	for(var i = 0; i < questLibrary.length; i++){
        		if(questLibrary[i].level <= currentLevel && questLibrary[i].finished !== true && questLibrary[i].started !== true){
        			questLibrary[i].start();
        			questLibrary[i].createDiv();
        		}
        	}
        };
        
        function setVisibility() {
        	var div = $("#" + questScreenDivID);
        	if(stellarGame.options.showUpdateQuests){
        		if(div.is(":visible") === false) div.show();
        	} else {
        		//hide it?
        		if(div.is(":visible")) div.hide();
        	}
        }
        
        function update(){
        	// Update logic happens on satisfy: when a quest condition is updated
        };
        
        function satisfy(questName, conditionID){
        	var quest = questLibrary[questIDByName[questName]];
        	if(quest !== undefined){
        	if(quest.finished === false){
        		quest.satisfy(conditionID);
        		quest.update(); // figures % completed
	        	quest.updateHTMLText();
	        	if(quest.finished === true && quest.fanfair === false){
    				//uiManager.getQuestScreen().flash(); // replace flash with a new pop-up of awesome
    				uiManager.spawnQuestCompletionScreen(quest);
    				quest.fanfair = true;
    				//if(quest.onComplete !== undefined) quest.onComplete(); // handled when quest screen is closed
    				if(currentLevel < quest.level+1){ 
    					currentLevel = quest.level+1;
    					startAllViableQuests()
    				}
    			}
        	}
        	} else {
        		console.log("ERROR: Quest by the name '" + questName + "' not defined!!!!");
        	}
        };

        return {
            init : init,
            startAllViableQuests : startAllViableQuests,
            lockAllElementsExceptHydrogen: lockAllElementsExceptHydrogen,
            update : update,
            satisfy : satisfy,
        };

    })();

});
