/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", 'modules/views/popup_view', 'modules/controllers/popup_controller'], function(Inheritance, Vector, PopupView, PopupController) {
    return (function() {

        var Popup = Class.extend({

            init : function(parentString) {
				console.log("Init a popup!!!");
				this.states = [];
				this.transitions = [];
				this.view = new PopupView(parentString);
				this.controller = new PopupController();
				this.activeState = null;
				this.view.createPopupDiv(0, 0, 0, 0);
            	
            },
            
            
            
            addState : function(name, x, y, width, height, opa) {
            	var state = {
            		"top": x,
            		"left": y,
            		"width": width,
            		"height": height,
            		"opacity": opa
            	};
            	
            	this.states[name] = state;
            	//console.log("adding popup state: " + name);
            },
            
            addTransition : function(nameFrom, nameTo, action){
            	var transition = {
            		"from": nameFrom,
            		"to": nameTo,
            		"action": action
            	}
            	this.transitions.push(transition);
            	//console.log("adding popup transition from " + nameFrom +": " + action);
            },
            
            setState : function(name) {
            	this.activeState = name;
            	// set the view and controller
            	
            	// set top, left, width, height in view
            	this.view.updatePopupDiv(this.states[name].top, this.states[name].left, this.states[name].width, this.states[name].height, this.states[name].opacity);
            	
            	this.controller.clearActions(this.view.divID);
            	
            	// loop through transitions and put them in controller
            	for(var i = 0; i < this.transitions.length; i++) {
            		output = this.transitions[i];
            		
	            	if(this.activeState === output.from){
	            		
	            		var to = this.states[output.to];
	            		this.controller.setActionDimensionChange(this.view.divID, this, output.to, output.action, to.width, to.height, to.opacity);
	            	}
		        }
            },
            
            
            
            
        });

        return Popup;
    })();

});
