/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "noise", "kcolor"], function(Inheritance, Vector, ElementSet, Noise, KColor) {
    return (function() {

        var endSyllables = "eum eia ia on a ius us is ux un eus os ium o or um ens oo ui ii".split(" ");
        var midSyllables = "alph asp oph eon oly er aph azz elt ynst aev ym ian atz ers yll ial iar yllb idr ats id ann ezz anth arthr erc isth uk isgr ell az arz oon arkh ic aeon ettr urth ythr ogg ast ol elz yt or em in orn yrr ysm ystr agn eops ad umb eal aur apr ael icr et elt erg iot ec ulp eg ers ict isc app ups il on av icr ert osc ydr usc yr".split(" ");

        var startSyllables = "Xer Stryl Micr Luc Koch Hel Gall Laev Liall Ros Hyb Ith Idri Vald Ter Zen Thal Thund Shor Kur Rem Nym Hyum Melm Kuk Xen Mal Saur Vekt Vhil Tran Zar Zil Ur Zyrg Thral Torm Orth Bel Zag Chth Cyt Deuc Dos Gur Hydr Khar Lag Iag Lith Lum Lun Om Prysm".split(" ");

        var generateName = function(maxCharacters) {
            if (maxCharacters === undefined)
                maxCharacters = 10;
            var finishedName = undefined;
            while (finishedName === undefined) {
                var name = utilities.getRandom(startSyllables);
                if (Math.random() > .4) {
                    name = utilities.getRandom(midSyllables);
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }
                var syllCount = Math.floor(Math.random() * 5);
                for (var i = 0; i < syllCount; i++) {
                    name += utilities.getRandom(midSyllables);
                }
                name += utilities.getRandom(endSyllables);

                if (name.length < maxCharacters)
                    finishedName = name;
            }
            return name;

        };

        for (var i = 0; i < 50; i++) {
            console.log(generateName(6 + Math.random() * 9));
        }

        var noise = new Noise();

        // Private functions
        var particleCount = 0;

        // Make the star class
        var UParticle = Class.extend({
            init : function() {
                this.idNumber = particleCount;
                this.name = "Anon particle " + this.idNumber;
                particleCount++;
                this.idColor = new KColor((this.idNumber * .289 + .31) % 1, 1, 1);
                this.age = {
                    birth : stellarGame.time.universeTime,
                };

                this.setRadius(10);

                this.initAsParticle();

                this.position.setToPolar(Math.random() * 200 + 100, Math.random() * 100);

                // this.velocity.addPolar(Math.random() * .3, Math.random() * 100);

                this.initAsTouchable();
                this.debugOutputLines = [];

                // For ranges of surface temperatuers, visit https://en.wikipedia.org/wiki/Stellar_classification

                this.temperature = 0;
                // Kelvin
                this.tempGenerated = 100;
                // Kelvin

                this.lifespans = [];
            },

            setRadius : function(r) {
                this.radius = r;
            },

            initialUpdate : function() {

            },

            remove : function() {
                // only run delete code ONCE.
                if (this.deleted === undefined || this.deleted === false) {
                    this.deleted = true;

                    // update the parents holding this object
                    if (this.parent !== undefined) {
                        this.parent.handleDeleteOf(this);
                        console.log("I AM DELETED");
                    }
                }
            },

            debugOutput : function(d) {

                this.debugOutputLines.push(d);

            },
            clearDebugOutput : function() {
                this.debugOutputLines = [];
            },

            setTarget : function(target) {
                this.target = target;
            },

            //===============================================================
            // Update this particle according to physics
            beginUpdate : function(time) {
                this.totalForce.mult(0);

            },

            addForces : function(time) {

                // Adding a noise force
                var noiseScale = .0040;
                var nx = this.position.x * noiseScale;
                var ny = this.position.y * noiseScale;
                var t = time.total * .03;
                var theta = 20 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = this.mass * 60;

                if (this.target) {
                    var targetOffset = Vector.sub(this.position, this.target);
                    console.log(targetOffset);
                    if (targetOffset.magnitude() < 10)
                        this.target = undefined;
                    this.totalForce.addMultiple(targetOffset, -10);
                }

                //       this.totalForce.addPolar(r, theta);
            },

            updatePosition : function(time) {
                var t = time.ellapsed;
                this.velocity.addMultiple(this.totalForce, t);
                this.position.addMultiple(this.velocity, t);
            },

            finishUpdate : function(time) {
                this.velocity.mult(this.drag);
                this.update(time);
            },

            update : function(time) {
                // Clear the output
                var t = time.ellapsed;
                if (this.lastUpdate === undefined) {
                    this.lastUpdate = 0;
                    this.initialUpdate();
                }

                this.clearDebugOutput();

                var d = this.position.magnitude();

                if (d === 0 || d === NaN)
                    d = .001;

                var outside = Math.max(0, d - 200);
                var gravity = -Math.pow(outside, 2) / d;
                // this.totalForce.setToMultiple(this.position, gravity);

                var noiseScale = .0040;
                var nx = this.position.x * noiseScale;
                var ny = this.position.y * noiseScale;
                var t = time.total * .1;
                var ellapsed = time.ellapsed;
                var theta = 16 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                var r = 190;
                // this.totalForce.addPolar(r, theta);

                this.velocity.addMultiple(this.totalForce, ellapsed);
                this.position.addMultiple(this.velocity, ellapsed);
                this.velocity.mult(this.drag);

                //DEBUG CHECKING
                if (this.DEBUGPOSITION) {
                    utilities.debugOutput(this.idNumber + "pos: " + this.position);
                }
                if (this.DEBUGVELOCITY) {
                    utilities.debugOutput(this.idNumber + "vel: " + this.velocity);

                }

                if (this.elements !== undefined) {
                    this.updateElements();
                }

                for (var i = 0; i < this.lifespans.length; i++) {
                    this.lifespans[i].update();
                }

            },

            // Give this object a bunch of elements
            initAsElementContainer : function() {
                this.elements = new ElementSet(this);

            },

            updateElements : function() {
                // Do something with the new element amounts
                //this.elements.setTotalMass(); // this is set by elements.siphon()

                if (this.elements.totalMass === 0) {
                    this.remove();
                    // removal of this happence twice for some reason. Not sure why!
                    //console.log("CALLING THIS.REMOVE");
                }

            },

            initAsParticle : function() {
                this.position = new Vector(0, 0);
                this.velocity = new Vector(0, 0);
                this.forces = [];
                this.totalForce = new Vector(0, 0);
                this.mass = 1;
                this.drag = .93;
            },

            initAsTouchable : function() {
                this.touchable = true;
                this.touchHeld = false;

            },

            touchStart : function(touch) {
                this.touchHeld = true;
            },
            touchEnd : function(touch) {
                this.touchHeld = false;
            },

            drawBackground : function(g, options) {

            },

            drawMain : function(g, options) {

                this.idColor.fill(g);
                g.noStroke();
                if (this.deleted) {
                    g.fill(.2, 0, .4);
                    g.stroke(1, 0, 1, .7);
                }

                g.ellipse(0, 0, this.radius, this.radius);

            },
            drawOverlay : function(g, options) {
                //var h = (this.idNumber * .212 + .3) % 1;
                if (this.touchHeld) {

                    this.idColor.stroke(g, .2, 1);
                    g.noFill();
                    g.strokeWeight(5);
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);
                }

                if (stellarGame.drawElements && this.elements) {
                    this.elements.draw(g, this.radius);
                }

                // Draw the text
                if (stellarGame.options.showText) {
                    this.idColor.fill(g);
                    this.idColor.stroke(g, 1, 1);
                    var textX = this.radius * .85 + 5;
                    var textY = this.radius * .74 + 5;

                    g.text(this.idNumber, textX, textY);
                    $.each(this.debugOutputLines, function(index, line) {
                        g.text(line, textX, textY + 12 * (index + 1));
                    })
                }
            },
            draw : function(g, options) {

                switch(options.layer) {
                    case "bg":
                        this.drawBackground(g, options);
                        break;

                    case "main":
                        this.drawMain(g, options);

                        break;

                    case "overlay":
                        this.drawOverlay(g, options);
                        break;

                }
            },

            //======================================================================
            //======================================================================
            //======================================================================
            // Drawing styles
            drawAsDot : function(g) {
                g.noStroke();
                var starLevels = 2;
                for ( j = 0; j < starLevels; j++) {

                    var jPct = j * 1.0 / (starLevels - 1);
                    this.idColor.fill(g, jPct * .8, jPct - .6);
                    var r = (1 - .8 * jPct) * this.radius;
                    g.ellipse(0, 0, r, r);
                }

            },
            drawAsBlinkenStar : function(g, segmentDetail, useNoise, useTriangle) {
                var i, j;
                var t = stellarGame.time.universeTime;
                var radius = this.radius * .4;
                g.noStroke();
                var points = 5;
                var spikiness = .5;
                var starLevels = 2;
                for ( j = 0; j < starLevels; j++) {
                    var jPct = j * 1.0 / (starLevels - 1);

                    g.beginShape();

                    var pop = 0;
                    var segments = points * segmentDetail;
                    g.fill(.065, (0.4 - 0.4 * jPct), 1, 0.2 + jPct);
                    for ( i = 0; i < segments + 1; i++) {
                        var theta = i * 2 * Math.PI / segments;

                        var spike = Math.abs(Math.sin(theta * points / 2));
                        spike = 1 - Math.pow(spike, .2);

                        var sparkle = .5;
                        if (useNoise)
                            sparkle = spikiness * utilities.pnoise(t * 2 + theta + this.idNumber) + .1;
                        sparkle = Math.pow(sparkle, 2);

                        var r = .3 * radius * (spike * sparkle);

                        r += .4 + 1.5 * pop;
                        r *= radius * .7 * (1.2 - Math.pow(.7 * jPct, 1));
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                    g.endShape();
                }
            },
            toString : function() {
                return "p" + this.idNumber + this.position;
            },
        });

        UParticle.generateName = generateName;
        return UParticle;
    })();

});
