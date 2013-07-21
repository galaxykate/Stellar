/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector"], function(Inheritance, Vector) {
    return (function() {
    	
    	var states = [{
            name : "default",
            idNumber : 0,
            x : 0,
            y : 0,
            width: 10,
            height: 10
        }];

        var Popup = Class.extend({

            init : function() {
				console.log("Init a popup!!!");
				this.states = [];
            },
            
            addState : function(name, x, y, width, height) {
            	var state = {
            		"name": name,
            		idNumber: this.states.length,
            		"x": x,
            		"y": y,
            		"width": width,
            		"height": height
            	};
            	
            	this.states[name].push(state);
            },
            
            setState : function(name) {
            	this.activeState = states[name];
            }
            
        });

        return Popup;
    })();

});
