/**
 * @author Kate Compton
 */

define(["modules/models/elementSet", "inheritance"], function(ElementSet, inheritance) {

    // Create a widget to control the elements in your inventory
    var ElementsWidget = Class.extend({
        init : function(div) {
            div.html("HELLO WIDGET");
        }
    });
    
    return ElementsWidget;
});

