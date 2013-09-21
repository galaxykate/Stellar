/**
 * @author Kate Compton
 */
define(["inheritance", "modules/models/vector", "modules/models/elementSet", "noise", "kcolor"], function(Inheritance, Vector, ElementSet, Noise, KColor) {
    var TimeSpan = Class.extend({
        init : function(context) {

            // default values
            this.lifespan = 1;
            this.ellapsed = 0;
            // Translate all the context into this
            $.extend(this, context);
        },

        start : function(startTime) {
            this.startTime = startTime;
            this.ellapsed = 0;

            if (this.onStart)
                this.onStart(t);
        },

        increment : function(ellapsed) {
            this.ellapsed += ellapsed;
            if (this.onChange)
                this.onChange(this.ellapsed, this.getPct());

            if (this.ellapsed > this.lifespan)
                this.finish();
        },

        finish : function() {
            console.log("FINISH");
            this.completed = true;

            if (this.onFinish)
                this.onFinish();

        },

        getPct : function() {
            return (this.ellapsed) / this.lifespan;
        },

        drawClock : function(g, center, radius) {
            var pct = this.getPct();
            g.fill(0);
            g.ellipse(center.x, center.y, radius, radius);
            g.fill(1);
            g.arc(center.x, center.y, radius - 1, radius - 1, 0, 2 * pct * Math.PI);
            g.fill(0);
            g.ellipse(center.x, center.y, radius * .2, radius * .2);

        },

        toString : function() {
            return this.ellapsed + "/" + this.lifespan + " = " + this.getPct();
        },
    });
    return TimeSpan;
});
