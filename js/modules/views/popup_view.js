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
            
            // Function added in uiManager
            highlightDiv : function(divID, finalOpacity){
            	
            	$("#" + divID)
            	.animate({ opacity: ".9" }, 100)
            	.delay(100)
            	.animate({ opacity: finalOpacity }, 100)
            	.delay(100)
            	.animate({ opacity: ".9" }, 100)
            	.delay(100)
            	.animate({ opacity: finalOpacity }, 100);

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

			createPopupDiv : function(text, x, y, wid, hei, opa, useBottom) {
				//console.log("creating div " + this.divID + ", " + x + ", " + y + ", " + wid + ", " + hei + ", " + opa + ", " + useBottom);
				
                this.options = {
                    "class" : "popup",
                    "id" : this.divID,
                };
                if(useBottom === undefined || useBottom === false){
                	this.options.top = y;
                } else {
                	this.options.bottom = y;
                }
                if(x !== undefined) this.options.left = x;
                if(wid !== undefined) this.options.width = wid;
                if(hei !== undefined) this.options.height = hei;
                if(opa !== undefined) this.options.opacity = opa;
                console.log(this.options);
                
				this.div = $('<div/>', this.options);
				//console.log("creativing div " + this.divID + " with text " + text);
				if(text !== "" && text !== undefined){
					//console.log("TEXT SENSED! MAKING TITLE HTML");
					//console.log(text);
					this.titleHTML = text + "<br><br>";
					this.titleDivID = this.divID + "_titleText";
					var titleOptions = {
						"class" : "popupHeading",
						"id" : this.titleDivID,
						html : this.titleHTML
					}
					if(wid !== undefined) titleOptions.width = wid-30; //to make room for close div
					this.titleDiv = $('<div/>', titleOptions);
					this.div.append(this.titleDiv);
				} 
				
				this.appendPopupDiv();

           	},
           	
           	createCloseButtonDiv : function() {
           		var div = $("#" + this.divID);
           		//console.log("DIV.WIDTH(): " + div.width());
           		var closeOptions = {
           			html : "X",
                    "class" : "closeButton",
                    "id" : this.divID + "_close",
                    top: -20, //10
                    left: div.width()-20,
                    width: 20,
                    height: 20,
                    
           		};
           		var closeDiv = $('<div/>', closeOptions);
           		closeDiv.hide(); // Start it out invisible because the updates don't happen by this point
           		
           		div.append(closeDiv);
           		
           	},
           	
           	createSpacerSpan : function() {
           		var div = $("#" + this.divID);
           		
           		var spacerOptions = {
                    "id" : this.divID + "_spacer",
                    //float: "left",
                    width: div.width()-20,
                    height: 150,
                    
           		};
           		var spacerSpan = $('<div/>', spacerOptions);
           		spacerSpan; // Start it out invisible because the updates don't happen by this point
           		
           		div.append(spacerSpan);
           		console.log("Created spacer span");
           		
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
           	
           	hide : function() {
           		$("#" + this.divID).hide();
           	},
           	
           	show : function() {
           		$("#" + this.divID).show();
           	},
            
            updatePopupDiv : function(x, y, wid, hei, opa, useBottom) {
            	console.log("updating div " + this.divID + ", " + x + ", " + y + ", " + wid + ", " + hei + ", " + opa + ", " + useBottom);
            	var div = $("#" + this.divID);
            	
            	if(useBottom === undefined || useBottom === false){
                	div.css('top', y + 'px');
                } else {
                	div.css('bottom', y + 'px');
                }
            	//div.css('top', x + 'px');
            	if(x !== undefined) div.css('left', x + 'px');
                if(wid !== undefined) div.css('width', wid + 'px');
                if(hei !== undefined) div.css('height', hei + 'px');
                if(opa !== undefined) div.css({ opacity: opa });
                
                if(this.titleHTML !== undefined && this.titleHTML !== ""){
					var titleDiv = $("#" + this.titleDivID);
					if(wid !== undefined) titleDiv.css('width', (wid-50) + 'px'); //to make room for close div
				} 
				if(this.regularHTML !== undefined && this.regularHTML !== ""){
					var regularDiv = $("#" + this.regularDivID);
					if(wid !== undefined) regularDiv.css('width', (wid-50) + 'px'); //to make room for close div
				} 
				
            },
            
            setZIndex : function(z) {
            	//console.log("updating div " + this.divID);
            	var div = $("#" + this.divID);
            	div.css('z-index', z);
            },
            
            setBGColor : function(r, g, b, a){
            	var div = $("#" + this.divID);
            	div.css("background-color", "rgba(" + r +","+ g +","+ b +","+ a + ")");
            },
            
            setRegularHTML : function(text, keepTitle){
            	if(this.regularHTML){
            		// change what's already here
            		//console.log("updating regularHTML " + this.divID + " with text " + text);
            		var regularDiv = $("#" + this.regularDivID);
            		this.regularHTML = text;
					regularDiv.html(text);
            	} else {
            		// Make new variables and div
            		//console.log("making new regularHTML " + this.divID + " with text " + text);
            		this.regularHTML = text;
					this.regularDivID = this.divID + "_regularText";
					var regularOptions = {
						"class" : "popupText",
						"id" : this.regularDivID,
						html : this.regularHTML
					}
					this.regularDiv = $('<div/>', regularOptions);
					var div = $("#" + this.divID);
					this.div.append(this.regularDiv);
            	}
            },
            
            addClass : function(c){
            	var div = $("#" + this.divID);
            	if(div.hasClass(c) === false){
            		div.addClass(c);
            	}
            },
            
            removeClass : function(c){
            	var div = $("#" + this.divID);
            	if(div.hasClass(c) === true){
	            	div.removeClass(c);
            	}
            },
            //$.fn.animateHighlight = function(highlightColor, duration) {
            animateHighlight : function(highlightColor, duration) {
			    var highlightBg = highlightColor || "#FFFF9C";
			    var animateMs = duration || 1500;
			    var originalBg = this.css("backgroundColor");
			    this.stop().css("background-color", highlightBg).animate({backgroundColor: originalBg}, animateMs);
			}
            
        });

        return PopupView;
    })();

});