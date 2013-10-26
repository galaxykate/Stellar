/**
 * @author April Grow
 */

// Saves/Loads states via localStorage

define(['modules/models/saving/save'], function(Save) {
	return (function() {

        function init() {
        	stellarGame.saveManager = this;
        	
        	if(localStorage.stellarSave){ 
        		// Note: Gotta clear stellarSave when we want to load new data, 
        		// Or just check if individual pieces of data exist
        		// TO DO: How to check if progress has been made to save new data?!
        		console.log("LOAD SAVE : " + localStorage.getItem("stellarSave"));
        		
        		// A special case to load settings here because we know they are already initialized
        		// Other modules should call load when they are ready for the data to be loaded
        		loadSettings();
        		
        	} else {
        		var id = Math.random();
        		localStorage.setItem("stellarSave", id);
        		console.log("SET SAVE: " + id);
        	}
        	
        	//testSave();
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
        
        function wipeLocalStorage(){
        	console.log("!!! Reseting LocalStorage for StellarSave !!!");
        	//localStorage.removeItem("stellarSave");
        	localStorage.clear();
        };
        
        function saveAllAvailableItems(){
        	saveSettings();
        };
        
        function saveSettings(){
        	// Make Save Object (if one doesn't already exist)
        	if(!this.settingsData){
        		this.settingsData = new Save();
        	}
        	
        	// Save all parameters of settings that we want to save
        	this.settingsData.safeSaveItem("h", settings.hydrogenUnlocked);
        	this.settingsData.safeSaveItem("he", settings.heliumUnlocked);
        	this.settingsData.safeSaveItem("c", settings.carbonUnlocked);
        	this.settingsData.safeSaveItem("o", settings.oxygenUnlocked);
        	this.settingsData.safeSaveItem("si", settings.siliconUnlocked);
        	this.settingsData.safeSaveItem("fe", settings.ironUnlocked);
        	this.settingsData.safeSaveItem("au", settings.goldUnlocked);
        	this.settingsData.safeSaveItem("u", settings.uraniumUnlocked);
        	this.settingsData.safeSaveItem("move", settings.moveZoomToolUnlocked);
        	this.settingsData.safeSaveItem("siphon", settings.siphoningFromDust);
        	this.settingsData.safeSaveItem("temp", settings.tempToolUnlocked);
        	this.settingsData.safeSaveItem("density", settings.densityToolUnlocked);
        	
        	// Local Storage set item!
        	localStorage.setItem("settingsData", this.settingsData.objectToJSONStr(this.settingsData.wrapIntoSaveObject()));
        };
        
        function loadSettings(){
        	// Make save object with loaded local storage item
        	if(!this.settingsData){
        		this.settingsData = new Save();
        	}
        	this.settingsData.parseJSONObject(this.settingsData.loadObjectFromJSONStr(localStorage.getItem("settingsData")));
        	
        	// Set all the parameters of settings
        	settings.setHydrogenUnlocked(this.settingsData.getItemByName("h"));
        	settings.setHeliumUnlocked(this.settingsData.getItemByName("he"));
        	settings.setCarbonUnlocked(this.settingsData.getItemByName("c"));
        	settings.setOxygenUnlocked(this.settingsData.getItemByName("o"));
        	settings.setSiliconUnlocked(this.settingsData.getItemByName("si"));
        	settings.setIronUnlocked(this.settingsData.getItemByName("fe"));
        	settings.setGoldUnlocked(this.settingsData.getItemByName("au"));
        	settings.setUraniumUnlocked(this.settingsData.getItemByName("u"));
        	
        	settings.setMoveZoomToolUnlocked(this.settingsData.getItemByName("move"));
        	settings.setSiphoningFromDustUnlocked(this.settingsData.getItemByName("siphon"));
        	settings.setTempToolUnlocked(this.settingsData.getItemByName("temp"));
        	settings.setDensityToolUnlocked(this.settingsData.getItemByName("density"));
        };
        

        return {
            init : init,
            wipeLocalStorage : wipeLocalStorage,
            saveAllAvailableItems : saveAllAvailableItems,
        };

    })();

});
