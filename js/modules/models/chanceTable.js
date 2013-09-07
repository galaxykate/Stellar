/**
 * @author Kate Compton
 */

// A voronoi region for the universe, good for territory, etc

define(["inheritance"], function(Inheritance) {
    return (function() {

        var ChanceTable = Class.extend({
            init : function() {
                this.options = [];
            },

            addOption : function(option, name, weight) {
                this.options.push({
                    option : option,
                    weight : weight,
                    name : name
                });
                this.recalculate();
            },

            recalculate : function() {
                // Add up all the weights
                var table = this;
                table.totalWeight = 0;
                $.each(this.options, function(index, option) {
                    table.totalWeight += option.weight;
                });
            },

            selectOne : function() {

                var cumWeight = 0;

                var value = Math.floor(Math.random() * this.totalWeight);

                // now find which bucket out random value is in

                for ( i = 0; i < this.options.length; i++) {
                    cumWeight += this.options[i].weight;
                    if (value < cumWeight) {
                        return (this.options[i].option);
                    }
                }
            },
        });
        return ChanceTable;
    })();

});
