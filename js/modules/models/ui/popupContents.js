/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/elementSet"], function(Inheritance, Vector, UParticle, ElementSet) {
    return (function() {
    	var htmlCount = 0;
    	
    	
    	// ========================================
    	// View stuff
    	
    	function createDivForAllElements(parentID, id) {
    		var options = {
                html : "Elements:<br>",
                "class" : "contentHolder",
                "id" : id
            };
            
			var div = $('<div/>', options);
			
			var parent = $("#" + parentID)
			parent.append(div); 

    	};
    	
    	function createDivForCritters(parentID, id) {
    		var options = {
                html : "Critters:<br>",
                "class" : "contentHolder",
                "id" : id
            };
            
			var div = $('<div/>', options);
			
			var parent = $("#" + parentID)
			parent.append(div); 

    	};
    	
    	function wrapTextIntoHTML(divID, str){
    		var div = $("#" + divID);
    		div.html(str);
    	}
    	
    	function wrapStatisticsIntoHTML(divID){
    		var html = "";
    		var div = $("#" + divID);
    		
    		html += "Number of items 'inserted' into quadtree: " + stellarGame.statistics.numItemsInQuadTree + "<br>";
    		html += "Number of Dust Trails Ever Created: " + stellarGame.statistics.numberOfTrails + "<br>";
    		html += "Number of Critters Ever Created: " + stellarGame.statistics.numberOfCritters + "<br>";
    		html += "Number of Dust Ever Created: " + stellarGame.statistics.numberOfDust + "<br>";
    		html += "Number of Big Stars Ever Created: " + stellarGame.statistics.numberOfStars + "<br><br>";
    		html += "Number of Background Stars: " + stellarGame.statistics.bgStarCount + "<br>";
    		
    		div.html(html);
    		//console.log("Setting html");
    		//console.log(div);
    	};
    	
    	function emptyHTMLContents(divID){
    		var div = $("#" + divID);
    		div.html = "";
    	};
    	
    	// =========================================
    	
    	// Trying for mini processing windows
    	initProcessing = function(g) {
            g.size(20, 20);

            g.colorMode(g.HSB, 1);
            g.background(.45, 1, 1);

            // Set the drawing function of processing (used for both drawing and updating)
            g.draw = function() {
                //if (stellarGame.ready) {
                //    universeView.update(g.millis() * .001);
                //    universeView.draw(g);
                //}
            };
        };
    	

        var PopupContents = Class.extend({

            init : function() {
				//console.log("a set of popupContents initiated");
            	
            },
            
            initAsElementHolder : function() {
            	this.elementsHolder = new ElementSet();
            	this.elementsHolder.siphoning = false;
            	console.log("new elementSet as elements holder: " + this.elementsHolder);
            },
            
            initAsCritterHolder : function() {
            	this.critterHolderID = this.parentDivID + "_critters";
            	createDivForCritters(this.parentDivID, this.critterHolderID);
            },
            
            initStatisticsHTMLHolder : function() {
            	this.liveHTMLHolder = true;
            },
            
            // Only call after attached to a parent: needs parentDivID
            updateIndividualElements : function() {
            	if(this.elementsHolder !== undefined){
            		this.elementsHolder.addAllElementsToADiv(this.elementsHolderID);
            	}
            },
            
            // Gets set when added to a popup: generally after initation?
            setParentDivID : function (str) {
            	this.parentDivID = str;
            	if(this.elementsHolder !== undefined){
            		this.elementsHolderID = this.parentDivID + "_elements";
            		//console.log("SetParentID of elementsHolder: " + this.elementsHolderID);
            		createDivForAllElements(this.parentDivID, this.elementsHolderID);
            		
            		this.updateIndividualElements();
            	} else if (this.liveHTMLHolder !== undefined) {
            		this.htmlHolderID = this.parentDivID + "_html" + htmlCount;
            		
            		htmlCount++;
            		
            		// ========================================
    				// View stuff
    				
    				var id = this.htmlHolderID;
    				var options = {
		                "id" : this.htmlHolderID
		            };
		            
					var div = $('<div/>', options);
					var parent = $("#" + this.parentDivID)
					parent.append(div); 
					
					//setInterval(function(){wrapStatisticsIntoHTML(id)},1000);
    				
    				// ========================================
            		
            	}
            	// grab the div and do some fancy insertions?!?!?!?
            	// Or grab the view and do it there
            },
            
            updateElementsDrawAndUpdate : function() {
            	var contents = this;
            	contents.elementsHolder.draw = function() {
            		// Should be empty! Probably
            	};
            	contents.elementsHolder.update = function() {
            		//utilities.debugOutput("UPDATING CONTENTS?!");
            		//utilities.debugOutput("elementsHolder.siphoning: " + contents.elementsHolder.siphoning + ", " + contents.elementsHolder.siphonElement);
            		if(contents.elementsHolder.siphoning){
            			// siphon selected Element
            			utilities.debugOutput("SIPHONING... " + contents.elementsHolder.siphonElement);
            			// stellargame.touch.activeTool
            			//console.log(stellarGame.touch.activeTool);
            			stellarGame.touch.activeTool.elements.siphonOneByName(contents.elementsHolder, contents.elementsHolder.siphonElement, .01);
            			
            		}
            		contents.elementsHolder.updateAllElementsInDiv(); 
            	};
            },
            
            update : function() {
            	if(this.elementsHolder !== undefined && this.elementsHolder.update !== undefined){
            		//utilities.debugOutput("updating in popupContents");
            		this.elementsHolder.update();
            	}
            },
 
            
        });

        return PopupContents;
    })();

});
