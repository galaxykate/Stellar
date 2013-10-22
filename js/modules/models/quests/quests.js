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
        	name : "Gather H, He, and C", //elementSet
        	level : 2,
        	giver : "global",
        	
        	conditions : [ { desc : "Move over dust that contains Hydrogen to siphon it into your inventory", },
        				   { desc : "Move over dust that contains Helium to siphon it into your inventory", }, 
        				   { desc : "Move over dust that contains Carbon to siphon it into your inventory", },
        				 ],
        	onComplete: function(){  },
        	unlockDescs: [  ],
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather O, Si, and Fe", //elementSet
        	level : 6,
        	giver : "global",
        	
        	conditions : [ { desc : "Move over dust that contains Oxygen to siphon it into your inventory", },
        				   { desc : "Move over dust that contains Silicon to siphon it into your inventory", }, 
        				   { desc : "Move over dust that contains Iron to siphon it into your inventory", },
        				 ],
        	onComplete: function(){  },
        	unlockDescs: [  ],
        }, {
        	// Requres gathering elements with the move tool (and dumping them into the inventory?)
        	name : "Gather Au and U", //elementSet
        	level : 10,
        	giver : "global",
        	conditions : [ { desc : "Move over dust that contains Gold to siphon it into your inventory", },
        				   { desc : "Move over dust that contains Uranium to siphon it into your inventory", }, 
        				 ],
        	onComplete: function(){  },
        	unlockDescs: [  ],
        }, 
        
        	// ----------------------------------
        	// ------- Feed Quests -----------
        	// ----------------------------------
        {
        	// Tutorial Business - feeding the star, a basic action
        	name : "Feed a Star Hydrogen", //elements_widget feed.js 
        	level : 0,
        	giver : "global",
        	conditions : [ { desc : "Select Hydrogen in your inventory", }, 
        				   { desc : "Click on a star to give it some Hydrogen", }, ],
        	onComplete: function(){ settings.setMoveZoomToolUnlocked(true),
        							settings.setHeliumUnlocked(true) },
        	unlockDescs: [ { desc : "Zooming and Movement Unlocked!", },
        			       { desc : "Helium Unlocked!", }, ],
        }, {
        	name : "Feed a Star He and C", //elements_widget feed.js
        	level : 3,
        	giver : "global",
        	conditions : [ { desc : "Select Helium in your inventory", }, 
        				   { desc : "Click on a star to give it some Helium" , }, //NOTE:ONLY WORKS ON KATE'S NEW STAR
        				   { desc : "Do the same for Carbon", }, ], //NOTE:ONLY WORKS ON KATE'S NEW STAR
        	unlockDescs: [  ],
        }, /*{
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
        	level : 9,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Hydrogen inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Helium Reserve",
        	level : 10,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Helium inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Carbon Reserve",
        	level : 11,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Carbon inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Oxygen Reserve",
        	level : 12,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Oxygen inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Silicon Reserve",
        	level : 13,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Silicon inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Iron Reserve",
        	level : 14,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Iron inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Gold Reserve",
        	level : 15,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Gold inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, {
        	name : "Max out Uranium Reserve",
        	level : 16,
        	giver : "global",
        	conditions : [ { desc : "Fill inventory Uranium inventory slot to its maximum", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, 
        	// ----------------------------------
        	// ------- Empty Reserves -----------
        	// ----------------------------------
        {
        	// Tutorial Business - introduces the bar of elements 
        	name : "Completely Empty Your Elemental Reserves",
        	level : 8,
        	giver : "global",
        	conditions : [ { desc : "Spend all your elements on feeding stars", }, ],
        	onComplete: function(){ settings.setPlayerElementCapacity(settings.playerElementCapacity + 10) },
        	unlockDescs: [ { desc : "Increased Element Carrying Capacity!", }, ],
        }, 
        
        	// ----------------------------------
        	// ------- Tools -----------
        	// ----------------------------------
        
        {
        	// Tutorial Business - introduces move tool
        	name : "Navigating Space", //universe_view move.js 
        	level : 1,
        	giver : "global",
        	conditions : [ { desc : "Zoom out of the home star", },
        				   { desc : "Click and drag to cruise around space", }, 
        				   { desc : "Double-click on a star to zoom in on it" }],
        	onComplete: function(){ settings.setSiphoningFromDustUnlocked(true)
        							settings.setCarbonUnlocked(true) },
        	unlockDescs: [ { desc : "Siphoning (Picking Up) Dust Unlocked!", },
        			       { desc : "Carbon Unlocked!", }, ],
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
        	unlockDescs: [  ],
        }, /*{
        	// Requires navigation away from the home star
        	name : "Examine Another Star", //universe_controller
        	level : 3,
        	giver : "global",
        	
        	conditions : [ { desc : "Zoom in on a star by double-clicking on it", }, ],
        	unlockDescs: [  ],
        },*/ {
        	
        	// Interacting with the various space elements
        	name : "Clear a Dust Trail",
        	level : 2,
        	giver : "global",
        	conditions : [ { desc : "Gather all dust nodes from a trail of dust", }, ],
        	onComplete: function(){  },
        	unlockDescs: [  ],
        }, {
        	
        	// Interacting with the various space elements
        	name : "Clear all Dust Trails in a Region",
        	level : 9,
        	giver : "global",
        	conditions : [ { desc : "Gather all dust nodes from all trails of dust in a single region", }, ],
        	unlockDescs: [  ],
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
