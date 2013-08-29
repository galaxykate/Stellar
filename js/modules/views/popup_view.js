/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance"], function(Inheritance) {
    return (function() {
    	var divIDCount = 0;
    	
    	var createAndAppendDiv = function(parentID, options){
    		var div = $('<div/>', this.options);
    		appendDiv(parentID, div);
    	};
    	
    	var appendDiv = function(parentID, div){
    		$("#" + parentID).append(div);
    	};
    	
    	var removeDiv = function(parentID, divID){
    		$("#" + parentID).remove("#" + divID);
    	};

        var PopupView = Class.extend({

            init : function(parentString) {
            	this.divID = "popupdiv_" + divIDCount;
            	divIDCount++;
            	
				//console.log("Init a popup_view!!!");
				this.parentStr = parentString;
				// Access parent via $("#universe") er $(this.parentStr)
            },
            
            
            // Do this after all the controls and states have been set
            appendPopupDiv : function() {
            	//console.log(this.div);
            	$(this.parentStr).append(this.div);
            	//console.log("appended div " + this.divID + " to: " + this.parentStr);
            },
            
            removePopupDiv : function() {
            	$(this.parentStr).remove("#" + this.divID);
            	//console.log("removed div " + this.divID + " from: " + this.parentStr);
            },

			createPopupDiv : function(text, x, y, wid, hei, opa) {
				
				//this.removePopupDiv();
				
                this.options = {
                    html : text + "<br>",
                    "class" : "popup",
                    "id" : this.divID,
                    top: y,
                    left: x,
                    width: wid,
                    height: hei,
                    opacity: opa
                };
                
				this.div = $('<div/>', this.options);
				
				this.appendPopupDiv();

           	},
           	
           	createCloseButtonDiv : function() {
           		var div = $("#" + this.divID);
           		//console.log("DIV.WIDTH(): " + div.width());
           		var closeOptions = {
           			html : "X",
                    "class" : "closeButton",
                    "id" : this.divID + "_close",
                    top: 10,
                    left: div.width()-20,
                    width: 20,
                    height: 20,
                    
           		};
           		var closeDiv = $('<div/>', closeOptions);
           		closeDiv.hide(); // Start it out invisible because the updates don't happen by this point
           		
           		div.append(closeDiv);
           		
           	},
           	
           	updateCloseButtonWidth : function(width) {
           		//var headDiv = $("#" + this.divID);
           		var closeDiv = $("#" + this.divID + "_close");
           		
           		//console.log("DIV.WIDTH(): " + headDiv.width());
           		//closeDiv.css('left', headDiv.width()-20 + 'px');
           		closeDiv.css('left', width-20 + 'px');
           	},
           	
           	showCloseButton : function(){
           		var closeDiv = $("#" + this.divID + "_close");
           		closeDiv.show();
           	},
           	
           	hideCloseButton : function() {
           		var closeDiv = $("#" + this.divID + "_close");
           		closeDiv.hide();
           	},
            
            updatePopupDiv : function(x, y, wid, hei, opa) {
            	//console.log("updating div " + this.divID);
            	var div = $("#" + this.divID);
            	
            	div.css('top', x + 'px');
            	div.css('left', y + 'px');
            	div.css('width', wid + 'px');
            	div.css('height', hei + 'px');
            	div.css({ opacity: opa });
            	
            }
        });

        return PopupView;
    })();

});