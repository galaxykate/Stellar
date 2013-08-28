/**
 * @author April Grow
 */

// Its the Universe!

define(['modules/views/game_view', "modules/models/ui/popup", "modules/models/ui/popupContents"], function(gameView, Popup, PopupContents) {

    return (function() {
    	var playerInventory;
    	var questScreen;

        function init() {
            console.log("INIT UI");


            makeInventoryPopup();
            makeMainMenu();
        };
        
        function makeInventoryPopup() {
        	playerInventory = new Popup("#universe");
        	
	        var universeHeight = gameView.universeView.dimensions.height;
	        
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
	    	questScreen = new Popup("#universe");
	    	
	    	var universeWidth = gameView.universeView.dimensions.width;
	    	var universeHeight = gameView.universeView.dimensions.height;
	    	
	    	questScreen.addState("closed", universeWidth-40, 140, 20, 20, 0.5);
	    	questScreen.addState("open", 20, 20, universeWidth-50, universeHeight-50, 1);
	    	questScreen.addTransition("open", "closed", "click");
	    	questScreen.addTransition("closed", "open", "click", false);
	    	questScreen.setState("closed");
	    	questScreen.addCloseDiv();
	    	
	    	var menu = new PopupContents();
	    	questScreen.addContents("menu", menu);
	    	
	    	//var stats = new PopupContents();
	    	//stats.initStatisticsHTMLHolder();
	    	//questScreen.addContents("stats", stats);
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
	    };
	    
	    function getInventoryElementAmt(name) {
	    	return getPlayerInventory().contents["playerElements"].elementsHolder.getAmtByName(name);
	    };
	    
	    function getInventoryElementPct(name){
	    	return getPlayerInventory().contents["playerElements"].elementsHolder.getPctByName(name);
	    };

        return {
            init : init,
            getPlayerInventory : getPlayerInventory,
            update: update,
            getInventoryElementAmt: getInventoryElementAmt,
            getInventoryElementPct: getInventoryElementPct,
        };

    })();

});
