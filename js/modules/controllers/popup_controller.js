/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {

        var PopupController = Class.extend({

            init : function() {
				//console.log("Init a popup controller!!!");
				
            },
            
            /* set of available actions:
             * http://api.jquery.com/category/events/
             */
            
            setActionDimensionChange : function(divID, popupModule, stateName, action, width, height, opa, bubble) {
            	var div = $("#" + divID);
              	//div.html("RAWR!!!!");
              	//var div = $("#" + divID);
              	//console.log(div);
              	
              	// If width, height, and opacity are not set, do not change them
              	if(width === undefined) width = div.width();
              	if(height === undefined) height = div.height();
              	if(opa === undefined) opa = div.css("opacity");
              	
              	// event.target.id check prevents bubbling of events. Perhaps make this an option?
              	switch(action){
              		case "mousedown":
              			div.mousedown(function(event) {
              				if(bubble || (!bubble && divID === event.target.id)){
			                	//console.log(action + " on " + divID); 
			                	$(this).width(width);
			                	$(this).height(height);
			                	$(this).css({ opacity: opa });
			                	popupModule.setState(stateName);
		                	}
		              	});
              			break;
              		case "mouseleave":
              			div.mouseleave(function(event) {
              				if(bubble || (!bubble && divID === event.target.id)){
			                	//console.log(action + " on " + divID); 
			                	$(this).width(width);
			                	$(this).height(height);
			                	$(this).css({ opacity: opa });
			                	popupModule.setState(stateName);
			                }
		              	});
              			break;
              		case "click":
              			div.click(function(event) {
              				//console.log("div id " + divID + " ==? " + event.target.id)
              				//console.log("bubble? : " + bubble);
              				//console.log("other test? : " + (!bubble && divID === event.target.id));
              				if(bubble || (!bubble && divID === event.target.id)){
			                	//console.log(action + " on " + divID + ", transitioning to " + stateName); 
			                	//console.log("clicked: " + event.target.id);
			                	$(this).width(width);
			                	$(this).height(height);
			                	$(this).css({ opacity: opa });
			                	popupModule.setState(stateName);
		                	}
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
