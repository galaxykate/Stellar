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
                this.onFinish(ellapsed);

        },

        getPct : function() {
            return (this.ellapsed) / this.lifespan;
        },

        toString : function() {
            return this.ellapsed + "/" + this.lifespan + " = " + this.getPct();
        },
    });
    return TimeSpan;
});
