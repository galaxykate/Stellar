/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {

        var PopupController = Class.extend({

            init : function() {
				console.log("Init a popup controller!!!");
				
            },
            
            /* set of available actions:
             * http://api.jquery.com/category/events/
             */
            
            setActionDimensionChange : function(divID, popupModule, stateName, action, width, height, opa) {
            	var div = $("#" + divID);
              	//div.html("RAWR!!!!");
              	//var div = $("#" + divID);
              	//console.log(div);
              	
              	switch(action){
              		case "mousedown":
              			div.mousedown(function() {
		                	console.log(action + " on " + divID); 
		                	$(this).width(width);
		                	$(this).height(height);
		                	$(this).css({ opacity: opa });
		                	popupModule.setState(stateName);
		              	});
              			break;
              		case "mouseleave":
              			div.mouseleave(function() {
		                	console.log(action + " on " + divID); 
		                	$(this).width(width);
		                	$(this).height(height);
		                	$(this).css({ opacity: opa });
		                	popupModule.setState(stateName);
		              	});
              			break;
              		default:
              			break;
              	}
              	

            }, 
            
            clearActions : function(divID) {
            	$("#" + divID).unbind();
            }
            
            
        });

        return PopupController;
    })();

});
