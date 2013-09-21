/**
 * @author Kate Compton
 */

define(["inheritance"], function(Inheritance) {

    var InspectionHUD = Class.extend({
        init : function() {
            this.holderDiv = $("#inspection_hud");
            this.titleDiv = $("#inspection_title");
            this.graphDiv = $("#inspection_graph");
            this.detailDiv = $("#inspection_details");
            this.active = false;
            this.holderDiv.hide();
        },

        focusOn : function(obj) {
            this.focus = obj;
            this.active = true;
            this.holderDiv.show();
        },

        unfocus : function() {
            this.focus = undefined;
            this.active = false;
            this.holderDiv.hide();
        },

        update : function() {
            if (this.active) {

                this.titleDiv.html(this.focus.name);
                if (this.focus.getDetailHTML !== undefined)
                    this.detailDiv.html(this.focus.getDetailHTML());
                  
            }
        }
    });

    return InspectionHUD;
});

