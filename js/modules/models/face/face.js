/**
 * @author April Grow
 */

// EYE!

define(["inheritance", "modules/models/vector", "modules/models/face/eye"], function(Inheritance, Vector, Eye) {

    var left = {
        name : "left",
        xMult : -1
    };

    var right = {
        name : "right",
        xMult : 1
    };
    var noise;

    // Make the Face class
    var Face = Class.extend({
        init : function(parent) {
            this.parent = parent;
            this.radius = parent.radius;
            this.width = this.radius;
            this.eyeWidth = .6;
            this.eyeHeight = .1;
            this.baseColor = parent.idColor;
            this.leftEye = new Eye(this, "leftEye", left);
            this.rightEye = new Eye(this, "rightEye", right);

        },

        draw : function(g) {
            this.baseColor.fill(g);
            var r = this.parent.radius;
            g.ellipse(0, 0, r, r);
            this.leftEye.draw(g);
            this.rightEye.draw(g);
        },

        update : function(time) {
            if (noise === undefined)
                noise = utilities.pnoise;

            this.leftEye.update(time.total);
            this.rightEye.update(time.total);
        }
    });

    return Face;

});
