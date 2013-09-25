/**
 * @author Kate Compton
 */

// Its the Universe!

define(["inheritance", "modules/models/vector", "modules/models/elementSet", "noise", "kcolor"], function(Inheritance, Vector, ElementSet, Noise, KColor) {
    return (function() {

        var endSyllables = "eum eia ia on a an ius us is ux un eus os ium o or i aa um ea ens oo ui ii".split(" ");
        var midSyllables = "urv osh alph ongr asp ab alk aiz oph ij enj ik iy eon ectr oly er aph ion ian ank azz ill all iall elt apr el ynst udm aev ym ian atz ers yll ial iar yllb idr ats id ann ezz anth arthr erc isth uk isgr ell az arz oon arkh ic aeon ettr urth ythr ogg ast ol elz yt or em in orn yrr ysm ystr agn eops ad umb eal aur apr ael icr et elt erg iot ec ulp eg ers ict isc app ups il on av icr ert osc ydr usc yr".split(" ");

        var startSyllables = "Xer Stryl Jin Micr Zib Xilb Brian Cher Vict Laur Ryl Franc Cyd Lur Xerx Lian Prisc Thel Cygn Jez Phyr Pryn Thal Xeb Zekr Sess Cec Kyrs Ver Phil Theoph Thur Luc Koch Hel Lectr Gall Laev Kat Xanth Chris Liall Ros Hyb Ith Idri Vald Ter Zen Thal Thund Shor Kur Rem Nym Hyum Melm Kuk Xen Mal Saur Vekt Vhil Tran Zar Zil Ur Zyrg Thral Torm Orth Bel Zag Chth Cyt Deuc Dos Gur Hydr Khar Lag Iag Lith Lum Lun Om Prysm".split(" ");

        var generateName = function(maxCharacters) {
            if (maxCharacters === undefined)
                maxCharacters = 10 + Math.random() * 5;
            var finishedName = undefined;
            while (finishedName === undefined) {
                var name = utilities.getRandom(startSyllables);
                if (Math.random() > .4) {
                    name = utilities.getRandom(midSyllables);
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }
                var syllCount = Math.floor(Math.random() * Math.random() * 5);
                for (var i = 0; i < syllCount; i++) {

                    var syl = utilities.getRandom(midSyllables);
                    name += syl;
                    if (syl.length * syl.length * Math.random() < 1)
                        name += syl;

                }
                name += utilities.getRandom(endSyllables);

                if (name.length < maxCharacters)
                    finishedName = name;
            }
            return name;

        };

        for (var i = 0; i < 50; i++) {
            //  console.log(generateName(6 + Math.random() * 25));
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

                this.debugOutputLines = [];

                this.lifespans = [];
                this.excitement = {
                    power : 0,
                    dieoff : .9,
                };
                

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

            select : function() {
                this.selected = true;
            },

            deselect : function() {
                this.selected = false;
            },

            debugOutput : function(d) {

                this.debugOutputLines.push(d);

            },
            clearDebugOutput : function() {
                this.debugOutputLines = [];
            },

            pinTo : function(pinnedTo) {
                this.pinnedTo = pinnedTo;
            },

            setTarget : function(target) {

                this.target = target;
            },

            //===============================================================
            //
            focusOn : function() {
                this.inFocus = true;
            },

            unfocus : function() {
                this.inFocus = false;
            },
            //===============================================================
            // Update this particle according to physics
            beginUpdate : function(time) {

                // Clear the output
                this.clearDebugOutput();

                // Has this particle been updated in a while?
                var t = time.ellapsed;
                if (this.lastUpdate === undefined) {
                    this.lastUpdate = 0;
                    this.initialUpdate();
                }

                this.totalForce.mult(0);

            },

            addForces : function(time) {

                if (stellarGame.options.randomMovement) {
                    // Adding a noise force
                    var noiseScale = .0040;
                    var nx = this.position.x * noiseScale;
                    var ny = this.position.y * noiseScale;
                    var t = time.total * .02;
                    var theta = 20 * noise.noise2D(nx + t + this.idNumber * 39, ny + t);
                    var r = this.mass * 60 + (1 + 1 * Math.sin(this.idNumber));

                    this.totalForce.addPolar(r, theta);
                }

                if (this.target) {
                    var targetOffset = Vector.sub(this.position, this.target.position);
                    var d = targetOffset.magnitude();
                    if (d < 15) {
                        // this.position.setTo(this.target.position);
                        this.target.onHit();
                        this.velocity.mult(.20);
                        this.target = undefined;
                    } else {
                        var d2 = Math.min(d, 200 * time.ellapsed);
                        this.totalForce.addMultiple(targetOffset, -50);
                        this.velocity.mult(.80);

                        targetOffset.normalize();
                        this.position.addMultiple(targetOffset, -d2);
                    }
                }
            },

            updatePosition : function(time) {
                var t = time.ellapsed;

                this.velocity.addMultiple(this.totalForce, t / this.mass);
                if (this.maxVelocity) {
                    var speed = this.velocity.magnitude();
                    var speed2 = Math.min(speed, this.maxVelocity);
                    if (speed !== speed2 && speed !== 0) {
                        this.velocity.mult(speed2 / speed);

                    }
                }

                this.position.addMultiple(this.velocity, t);
                this.velocity.mult(this.drag);
                if (this.pinnedTo) {
                    this.position.setTo(this.pinnedTo);
                }

            },

            finishUpdate : function(time) {

            },

            cleanup : function(time) {

                //DEBUG CHECKING
                if (this.DEBUGPOSITION) {
                    utilities.debugOutput(this.idNumber + "pos: " + this.position);
                }
                if (this.DEBUGVELOCITY) {
                    utilities.debugOutput(this.idNumber + "vel: " + this.velocity);

                }

                for (var i = 0; i < this.lifespans.length; i++) {
                    this.lifespans[i].update();
                }

                // Remove this if the elements have bottomed out
                if (this.elements && this.elements.totalMass === 0) {
                    this.remove();
                }

            },

            // Give this object a bunch of elements
            initAsElementContainer : function() {
                //console.log(this.idNumber + " initAsElementContainer");
                this.elements = new ElementSet(this);

            },

            initAsParticle : function() {
                this.position = new Vector(0, 0);
                this.velocity = new Vector(0, 0);

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

            //===============================================================
            // Update this particle according to physics
            drawFocus : function(context) {

            },

            drawBackground : function(context) {

            },

            drawMain : function(context) {

            },
            drawOverlay : function(context) {
                var g = context.g;
                //var h = (this.idNumber * .212 + .3) % 1;
                if (this.touchHeld) {
                    this.idColor.stroke(g, .2, 1);
                    g.noFill();
                    g.strokeWeight(5);
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);
                }

                if (this.selected && !this.inFocus) {
                    this.idColor.stroke(g, .2, 1);
                    g.noFill();
                    g.strokeWeight(5);
                    g.ellipse(0, 0, this.radius + 10, this.radius + 10);
                }

                // Draw the text
                if (stellarGame.options.showText) {
                    this.idColor.fill(g);
                    this.idColor.stroke(g, 1, 1);
                    var textX = this.radius * .85 + 5;
                    var textY = this.radius * .74 + 5;

                    //g.text(this.idNumber, textX, textY);
                    $.each(this.debugOutputLines, function(index, line) {
                        g.text(line, textX, textY + 12 * (index + 1));
                    })
                }
            },
            draw : function(context) {

                switch(context.layer) {
                    case "bg":
                        this.drawBackground(context);
                        break;

                    case "main":
                        this.drawMain(context);

                        break;

                    case "overlay":
                        this.drawOverlay(context);
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

            drawBlinkenStar : function(g, color, innerRadius, range, extension, t) {
                var points = 5;
                var spikiness = .5;
                var starLevels = 2;
                var segmentDetail = 3;

                g.beginShape();

                var segments = points * segmentDetail;

                color.fill(g);
                for ( i = 0; i < segments + 1; i++) {
                    var theta = i * 2 * Math.PI / segments;

                    var spike = Math.abs(Math.sin(theta * points / 2));
                    spike = 1 - Math.pow(spike, .2);

                    var sparkle = .5;
                    sparkle = spikiness * utilities.pnoise(t * 2 + theta + this.idNumber) + .1;
                    sparkle = Math.pow(sparkle, 2);

                    var r = range * (spike * sparkle);

                    r *= .7 * (1.2 - Math.pow(.7 * extension, 1));
                    r += innerRadius;
                    g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                }
                g.endShape();

            },

            drawAsBlinkenStar : function(g, hue, saturation, innerRadius, range, t) {
                var i, j;

                var useNoise = true;
                g.noStroke();
                for (var i = 0; i < 2; i++) {
                 var color = new KColor(hue, saturation - i, 1, 1);
                   this.drawBlinkenStar(g, color, innerRadius*(1 - i*.2), range*(1 - i*.8), 0, t);
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
