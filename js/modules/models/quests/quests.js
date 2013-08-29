/**
 * @author April Grow
 */

// Quests (also can be used as achievements)
// To be imported and used by the questManager

define(['modules/models/ui/uiManager', particleTypePath + "star"], function(uiManager, Star) {
    return (function() {
        return [
        
        	// ----------------------------------
        	// ------- giver: global -----------
        	// ----------------------------------
        	
        	// Global quests can be seen more like facebook quests/achievements:
        	// permanently achieved once all conditions are satisfied at one time
        	
        {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Inventory Use: Helium",
        	level : 0,
        	giver : "global",
        	
        	conditions : [
        		{
		        	func : function(){
		        		if(uiManager.getInventoryElementAmt("Helium") > 0) return true;
		        		else return false;
		        	},
		        	desc : "Get some helium in your inventory",
	        	},
        	],
        }, {
        	
        	// Requires navigation away from the home star
        	name : "Discover a New Star",
        	level : 1,
        	giver : "global",
        	
        	conditions : [
        		{
		        	func : function(){
						return false;
		        	},
		        	desc : "Go out into the wilderness and find a new star!",
	        	},
        	],
        }, {
        	
        	// Interacting with the various space elements
        	name : "Clear a Dust Trail",
        	level : 1,
        	giver : "global",
        	
        	conditions : [
        		{
		        	func : function(){
						return false;
		        	},
		        	desc : "Gather all dust nodes from a trail of dust.",
	        	},
        	],
        }, {
        	// ----------------------------------
        	// ------- giver: critter -----------
        	// ----------------------------------
        	
        	// Critters need these conditions of their home planets to STAY viable
        	// They will reject/leave a star if the conditions are no longer satisfied
        	
        	name : "Hydrogen Home",
        	level : 1,
        	giver : "critter",
        	
        	conditions : [
        		{
		        	func : function(star){
						return (star.elements.getPctByName(Hydrogen) === 1);
		        	},
		        	desc : "I require a star that is nothing but Hydrogen.",
	        	},
        	],
        }, {
        	name : "Zero Degrees",
        	level : 1,
        	giver : "critter",
        	
        	conditions : [
        		{
		        	func : function(star){
						return (star.temperature === 0);
		        	},
		        	desc : "I need a star that is cold as ice.",
	        	},
        	],
        }, {
        	name : "Stable Burning Sun",
        	level : 1,
        	giver : "critter",
        	
        	conditions : [
        		{
		        	func : function(star){
						return (star.state === Star.states[2]);
		        	},
		        	desc : "I can only live by a star if it is alive and actively burning elements.",
	        	},
        	],
        }];
    })();

});
