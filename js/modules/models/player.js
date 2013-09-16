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
            this.elementBelt = {
                capacity : ElementSet.createElementCapacities(1000),
                quantity : new ElementSet(this),
            };

            this.idColor = new KColor(.55, 1, 1);

            $.each(ElementSet.activeElements, function(index, element) {
                player.elementBelt.quantity.setQuantity(index, player.elementBelt.capacity[index]);
            });

        },
    });

    return Player;

});
