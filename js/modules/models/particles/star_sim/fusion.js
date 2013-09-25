/**
 * @author Kate Compton
 */
define(["modules/models/elementSet", "uparticle"], function(ElementSet, UParticle) {

    // Indexed by the larger nuclei
    var reactions = {
    };

    var Reaction = Class.extend({
        init : function(inNucleiSymbols, outNucleiSymbols, activationEnergy, energyMultiplier) {
            this.inNuclei = inNucleiSymbols.map(function(symbol) {
                return ElementSet.getElementBySymbol(symbol);
            });
            this.outNuclei = outNucleiSymbols.map(function(symbol) {
                return ElementSet.getElementBySymbol(symbol);
            });
            this.activationEnergy = activationEnergy;
            this.energyMultiplier = energyMultiplier;

            // Add to the reactionList
            var indexSymbol = this.inNuclei[0].symbol;
            if (reactions[indexSymbol] === undefined) {
                reactions[indexSymbol] = [];
            }
            reactions[indexSymbol].push(this);

            this.color = new KColor(((this.inNuclei[0].index + this.inNuclei[1].index) * .23 + .12) % 1, 1, 1);

        },

        toString : function() {
            var inputs = this.inNuclei[0] + "+" + this.inNuclei[1];
            var outputs = this.outNuclei[0];
            for (var i = 1; i < this.outNuclei.length; i++) {
                outputs += "+" + this.outNuclei[i];
            }
            return inputs + " => " + outputs;
        }
    });
    new Reaction(["H", "H"], ["He"], 100, 1.2);
    new Reaction(["He", "He"], ["Be"], 150, 1.2);
    new Reaction(["Be", "He"], ["C"], 250, 1.2);
    new Reaction(["C", "C"], ["O", "He", "He"], 250, 1.2);
    new Reaction(["O", "O"], ["Si", "He"], 250, 1.2);
    new Reaction(["Si", "He"], ["Fe"], 250, .8);

    var Fusion = Class.extend({

        init : function(layers, n0, n1, reaction) {
            var fusion = this;
            this.layers = layers;
            this.reaction = reaction;
            this.n0 = n0;
            this.n1 = n1;

            this.n0.isFusing = true;
            this.n1.isFusing = true;

        },

        cancel : function() {
            this.n0.isFusing = false;
            this.n1.isFusing = false;
        },

        start : function() {
            var fusion = this;
            this.timespan = new TimeSpan({
                lifespan : 2 + Math.random(),
                onFinish : function() {
                    fusion.fuse()
                }
            });
            this.timespan.start(0);
        },

        applyForce : function(time) {
            var p0 = this.n0.position;
            var p1 = this.n1.position;
            var offset = p0.getOffsetTo(p1);
            var d = offset.magnitude();

            var d2 = d - (this.n0.radius + this.n1.radius);
            var strength = -Math.pow(1 - d2, 3);
            this.n0.totalForce.addMultiple(offset, strength / d);
            this.n1.totalForce.addMultiple(offset, -strength / d);
        },

        update : function(time) {
            this.timespan.increment(time.ellapsed);
        },

        fuse : function() {

            var fusion = this;
            var p0 = this.n0.position;
            var p1 = this.n1.position;

            var fusion = this;
            this.n0.remove();
            this.n1.remove();

            var energyOut = fusion.reaction.activationEnergy * fusion.reaction.energyMultiplier;
            $.each(this.reaction.outNuclei, function(index, elementSymbol) {
                var element = ElementSet.getElementBySymbol(elementSymbol);
                var bubble = fusion.layers.addBubble(element);
                bubble.position.setTo(p0.lerp(p1, .4 + index * .2));
                bubble.energy += energyOut / fusion.reaction.outNuclei.length
            });

            this.deleted = true;
        },

        draw : function(g, scale) {
            g.pushMatrix();
            g.scale(scale, scale);
            
         
            var thickness = 1 / scale;
            var p0 = this.n0.position;
            var p1 = this.n1.position;
            var r0 = this.n0.radius + thickness;
            var r1 = this.n1.radius + thickness;

            this.reaction.color.fill(g, -.4, 1);
            g.noStroke();
            g.ellipse(p0.x, p0.y, r0, r0);
            g.ellipse(p1.x, p1.y, r1, r1);

            // Draw a connected blob

            var offset = p0.getOffsetTo(p1);
            var angle = offset.getAngle();
            var d = offset.magnitude();
            var dr = r1 - r0;

            var theta0 = Math.PI / 2 + Math.asin(dr / d);
            theta1 = 2 * Math.PI - theta0;

            var normal0 = Vector.polar(1, theta0 + angle);
            var normal1 = Vector.polar(1, theta1 + angle);

            g.beginShape();
            p0.vertex(g);
            p0.offsetVertex(g, normal0, r0);
            p1.offsetVertex(g, normal0, r1);
            p1.offsetVertex(g, normal1, r1);
            p0.offsetVertex(g, normal1, r0);
            g.endShape();

            var center = p0.lerp(p1, .5);
            this.timespan.drawClock(g, center, 3 / scale);
            // / g.noStroke();

            g.popMatrix();

        },

        toString : function() {
            return "Fusing " + this.n0 + " to " + this.n1;
        }
    });

    Fusion.canFuse = function(n0, n1, distance) {
        var closeEnough = distance < 40;
        var inOrder = n0.element.number >= n1.element.number;
        var bothFree = !n0.isFusing && !n1.isFusing;
        return closeEnough && bothFree;
    };

    Fusion.getReactionFor = function(p0, p1, temp) {
        var elemReactions = reactions[p0.element.symbol];
        if (elemReactions !== undefined) {
            for (var i = 0; i < elemReactions.length; i++) {
                var reaction = elemReactions[i];
                if (reaction.inNuclei[1] === p1.element) {
                    return reaction;
                }
            }

        } else {
        }

        return undefined;
    };

    return Fusion;
});
