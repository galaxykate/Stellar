/**
 * @author Kate Compton
 */

// Reusable Vector class

define(["modules/models/elementSet", "kcolor", "inheritance"], function(ElementSet, KColor, Inheritance) {

    var Player = Class.extend({

        // Make the Vector class
        // Create the player (or load from data?)
        init : function() {
            var player = this;
            this.elementBelt = new ElementSet(this);
            this.elementBelt.setCapacity(10);

            this.elementBelt.playerBelt = true;

            // For quest completion tracking

            this.idColor = new KColor(.55, 1, 1);

            $.each(ElementSet.activeElements, function(index, element) {
                //player.elementBelt.quantity.setQuantity(index, player.elementBelt.capacity[index]);
                player.elementBelt.setQuantityToPctCapacity(index, .3);
            });

        },

        setWidget : function(widget) {
            this.widget = widget;
        },

        updateElements : function() {
            this.widget.resetPositions();
        },
    });

    return Player;

});
