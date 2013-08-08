/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", 'modules/views/popup_view', 'modules/controllers/popup_controller'], function(Inheritance, Vector, PopupView, PopupController) {
    return (function() {

        var Popup = Class.extend({

            init : function(parentString) {
				//console.log("Init a popup!!!");
				this.states = [];
				this.transitions = [];
				this.contents = [];
				this.contentNames = [];
				this.view = new PopupView(parentString);
				this.controller = new PopupController();
				this.activeState = null;
				this.view.createPopupDiv(0, 0, 0, 0);
				this.hasCloseDiv = false;
            	
            },
            
            addContents : function(name, goodies) {
            	goodies.setParentDivID(this.view.divID);
            	//console.log("goodies! ");
            	//console.log(goodies);
            	this.contents[name] = goodies;
            	this.contentNames.push(name);
            },
            
            
            addState : function(name, x, y, width, height, opa) {
            	var state = {
            		"top": y,
            		"left": x,
            		"width": width,
            		"height": height,
            		"opacity": opa,
            		contents : [] // names of the contents
            	};
            	
            	this.states[name] = state;
            	//console.log("adding popup state: " + name);
            },
            
            addContentsToState : function(stateName, contentsName){
            	this.states[stateName].contents.push(contentsName);
            },
            
            addTransition : function(nameFrom, nameTo, action, bubble){
            	var transition = {
            		"from": nameFrom,
            		"to": nameTo,
            		"action": action,
            		"bubble": bubble
            	}
            	this.transitions.push(transition);
            	//console.log("adding popup transition from " + nameFrom +": " + action);
            },
            
            setState : function(name) {
            	this.activeState = name;
            	// set the view and controller
            	//console.log("setting state name : " + name);
            	//console.log(this.states);
            	//console.log(this.states[name]);
            	// set top, left, width, height in view
            	this.view.updatePopupDiv(this.states[name].top, this.states[name].left, this.states[name].width, this.states[name].height, this.states[name].opacity);
            	
            	this.controller.clearActions(this.view.divID);
            	
            	// loop through transitions and put them in controller
            	for(var i = 0; i < this.transitions.length; i++) {
            		output = this.transitions[i];
            		
	            	if(this.activeState === output.from){
	            		
	            		var to = this.states[output.to];
	            		this.controller.setActionDimensionChange(this.view.divID, this, output.to, output.action, to.width, to.height, to.opacity, output.bubble);
	            	}
		        }
		        
		        if(this.hasCloseDiv){
		        	this.view.updateCloseButtonWidth(this.states[this.activeState].width);
		        	
		        	if(this.activeState === "closed"){
		        		this.view.hideCloseButton();
		        		this.controller.clearActions(this.view.divID + "_close");
		        	} else {
		        		this.view.showCloseButton();
		        		this.controller.setActionDimensionChange(this.view.divID + "_close", this, "closed", "click", false);
		        	}
		        }
            },
            
            addCloseDiv : function() {
            	// Adds a close button div that automatically is added to every "non-closed" state
            	this.view.createCloseButtonDiv();
            	this.hasCloseDiv = true;
            	
            	//
            },
            
            update : function() {
            	// If a pop up's contents has an update function, update it!
            	//utilities.debugOutput("(popup): " + this.contentNames.length);
            	
            	for(var i = 0; i < this.contentNames.length; i++) {
            		//utilities.debugOutput("(popup): contents[" + i + "].update: " + this.contents[this.contentNames[i]].update);
            		if(this.contents[this.contentNames[i]].update !== undefined){
            			this.contents[this.contentNames[i]].update();
            			//utilities.debugOutput("updating in popup");
            		}
            	}
            },
            
            
        });

        return Popup;
    })();

});
