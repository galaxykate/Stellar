/**
 * @author Kate Compton
 */

// Color utility class
//  Create KColors (stored as HSBA [0, 1], so that (.45, .3, 1, .5) would be a half-transparent sky-blue)

define([], function() {
    return (function() {

        // Private functions

        // Make the Vector class
        function KColor(h, s, b, a) {
            this.h = h;
            this.s = s;
            this.b = b;
            if (a !== undefined)
                this.a = a;
            else
                this.a = 1;
        };

        // Add lots of utilty, modification, lerping, etc functions to deal with colors

        KColor.prototype.toString = function() {
            return "hsb: " + this.h.toFixed(2) + " " + this.s.toFixed(2) + " " + this.b.toFixed(2) + " " + this.a.toFixed(2);

        };

        KColor.prototype.constrainToUnit = function(v) {
            return Math.min(Math.max(v, 0), 1);
        };

        KColor.prototype.cloneShade = function(shade, fade) {
            return this.use(function(h, s, b, a) {
                return new KColor(this.h, this.s, this.b, this.a)
            }, shade, fade);
        };

        KColor.prototype.fill = function(g, shade, fade) {
            return this.use(g.fill, shade, fade);
        };

        KColor.prototype.stroke = function(g, shade, fade) {
            return this.use(g.stroke, shade, fade);
        };

        KColor.prototype.background = function(g, shade, fade) {
            return this.use(g.background, shade, fade);
        };

        KColor.prototype.use = function(gFunc, shade, fade) {

            var s1 = this.s;
            var h1 = this.h;
            var b1 = this.b;
            var a1 = this.a;

            if (shade !== undefined) {
                if (shade > 0) {
                    s1 = this.constrainToUnit(s1 - shade * (s1));
                    b1 = this.constrainToUnit(b1 + shade * (1 - b1));
                } else {
                    s1 = this.constrainToUnit(s1 - shade * (1 - s1));
                    b1 = this.constrainToUnit(b1 + shade * (b1));
                }

                h1 = (h1 + -.06 * shade + 1) % 1;
            }

            // Increase (or decrease) the alpha for this
            if (fade !== undefined) {
                if (fade < 0) {
                    a1 = this.constrainToUnit(a1 * (1 + fade));
                } else {
                    a1 = this.constrainToUnit((1 - a1) * fade + a1);
                }
            }

            gFunc(h1, s1, b1, a1);
        };

        return {
            // public interface
            KColor : KColor,
         

        };
    })();

});
