/**
 * @author April Grow
 */

// Its the Universe!

define(['modules/views/game_view', "modules/models/popup", "modules/models/popupContents"], function(gameView, Popup, PopupContents) {

    return (function() {
    	var playerInventory;

        function init() {
            console.log("INIT UI");


            makeInventoryPopup();
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
	    
	    function getPlayerInventory() {
	    	return playerInventory;
	    };

        return {
            init : init,
            getPlayerInventory : getPlayerInventory
        };

    })();

});
