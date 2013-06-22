/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/star"], function(Star) {
    
   
    return (function() {
        var stars = [];
        var starsToAdd = [];

        function generateStars(count) {

            for (var i = 0; i < count; i++) {
                var s = new Star.Star();

                starsToAdd.push(s);
            }
        };

        function update(time) {

            $.each(stars, function(index, star) {
                star.update(time);
            });

            stars = stars.concat(starsToAdd);
            starsToAdd = [];
        };

        generateStars(3);
        update(1);

        return {
            // public interface

            getDrawableObjects : function() {
                return stars;
            },

            update : update,
        };

    })();

});
