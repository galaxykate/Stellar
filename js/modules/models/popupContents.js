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
            
			var div = $('<div/>', this.options);
			
			var parent = $(parentID)
			parent.append(div);
			console.log(parent);
			
			console.log('appending ' + id + " to " + parentID);
    	};
    	
    	
    	
    	// =========================================

        var PopupContents = Class.extend({

            init : function() {
				console.log("a set of popupContents initiated");
            	
            },
            
            initAsElementHolder : function() {
            	this.elementsHolder = new UParticle();
            	this.elementsHolder.initAsElementContainer();
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
            }
            
 
            
        });

        return PopupContents;
    })();

});
