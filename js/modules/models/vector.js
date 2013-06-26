/**
 * @author Kate Compton
 */

// Reusable Vector class

define([], function() {
    return (function() {

        // Private functions

        // Make the Vector class
        function Vector(x, y, z) {

            this.x = x;
            this.y = y;

            this.z = 0;
            if (z !== undefined)
                this.z = z;

        }

        // Shared class attributes
        Vector.prototype = {
            addMultiple : function(v, m) {
                this.x += v.x * m;
                this.y += v.y * m;
                this.z += v.z * m;
            },

            addPolar : function(r, theta) {
                this.x += r * Math.sin(theta);
                this.y += r * Math.cos(theta);
            },

            setToPolar : function(r, theta) {
                this.x = r * Math.sin(theta);
                this.y = r * Math.cos(theta);
            },

            setToMultiple : function(v, m) {
                this.x = v.x * m;
                this.y = v.y * m;
                this.z = v.z * m;
            },

            setTo : function(x, y, z) {
                // Just in case this was passed a vector
                if (x.x !== undefined) {
                    this.x = x.x;
                    this.y = x.y;
                    this.z = x.z;

                } else {
                    this.x = x;
                    this.y = y;
                    if (z !== undefined)
                        this.z = z;
                }
            },

            magnitude : function() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            },

            //===========================================================
            //===========================================================
            // Add and sub and mult and div functions

            add : function(v) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;

            },

            sub : function(v) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
            },

            mult : function(m) {
                this.x *= m;
                this.y *= m;
                this.z *= m;
            },

            div : function(m) {
                this.x /= m;
                this.y /= m;
                this.z /= m;
            },

            //===========================================================
            //===========================================================

            // Lerp a vector!
            lerp : function(otherVector, percent) {
                var lerpVect = new Vector(utilities.lerp(this.x, otherVector.x, percent), utilities.lerp(this.y, otherVector.y, percent), utilities.lerp(this.z, otherVector.z, percent));
                return lerpVect;
            },

            //===========================================================
            //===========================================================
            translateTo : function(g) {
                g.translate(this.x, this.y);
            },

            //===========================================================
            //===========================================================

            bezierWithRelativeControlPoints : function(g, p, c0, c1) {
                // "x" and "y" were not defined, so I added "this." in front. Hopefully that's the intended action (April)
                g.bezierVertex(p.x + c0.x, p.y + c0.y, this.x + c1.x, this.y + c1.y, this.x, this.y);
            },
            vertex : function(g) {
                g.vertex(this.x, this.y);
            },
            drawCircle : function(g, radius) {
                g.ellipse(this.x, this.y, radius, radius);
            },
            drawLineTo : function(g, v) {
                g.line(this.x, this.y, v.x, v.y);
            },

            //===========================================================
            //===========================================================

            toString : function() {
                return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
            },
        };

        return {
            // public interface
            Vector : Vector,
            // Star creation

        };
    })();

});
