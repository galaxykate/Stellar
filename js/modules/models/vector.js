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

                this.x = x;
                this.y = y;
                if (z !== undefined)
                    this.z = z;
            },

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
