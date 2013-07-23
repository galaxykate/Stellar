/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", particleTypePath + "uparticle", "modules/models/elementSet"], function(Inheritance, Vector, Uparticle) {
    return (function() {
    	
    	// ========================================
    	// View stuff
    	function createDivForElement(){
    		
    	};
    	
    	// =========================================

        var PopupContents = Class.extend({

            init : function() {
				
            	
            },
            
            initAsElementHolder : function() {
            	this.elementsHolder = new Uparticle();
            },
            
            updateIndividualElements : function() {
            	
            },
            
            setParentDivID : function (str) {
            	this.parentDivID = str;
            	// grab the div and do some fancy insertions?!?!?!?
            	// Or grab the view and do it there
            }
            
 
            
        });

        return PopupContents;
    })();

});
