/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", "uparticle", "modules/models/elementSet"], function(Inheritance, Vector, UParticle, ElementSet) {
    return (function() {
    	
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
			
			console.log('appending ' + id + " to " + parentID);
			
			//console.log(parent);
			//console.log(div);

    	};
    	
    	
    	
    	// =========================================

        var PopupContents = Class.extend({

            init : function() {
				console.log("a set of popupContents initiated");
            	
            },
            
            initAsElementHolder : function() {
            	this.elementsHolder = new UParticle();
            	this.elementsHolder.initAsElementContainer();
            	this.elementsHolder.siphoning = false;
            	//console.log("new uparticle: " + this.elementsHolder);
            },
            
            // Only call after attached to a parent: needs parentDivID
            updateIndividualElements : function() {
            	if(this.elementsHolder !== undefined){
            		this.elementsHolder.elements.addAllElementsToADiv(this.elementsHolderID);
            	}
            },
            
            // Gets set when added to a popup: generally after initation?
            setParentDivID : function (str) {
            	this.parentDivID = str;
            	if(this.elementsHolder !== undefined){
            		this.elementsHolderID = this.parentDivID + "_elements";
            		console.log("SetParentID of elementsHolder: " + this.elementsHolderID);
            		createDivForAllElements(this.parentDivID, this.elementsHolderID);
            		
            		this.updateIndividualElements();
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
            		if(contents.elementsHolder.siphoning){
            			// siphon selected Element
            			utilities.debugOutput("SIPHONING... " + contents.elementsHolder.siphonElement);
            			// stellargame.touch.activeTool
            			//console.log(stellarGame.touch.activeTool);
            			stellarGame.touch.activeTool.elements.siphonOneByName(contents.elementsHolder.elements, contents.elementsHolder.siphonElement, .05);
            			contents.elementsHolder.elements.updateAllElementsInDiv(); 
            		}
            	};
            },
            
            addElementsToUniverse : function() {
            	stellarGame.universe.spawn(this.elementsHolder);
            },
 
            
        });

        return PopupContents;
    })();

});
