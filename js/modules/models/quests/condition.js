/**
 * @author April
 */

define(["inheritance"], function(Inheritance) {
    return (function() {

        // Private functions
        var idCount = 0;

        var Condition = Class.extend({
        	
            init : function(desc) {
                this.idNumber = idCount;
                idCount++;
				this.setDescription(desc);
				
				// Set by quest to see if it's been triggered properly
				this.satisfied = false;
            },
            
            satisfy : function(){
            	this.satisfied = true;
            },
            
            // =============== custom functions to be set by the implementer ==============
            // The condition function returns true when the quest is complete, false if otherwise
            // Currently all conditions are set in 1 function. 
            // Could easily set this as a series of conditions (which may also hold their descriptions)

                        
            setDescription : function(desc){
            	this.description = desc;
            },


        });
        return Condition;
    })();

});
