/**
 * @author April Grow
 */

// Its the Universe!

define(['modules/views/game_view', "modules/models/ui/popup", "modules/models/ui/popupContents"], function(gameView, Popup, PopupContents) {

    return (function() {
    	var playerInventory;
    	var questScreen;
    	var spawnedQuestCompletionScreens = [];
    	var notifications;

        function init() {
            console.log("INIT UI");

            //makeInventoryPopup();
            makeQuestWindow();
            makeNotificationPanel();
        };
        
        function makeInventoryPopup() {
        	playerInventory = new Popup("#universe", "Inventory");
        	
	        var universeHeight = screenResolution.height;
	        
	        playerInventory.addState("closed", 0, 0, 20, universeHeight, 0.3);
	        playerInventory.addState("open", 0, 0, 150, universeHeight, 1);
	        playerInventory.addTransition("open", "closed", "mouseleave", true);
	        playerInventory.addTransition("closed", "open", "mousedown", true);
	        playerInventory.setState("closed");
	        //playerInventory.setState("open");
	        playerInventory.addNullSelectionTool();
	        playerInventory.setNullDivID();
	        
	        var contents = new PopupContents();
	        contents.initAsElementHolder();
	        contents.updateElementsDrawAndUpdate();
	        //contents.addElementsToUniverse(); // Need to figure out some other way to update an element container
	        playerInventory.addContents("playerElements", contents);
	        var critters = new PopupContents();
	        playerInventory.addContents("playerCritters", critters);
	        
	        critters.initAsCritterHolder();
	        
	    };
	    
	    function makeQuestWindow() {

	    	questScreen = new Popup("#overlay_panels", "Quest Log");
	    	questScreen.view.setZIndex(100);
	    	
	    	var universeWidth = screenResolution.width;
	    	var universeHeight =screenResolution.height;
	    	
	    	questScreen.addState("closed", 0, 360, 140, 30, 0.6);
	    	questScreen.addState("open", 20, 20, universeWidth-50, universeHeight-50, 1);
	    	questScreen.addTransition("open", "closed", "click");
	    	questScreen.addTransition("closed", "open", "click", false);
	    	questScreen.setState("closed");
	    	questScreen.addCloseDiv();
	    	
	    	var menu = new PopupContents();
	    	questScreen.addContents("menu", menu);
	    	
	    	var quests = new PopupContents();
	    	quests.initStatisticsHTMLHolder();
	    	questScreen.addContents("quests", quests)
	    };
	    
	    function makeNotificationPanel(){
	    	// Notifications starts at the bottom of the screen and grows upwards
	    	notifications = new Popup("#overlay_panels", "", true);
	    	notifications.view.removeClass("popup");
	    	notifications.view.addClass("notificationPanel");
	    	notifications.view.setRegularHTML("");
	    	
	    	var universeHeight =screenResolution.height;
	    	var universeWidth = screenResolution.width;
	    	
	    	notifications.addState("always", universeWidth-300, 0, 250, undefined, 1, true);
	    	notifications.setState("always");
	    	notifications.view.setBGColor(1, 1, 1, 0);
	    };
	    
	    function generateUniverseStatistics(){
	    	
	    };
	    
	    function getPlayerInventory() {
	    	return playerInventory;
	    };
	    
	    function getQuestScreen(){
	    	return questScreen;
	    };
	    
	    function update() {
	    	// For element holder stuff :)
	    	//playerInventory.update();
	    	//utilities.debugOutput("updating in uiManager");
	    	//QuestManager.updateQuestUI(questScreen.contents["quests"]);
	    };
	   
	    
	    function getInventoryElementAmt(name) {
	    	return getPlayerInventory().contents["playerElements"].elementsHolder.getAmtByName(name);
	    };
	    
	    function getInventoryElementPct(name){
	    	return getPlayerInventory().contents["playerElements"].elementsHolder.getPctByName(name);
	    };
	    
	    function spawnQuestCompletionScreen(quest){
	    	var completeText = "Quest Completed: " + quest.name;
	    	var qScreen = new Popup("#" + notifications.view.divID, "");
	    	qScreen.view.setRegularHTML(completeText);
	    	
	    	qScreen.addState("closed", -1, -1, 0, 0, 0);
	    	qScreen.addState("open", undefined, undefined, 240, undefined);
	    	qScreen.addCloseDiv();
	    	qScreen.addOnCloseFunc(qScreen.view.hide);
	    	
	    	qScreen.setState("open");
	    	qScreen.view.removeClass("popup");
	    	qScreen.view.removeClass("popup_open");
	    	qScreen.view.addClass("notice");
	    	
	    	for(var i = 0; i < quest.unlockDescs.length; i++){
	    		var unlockText = quest.unlockDescs[i];
	    		var conditionScreen = new Popup("#" + notifications.view.divID, "");
	    		conditionScreen.view.setRegularHTML(unlockText);
	    		conditionScreen.addState("closed", -1, -1, 0, 0, 0);
		    	conditionScreen.addState("open", undefined, undefined, 240, undefined);
		    	conditionScreen.addCloseDiv();
		    	conditionScreen.addOnCloseFunc(qScreen.view.hide);
		    	
		    	conditionScreen.setState("open");
		    	conditionScreen.view.removeClass("popup");
		    	conditionScreen.view.removeClass("popup_open");
		    	conditionScreen.view.addClass("notice");
	    	}
	    };

        return {
            init : init,
            getPlayerInventory : getPlayerInventory,
            getQuestScreen : getQuestScreen,
            update: update,
            getInventoryElementAmt: getInventoryElementAmt,
            getInventoryElementPct: getInventoryElementPct,
            spawnQuestCompletionScreen: spawnQuestCompletionScreen,
        };

    })();

});
