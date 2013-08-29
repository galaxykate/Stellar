/**
 * @author April Grow
 */

// Its the Universe!

define(["modules/models/quests/quests", "modules/models/quests/quest", 'modules/views/game_view', "modules/models/ui/popup", "modules/models/ui/popupContents"], function(Quests, Quest, gameView, Popup, PopupContents) {

    return (function() {
    	var questLibrary = [];
    	var activeQuests = [];
    	var currentLevel = 0;

        function init() {
            console.log("INIT QUESTS");
            
			for(var i = 0; i < Quests.length; i++){
				var q = new Quest(i);
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
        		}
        	}
        };
        
        function update(){
        	for(var i = 0; i < questLibrary.length; i++){
        		questLibrary[i].update(); // started/finished is checked in the quest itself
        	}
        };
		/*
		function addQuestToActive(quest){
			activeQuests.push(quest.idNumber);
		}
		
		function removeQuestFromActive(quest){
			activeQuests.splice(activeQuests.indexOf(quest.idNumber), 1);
		}*/

        return {
            init : init,
            startAllViableQuests : startAllViableQuests,
            update : update,
        };

    })();

});
