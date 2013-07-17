/**
 * @author Stellar
 */

// UParticle-inherited class

define(["inheritance", "modules/models/vector", "modules/models/popup"], function(Tnheritance, Vector, PopupModule) {
    return (function() {

        var Popup = Class.extend({

            init : function() {
				console.log("Init a popup_view!!!");
            },

			createPopupDiv : function(parent, x, y, wid, hei, hoverWid, hoverHei) {
				this.xpos = x;
				this.ypos = y;
				this.defaultWidth = wid;
				this.defaultHeight = hei;
				this.hoverWidth = hoverWid;
				this.hoverHeight = hoverHei;
				this.expanded = false;
				
                this.popupdiv = $('<div/>', {
                    html : "Pop Up<br>",
                    "class" : "popup",
                    top: x,
                    left: y,
                    width: wid,
                    height: hei,
                    // ---------------------------------------------
                    // Control stuff
                    click: function() {
                    	
                    },
                    mousedown: function() {
                    	//console.log("mousedown on popupdiv"); 
                    	$(this).width(hoverWid);
                    	$(this).height(hoverHei);
                    	$(this).css({ opacity: 1 });
                    },
                    mouseleave: function() {
                    	//console.log("mouseleave on popupdiv"); 
                    	$(this).width(wid);
                    	$(this).height(hei);
                    	$(this).css({ opacity: 0 });
                    }

                    // ---------------------------------------------
                });
                
                parent.append(this.popupdiv);

                // add all the buttons
                /*
                $.each(this.tools, function(index, tool) {
                    palette.append(tool.createPaletteButton(palette));

                });*/

            },
            
            
            toggleView : function(){
            	console.log("toggleview on popupdiv"); 
            	if(this.expanded){
            		$(this.popupdiv).width(this.defaultWidth);
            		$(this.popupdiv).height(this.defaultHeight);
            	} else {
            		$(this.popupdiv).width(this.hoverWidth);
            		$(this.popupdiv).height(this.hoverHeight);
            	}
            }
        });

        return Popup;
    })();

});