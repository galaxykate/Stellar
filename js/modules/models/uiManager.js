/**
 * @author April Grow
 */

// Its the Universe!

define(['modules/views/game_view', "modules/models/popup", "modules/models/popupContents"], function(gameView, Popup, PopupContents) {

    return (function() {
    	var playerInventory;
    	var infoScreen;

        function init() {
            console.log("INIT UI");


            makeInventoryPopup();
            makeMainMenu();
        };
        
        function makeInventoryPopup() {
        	playerInventory = new Popup("#universe");
        	
	        var universeHeight = gameView.universeView.dimensions.height;
	        
	        playerInventory.addState("closed", 0, 0, 20, universeHeight, 0.1);
	        playerInventory.addState("open", 0, 0, 200, universeHeight, 1);
	        playerInventory.addTransition("open", "closed", "mouseleave");
	        playerInventory.addTransition("closed", "open", "mousedown");
	        playerInventory.setState("closed");
	        
	        var contents = new PopupContents();
	        contents.initAsElementHolder();
	        contents.updateElementsDrawAndUpdate();
	        contents.addElementsToUniverse();
	        playerInventory.addContents("playerElements", contents);
	        
	    };
	    
	    function makeMainMenu() {
	    	infoScreen = new Popup("#universe");
	    	
	    	var universeWidth = gameView.universeView.dimensions.width;
	    	var universeHeight = gameView.universeView.dimensions.height;
	    	
	    	infoScreen.addState("closed", universeWidth-40, 0, 20, 20, 0.5);
	    	infoScreen.addState("open", 20, 20, universeWidth-50, universeHeight-50, 1);
	    	//infoScreen.addTransition("open", "closed", "click");
	    	infoScreen.addTransition("closed", "open", "click");
	    	infoScreen.setState("closed");
	    	infoScreen.addCloseDiv();
	    	
	    	var menu = new PopupContents();
	    	infoScreen.addContents("menu", menu);
	    	
	    	var stats = new PopupContents();
	    	infoScreen.addContents("stats", stats);
	    };
	    
	    function getPlayerInventory() {
	    	return playerInventory;
	    };

        return {
            init : init,
            getPlayerInventory : getPlayerInventory
        };

    })();

});
