/**
 * @author April
 */

define(["inheritance"], function(Inheritance) {
    return (function() {

        // Private functions
        var idCount = 0;

        var Condition = Class.extend({
        	
            init : function(func, desc) {
                this.idNumber = idCount;
                idCount++;
				setFunction(func);
				setDescription(desc);
            },
            
            // =============== custom functions to be set by the implementer ==============
            // The condition function returns true when the quest is complete, false if otherwise
            // Currently all conditions are set in 1 function. 
            // Could easily set this as a series of conditions (which may also hold their descriptions)
            setFunction : function(func){
            	this.truthTest = func;
            },
                        
            setDescription : function(desc){
            	this.description = desc;
            },
            
            truthCheck : function(){
            	if(this.truthTest()) return true;
            	else return false;
            }

        });
        return Condition;
    })();

});
