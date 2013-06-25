/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/star", "modules/models/vector", "modules/models/kcolor"], function(Star, Vector, KColor) {

    return (function() {

        var backgroundStars = [];
        var backgroundLayers = 3;
        var backgroundStarDensity = 10;
        var cameraCenter = new Vector.Vector(0, 0, 0);
        var gestureDir = new Vector.Vector(0, 0, 0);

        var stars = [];
        var starsToAdd = [];

        function makeBackgroundStars() {

            for (var i = 0; i < backgroundLayers; i++) {
                backgroundStars[i] = [];
                var starCount = backgroundStarDensity * (backgroundLayers - i);
                for (var j = 0; j < starCount; j++) {
                    var color = new KColor.KColor(Math.random(), 1, 1);
                    backgroundStars[i][j] = [Math.random() * 800, Math.random() * 800, Math.random() * .2, Math.random() * 10 + 2, color];
                }
            }
            console.log("made background stars");
        };

        function drawBackgroundStars(g) {
            var cameraPosition
            g.noStroke();
            for (var i = 0; i < backgroundLayers; i++) {

                for (var j = 0; j < backgroundStars[i].length; j++) {

                    var x = backgroundStars[i][j][0];
                    var y = backgroundStars[i][j][1];
                    var r = backgroundStars[i][j][3];
                    var color = backgroundStars[i][j][4];

                    // Offset the position
                    var z = i + 5 + backgroundStars[i][j][2];
                    r *= .2 * i * Math.pow(z, .5);
                    x -= cameraCenter.x * (z + .01);
                    y -= cameraCenter.y * (z + .01);

                    // loop around the edges
                    x = (x % g.width);
                    y = (y % g.height);
                    if (x < 0)
                        x += g.width;
                    if (y < 0)
                        y += g.height;
                    x -= g.width / 2;
                    y -= g.height / 2;

                    //  g.fill(.1 + .32 * i, .5, 1, .3);
color.fill(g, 0, -.8);
                    g.ellipse(x, y, r, r);
                    g.fill(1, 0, 1);
                    g.ellipse(x, y, r * .1 + 1, r * .1 + 1);

                }
            }

            g.fill(1, 0, 1, .3);

        };

        // Draw the universes background
        // May be camera-dependent, eventually
        function draw(g, options) {

            if (options.layer === 'bg') {
                drawBackgroundStars(g);
            }
        }

        function generateStars(count) {

            for (var i = 0; i < count; i++) {
                var s = new Star.Star(this);

                starsToAdd.push(s);
            }
        };

        function update(time) {
            var theta = 10 * Math.sin(.01 * time.total);
            if (time.total > .1) {

                // cameraCenter.x += 1 * Math.cos(theta);
                //cameraCenter.y += 1 * Math.sin(theta);

                cameraCenter.addMultiple(gestureDir, .1);
                gestureDir.mult(.99);
            }

            stellarGame.time = time;

            $.each(stars, function(index, star) {
                star.update(time);
            });

            stars = stars.concat(starsToAdd);
            starsToAdd = [];
        };

        function gestureUpdate(gesture) {
            if (gesture.dragOffset !== undefined) {
                gestureDir.x += gesture.dragOffset[0] * .01;
                gestureDir.y += gesture.dragOffset[1] * .01;

            }
        };

        makeBackgroundStars();

        generateStars(4);
        update(1);

        return {
            // public interface

            getDrawableObjects : function() {
                return stars.concat([this]);
            },
            draw : draw,
            gestureUpdate : gestureUpdate,
            update : update,
        };

    })();

});
