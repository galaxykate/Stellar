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
				
				for(var j = 0; j < Quests[i].conditions.length; j++){
					q.addCondition(Quests[i].conditions[j].desc);
				}
				questLibrary.push(q);
				questIDByName[q.name] = i;
			}
			
			startAllViableQuests();
			setVisibility();
        };
        
        function startAllViableQuests(){
        	for(var i = 0; i < questLibrary.length; i++){
        		if(questLibrary[i].level <= currentLevel && questLibrary[i].finished !== true){
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
        	if(questLibrary[questIDByName[questName]].finished === false){
        		questLibrary[questIDByName[questName]].satisfy(conditionID);
        		questLibrary[questIDByName[questName]].update(); // figures % completed
	        	questLibrary[questIDByName[questName]].updateHTMLText();
	        	if(questLibrary[questIDByName[questName]].finished === true && questLibrary[questIDByName[questName]].fanfair === false){
    				//uiManager.getQuestScreen().flash(); // replace flash with a new pop-up of awesome
    				uiManager.spawnQuestCompletionScreen(questLibrary[questIDByName[questName]]);
    				questLibrary[questIDByName[questName]].fanfair = true;
    			}
        	}
        };

        return {
            init : init,
            startAllViableQuests : startAllViableQuests,
            update : update,
            satisfy : satisfy,
        };

    })();

});
