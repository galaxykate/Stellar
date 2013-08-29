/**
 * @author April Grow
 */

// Its the Universe!

define(["modules/models/quests/quests", "modules/models/quests/quest", "modules/models/ui/uiManager"], function(Quests, Quest, uiManager) {

    return (function() {
    	var questLibrary = [];
    	var activeQuests = [];
    	var currentLevel = 0;
    	var questScreenDivID = "";

        function init() {
            console.log("INIT QUESTS");
            questScreenDivID = uiManager.getQuestScreen().parentDivID;
            //var div = $("#" + questScreenDivID);
	    	//div.html("Quest Log");
            //console.log("Quest div: " + questScreenDivID);
            
			for(var i = 0; i < Quests.length; i++){
				var q = new Quest(i, questScreenDivID);
				q.setQuestName(Quests[i].name);
				q.level = Quests[i].level;
				q.giverType = Quests[i].giver;
				
				for(var j = 0; j < Quests[i].conditions.length; j++){
					q.addCondition(Quests[i].conditions[j].func, Quests[i].conditions[j].desc);
				}
				questLibrary.push(q);
			}
			
			startAllViableQuests();
        };
        
        function startAllViableQuests(){
        	for(var i = 0; i < questLibrary.length; i++){
        		if(questLibrary[i].level <= currentLevel && questLibrary[i].finished !== true){
        			questLibrary[i].start();
        			questLibrary[i].createDiv();
        		}
        	}
        };
        
        function update(){
        	updateQuestUI();
        	for(var i = 0; i < questLibrary.length; i++){
        		questLibrary[i].update(); // started/finished is checked in the quest itself
        		if(questLibrary[i].started === true){
        			questLibrary[i].updateHTMLText();
        		}
        	}
        };
		/*
		function addQuestToActive(quest){
			activeQuests.push(quest.idNumber);
		}
		
		function removeQuestFromActive(quest){
			activeQuests.splice(activeQuests.indexOf(quest.idNumber), 1);
		}*/
		
		function updateQuestUI(){
			
		};
		
		function makeQuestDiv(quest){
			
		};

        return {
            init : init,
            startAllViableQuests : startAllViableQuests,
            update : update,
            updateQuestUI : updateQuestUI,
        };

    })();

});
