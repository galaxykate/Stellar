/**
 * @author April Grow
 */

// Quests (also can be used as achievements)
// To be imported and used by the questManager

/************ NOTE *************
 *		If you change the names of quests, you have to change the .satisfy(Questname) 
 ************* NOTE ************/

define([], function() {
    return (function() {
        return [
        
        	// ----------------------------------
        	// ------- giver: global -----------
        	// ----------------------------------
        	
        	// Global quests can be seen more like facebook quests/achievements:
        	// permanently achieved once all conditions are satisfied at one time
        	
        	// ----------------------------------
        	// ------- Gather Quests -----------
        	// ----------------------------------
        	
        {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Hydrogen",
        	level : 1,
        	giver : "global",
        	
        	conditions : [ { desc : "Move over dust that contains Hydrogen to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.heliumUnlocked = true;
        							var element = stellarGame.activeElements[1];
        							stellarGame.player.widget.disable(element) },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Helium",
        	level : 2,
        	giver : "global",
        	
        	conditions : [ { desc : "Move over dust that contains Helium to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.carbonUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Carbon",
        	level : 3,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Carbon to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.oxygenUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Oxygen",
        	level : 4,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Oxygen to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.siliconUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Silicon",
        	level : 5,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Silicon to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.ironUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Iron",
        	level : 6,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Iron to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.goldUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Gold",
        	level : 7,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Gold to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.uraniumUnlocked = true },
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Uranium",
        	level : 8,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Uranium to siphon it into your inventory", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, 
        
        	// ----------------------------------
        	// ------- Feed Quests -----------
        	// ----------------------------------
        {
        	// Tutorial Business - feeding the star, a basic action
        	name : "Feed a Star Hydrogen",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Hydrogen in your inventory", }, 
        				   { desc : "Click on a star to give it some Hydrogen", }, ],
        }, /*{
        	name : "Feed a Star Helium",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Helium in your inventory", }, 
        				   { desc : "Click on a star to give it some Helium", }, ],
        }, {
        	name : "Feed a Star Carbon",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Carbon in your inventory", }, 
        				   { desc : "Click on a star to give it some Carbon", }, ],
        }, {
        	name : "Feed a Star Oxygen",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Oxygen in your inventory", }, 
        				   { desc : "Click on a star to give it some Oxygen", }, ],
        }, {
        	name : "Feed a Star Silicon",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Silicon in your inventory", }, 
        				   { desc : "Click on a star to give it some Silicon", }, ],
        }, {
        	name : "Feed a Star Iron",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Iron in your inventory", }, 
        				   { desc : "Click on a star to give it some Iron", }, ],
        }, {
        	name : "Feed a Star Gold",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Gold in your inventory", }, 
        				   { desc : "Click on a star to give it some Gold", }, ],
        }, {
        	name : "Feed a Star Uranium",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Uranium in your inventory", }, 
        				   { desc : "Click on a star to give it some Uranium", }, ],
        }, */
        
        	// ----------------------------------
        	// ------- Max out Reserves -----------
        	// ----------------------------------
        {
        	name : "Max out Hydrogen Reserve",
        	level : 1,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Hydrogen inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Helium Reserve",
        	level : 2,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Helium inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Carbon Reserve",
        	level : 3,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Carbon inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Oxygen Reserve",
        	level : 4,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Oxygen inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Silicon Reserve",
        	level : 5,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Silicon inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Iron Reserve",
        	level : 6,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Iron inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Gold Reserve",
        	level : 7,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Gold inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, {
        	name : "Max out Uranium Reserve",
        	level : 8,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Uranium inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, 
        	// ----------------------------------
        	// ------- Empty Reserves -----------
        	// ----------------------------------
        {
        	// Tutorial Business - introduces the bar of elements 
        	name : "Completely Empty Your Elemental Reserves",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Spend all your elements on feeding stars", }, ],
        	onComplete: function(){ settings.playerElementCapacity += 10 },
        }, 
        
        	// ----------------------------------
        	// ------- Tools -----------
        	// ----------------------------------
        
        {
        	// Tutorial Business - introduces move tool
        	name : "Navigating Space",
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Zoom out of the home star", },
        				   { desc : "Click and drag to cruise around space", }, 
        				   { desc : "Zoom in on a star by double-clicking on it", }, ],
        	onComplete: function(){ settings.tempToolUnlocked = true },
        }, 
        
        // Have some heat/density quests
        
        	// ----------------------------------
        	// ------- Exploration -----------
        	// ----------------------------------
        	
        {
        	// Tutorial Business - required to move on to other stars
        	name : "Experience a Supernova",
        	level : 8,
        	giver : "global",
        	conditions : [ { desc : "Watch a star go supernova", },
        				   { desc : "Gather up the elements from a supernova", }, ],
        }, {
        	// Requires navigation away from the home star
        	name : "Discover a New Star",
        	level : 1,
        	giver : "global",
        	
        	conditions : [ { desc : "Go out into the wilderness and find a new star!", }, ],
        }, {
        	
        	// Interacting with the various space elements
        	name : "Clear a Dust Trail",
        	level : 8,
        	giver : "global",
        	
        	conditions : [ { desc : "Gather all dust nodes from a trail of dust.", }, ],
        }, {
        	
        	// Interacting with the various space elements
        	name : "Clear all Dust Trails in a Region",
        	level : 8,
        	giver : "global",
        	
        	conditions : [ { desc : "Gather all dust nodes from all trails of dust in a single region", }, ],
        }
        /*}, {
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
		        	desc : "I require a star that is nothing but Hydrogen.",
	        	},
        	],
        }, {
        	name : "Zero Degrees",
        	level : 1,
        	giver : "critter",
        	
        	conditions : [
        		{
		        	desc : "I need a star that is cold as ice.",
	        	},
        	],
        }, {
        	name : "Stable Burning Sun",
        	level : 1,
        	giver : "critter",
        	
        	conditions : [
        		{
		        	desc : "I can only live by a star if it is alive and actively burning elements.",
	        	},
        	],*/
        ];
    })();

});
