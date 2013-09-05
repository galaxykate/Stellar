/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", 'modules/views/popup_view', 'modules/controllers/popup_controller'], function(Inheritance, Vector, PopupView, PopupController) {
    return (function() {

        var Popup = Class.extend({

            init : function(parentString, text) {
				//console.log("Init a popup!!!");
				this.states = [];
				this.transitions = [];
				this.contents = [];
				this.contentNames = [];
				this.view = new PopupView(parentString);
				this.controller = new PopupController();
				this.activeState = null;
				this.view.createPopupDiv(text, 0, 0, 0, 0);
				this.hasCloseDiv = false;
            	
            },
            
            addContents : function(name, goodies) {
            	goodies.setParentDivID(this.view.divID);
            	goodies.parentPopup = this;
            	//console.log("goodies! ");
            	//console.log(goodies);
            	this.contents[name] = goodies;
            	if(this.contentNames.length > 0) this.view.createSpacerSpan();
            	this.contentNames.push(name);
            },
            
            addNullSelectionTool : function() {
            	var popup=this;
            	var nullID = this.view.divID + "_nullSelection";
            	var newCanvas = 
				    $('<canvas/>',{'id':nullID+ "_canvas"})
				    .width(20)
				    .height(20);
				
	            var options = {
	                "class" : "elementCanvasHolder",
	                "id" : nullID,
	
	                // ========= controller stuff ===========
	                mouseup : function() {
	                	popup.setNewSelectedDivID(nullID);
	                },
	            };
	
	            var span = $('<span/>', options);
	            span.append(newCanvas);
	            span.css({
	                opacity : .2
	            });
	
	            var parent = $("#" + this.view.divID);
	            parent.append(span);
				
				var processing = new Processing(nullID + "_canvas", function(g) {
	
	                g.size(30, 30);
	                g.colorMode(g.HSB, 1);
	                
	                
	                g.draw = function() {
	                	g.background(1, 0, .7, .3);
		                g.stroke(1, .7, .5);
		                g.strokeWeight(2);
		                g.noFill();
		                g.ellipse(15, 15, 25, 25);
		                g.line(28, 2, 2, 28);
	                };
	
				});
				this.processing = processing;
				popup.setNewSelectedDivID(nullID);
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
            	
            	if(stellarGame.touch.pressed && this.selectedDivID !== undefined && this.selectedObj !== undefined
            		&& this.selectedObj.placeInUniverseFromInventory !== undefined){
            		utilities.debugOutput("Selected Div " + this.selectedDivID);
            		//console.log(this.selectedFunc);
            		this.selectedObj.placeInUniverseFromInventory();
            	}
            	
            },
            
            flash : function() {
            	//console.log("FLASHY FLASH");
            	this.view.highlightDiv(this.view.divID, this.states[this.activeState].opacity);
            },
            
            setNewSelectedDivID : function(id, obj){
            	if(this.selectedDivID !== undefined){
            		var oldDiv = $("#" + this.selectedDivID);
            		oldDiv.css({
	                    opacity : .2
	                });
            	}
            	var newDiv = $("#" + id);
            	newDiv.css({
                    opacity : 1
                });
                this.selectedDivID = id;
                this.selectedObj = obj;
            },
            
            
        });

        return Popup;
    })();

});
