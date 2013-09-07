/**
 * @author April Grow
 */

// Its the Universe!

define(['modules/views/game_view', "modules/models/ui/popup", "modules/models/ui/popupContents"], function(gameView, Popup, PopupContents) {

    return (function() {
    	var playerInventory;
    	var infoScreen;

        function init() {
            console.log("INIT UI");


            makeInventoryPopup();
            //makeMainMenu();
        };
        
        function makeInventoryPopup() {
        	playerInventory = new Popup("#universe");
        	
	        var universeHeight = screenResolution.height;
	        
	        playerInventory.addState("closed", 0, 0, 20, universeHeight, 0.1);
	        playerInventory.addState("open", 0, 0, 150, universeHeight, 1);
	        playerInventory.addTransition("open", "closed", "mouseleave", true);
	        playerInventory.addTransition("closed", "open", "mousedown", true);
	        playerInventory.setState("closed");
	        
	        var contents = new PopupContents();
	        contents.initAsElementHolder();
	        contents.updateElementsDrawAndUpdate();
	        //contents.addElementsToUniverse(); // Need to figure out some other way to update an element container
	        playerInventory.addContents("playerElements", contents);
	        
	    };
	    
	    function makeMainMenu() {
	    	infoScreen = new Popup("#universe");
	    	
	    	var universeWidth = screenResolution.width;
	    	var universeHeight =screenResolution.height;
	    	
	    	infoScreen.addState("closed", universeWidth-40, 0, 20, 20, 0.5);
	    	infoScreen.addState("open", 20, 20, universeWidth-50, universeHeight-50, 1);
	    	//infoScreen.addTransition("open", "closed", "click");
	    	infoScreen.addTransition("closed", "open", "click", false);
	    	infoScreen.setState("closed");
	    	infoScreen.addCloseDiv();
	    	
	    	var menu = new PopupContents();
	    	infoScreen.addContents("menu", menu);
	    	
	    	var stats = new PopupContents();
	    	stats.initStatisticsHTMLHolder();
	    	infoScreen.addContents("stats", stats);
	    };
	    
	    function generateUniverseStatistics(){
	    	
	    };
	    
	    function getPlayerInventory() {
	    	return playerInventory;
	    };
	    
	    function update() {
	    	// For element holder stuff :)
	    	playerInventory.update();
	    	//utilities.debugOutput("updating in uiManager");
	    }

        return {
            init : init,
            getPlayerInventory : getPlayerInventory,
            update: update
        };

    })();

});
