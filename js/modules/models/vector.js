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

            bezierWithRelativeControlPoints : function(g, p, c0, c1) {
                g.bezierVertex(p.x + c0.x, p.y + c0.y, x + c1.x, y + c1.y, x, y);
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
