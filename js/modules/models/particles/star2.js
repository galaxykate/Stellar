/**
 * @author Kate Compton
 */

// Its the Universe!

define(["modules/models/face/face", "modules/models/particles/star_sim/star_layers", "uparticle"], function(Face, StarLayers, UParticle) {
    var chandrasekharLimit = 20;
    var Star = UParticle.extend({

        init : function(universe) {

            this._super(universe);
            this.minLOD = 3;

            this.initAsTouchable();
            this.initAsParticle();

            this.name = UParticle.generateName() + "dfasdkjafk";
            this.radius = 50;
            this.excitement = {
                power : 0,
                dieoff : .3,
                animationTime : 0,
            };

            // What is a star made of?  an inner core and outer layers
            // OR lots of little bubbles representing elements, drifting up and down and heating up or cooling
            //

        },

        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Drawing

        drawBackground : function(context) {
            this._super(context);
            var g = context.g;
            g.fill(1, 0, 1, .2);
            g.ellipse(0, 0, 15, 15);
        },

        drawFocus : function(context) {
            var g = context.g;
            this.focusScale = context.distanceScale;

            if (this.inFocus && this.layers) {
                this.layers.draw(context.g);
            }
        },

        drawMain : function(context) {

            this._super(context);
            var g = context.g;

            if (context.LOD.index < 1) {
                if (this.face === undefined)
                    this.face = new Face(this);

                //  this.face.draw(g);

            }

        },

        drawOverlay : function(context) {
            this._super(context);
            var g = context.g;

        },

        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Interactions

        excite : function(maxPower) {
            this.excitement.power = Math.max(maxPower, this.excitement.power);
        },

        feed : function(element, amt) {
            console.log("Feed " + element.name + " " + amt);

            this.layers.addBubble(element);
        },

        focusOn : function() {
            this._super();
        },

        unfocus : function() {
            this._super();
        },
        //==========================================================================
        //==========================================================================
        //==========================================================================
        //==========================================================================
        // Updating

        showLayers : function() {

        },

        hideLayers : function() {

        },

        updateSimulation : function(time) {

            var last = this.excitement.power;
            this.excitement.power *= Math.pow(this.excitement.dieoff, time.ellapsed);
            this.excitement.animationTime += this.excitement.power * time.ellapsed;

            if (this.inFocus) {
                if (this.layers === undefined)
                    this.layers = new StarLayers(this);

                this.layers.updateSimulation(time);
            }

            if (this.face)
                this.face.update(time);
        },

        getDetailHTML : function() {
            var s = "";
            if (this.layers) {
                s += "Mass: " + this.layers.mass.toFixed(2) + "<br>";
                s += "Radius: " + this.layers.radius.toFixed(2) + "<br>";
                s += "ScreenRadius: " + this.layers.screenRadius.toFixed(2) + "<br>";
                s += "FusionJuice: " + this.layers.fusionJuice.toFixed(2) + "<br>";
                s += "Burn Rate: " + this.layers.burnRate.toFixed(2) + "<br>";
                s += "Luminosity: " + this.layers.luminosity.toFixed(2) + "<br>";
                s += "Chandrasekhar limit?: " + Math.round(100 * this.layers.mass / chandrasekharLimit) + "%<br>";
            }
            return s;
        }
    });

    return Star;

});
