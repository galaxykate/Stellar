/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance"], function(Inheritance) {
    return (function() {
    	var divIDCount = 0;

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

			createPopupDiv : function(x, y, wid, hei, opa) {
				
				//this.removePopupDiv();
				
                this.options = {
                    html : "Pop Up<br>",
                    "class" : "popup",
                    "id" : this.divID,
                    top: x,
                    left: y,
                    width: wid,
                    height: hei,
                    opacity: opa
                };
                
				this.div = $('<div/>', this.options);
				
				this.appendPopupDiv();

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