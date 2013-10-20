/**
 * @author April Grow
 */

// Saves/Loads states via localStorage

define(['modules/models/saving/save'], function(Save) {
	return (function() {

        function init() {
        	if(localStorage.stellarSave){ 
        		// Note: Gotta clear stellarSave when we want to load new data, 
        		// Or just check if individual pieces of data exist
        		// TO DO: How to check if progress has been made to save new data?!
        		console.log("LOAD SAVE : " + localStorage.getItem("stellarSave"));
        	} else {
        		var id = Math.random();
        		localStorage.setItem("stellarSave", "hello? " + id);
        		console.log("SET SAVE: " + id);
        	}
        	
        	testSave();
        };
        
        // Unit test of saving/loading various string pairs
        // Shows side-effects of objects with multiple names saving/loading
        function testSave(){
        	var save = new Save();
    		save.saveItem("hello", "world");
    		var str = save.objectToJSONStr(save.wrapIntoSaveObject());
    		console.log("SAVED " + str);
    		
    		// When two objects have the same name, what happens in a save?
    		// Most recent data added overrides the old automatically
    		save.saveItem("hello", "BWAHAHAHA");
    		var str2 = save.objectToJSONStr(save.wrapIntoSaveObject());
    		console.log("SAVED " + str2);
    		
    		// When you load an object with different data, what happens?
    		// Completely overrides whatever is in there, as expected
    		save.parseJSONObject(save.loadObjectFromJSONStr(str));
    		var str3 = save.objectToJSONStr(save.wrapIntoSaveObject());
    		console.log("SAVED " + str3);
    		
    		// Testing additive saving: replaces "hello: world" with "hello: BWAHAHAHA"
    		save.safeSaveItem("hello", "BWAHAHAHA");
    		var str4 = save.objectToJSONStr(save.wrapIntoSaveObject(), true);
    		console.log("SAVED " + str4);
    		
        };
        

        return {
            init : init,
        };

    })();

});
