/**
 * @author Kate Compton
 */

// Reusable Vector class

define(["modules/models/elements", "modules/models/reactions", "kcolor", "inheritance"], function(Elements, Reactions, KColor, Inheritance) {

    // Drawing function
    var polarVertex = function(g, r, theta) {
        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
    };

    // Draw an arc around some radius: used to show proportion of elements
    var segmentsPerCircle = 50;
    function drawArc(g, innerRadius, outerRadius, startTheta, endTheta) {
        var thetaRange = endTheta - startTheta;
        var segments = Math.ceil(segmentsPerCircle * thetaRange / (2 * Math.PI));
        g.noStroke();
        g.beginShape();
        // Go back and forth around the shape
        for (var i = 0; i < segments + 1; i++) {
            var theta = (i / (segments) * thetaRange + startTheta);
            polarVertex(g, innerRadius, theta);

        }

        for (var i = segments; i >= 0; i--) {
            var theta = (i / (segments) * thetaRange + startTheta);
            polarVertex(g, outerRadius, theta);
        }

        g.endShape();
    };

    var activeElementNames = ["Hydrogen", "Helium", "Carbon", "Oxygen", "Silicon", "Iron", "Gold", "Uranium"];
    var elementsBySymbol = [];
    var activeElements = [];
    // Which elements are actually active in this game?
    // We may not want all of them.

    $.each(activeElementNames, function(index, elementName) {
        var elemData = Elements[elementName];
        var element = {
            name : elementName,
            number : elemData.atomic_number,
            symbol : elemData.symbol,
            index : index,

            idColor : new KColor((index * .12 + .4) % 1, 1, 1),

            toString : function() {
                return this.symbol;
            }
        };
        elementsBySymbol[elemData.symbol] = element;
        activeElements[index] = element;

    });

    var ElementSet = Class.extend({

        // Make the Vector class
        init : function(parent) {

            this.parent = parent;

            this.elementQuantity = [];
            this.elementExcitements = [];
            var max = Math.random() * Math.random() * Math.random() * 5 + 1;

            for (var i = 0; i < activeElements.length; i++) {
                if (i < max) {

                    this.elementQuantity[i] = Math.random() * 300 + 50;
                } else {

                    this.elementQuantity[i] = 0;
                }
                this.elementExcitements[i] = 0;

            }

            //if(this.parent !== undefined) console.log(this.parent.idNumber + " INITIALIZING ELEMENT SET");
            this.setTotalMass();
            //this.parent.updateElements(); // causes errors because this.parent.elements is not set yet!

        },

        fillElements : function(maxElements, startAmt, dieOff) {
            var amt = startAmt;

            for (var i = 0; i < activeElements.length; i++) {
                if (i === 0) {
                    //   this.elementQuantity[i] = 1;
                    // this.elementQuantity[i] = amt;
                }
                amt *= dieOff;
            }
        },

        setCapacity : function(size) {
            this.capacities = [];
            for (var i = 0; i < activeElements.length; i++) {
                this.capacities[i] = size;

            }
        },

        getCapacityPct : function(index) {
            return this.elementQuantity[index] / this.capacities[index];
        },

        setQuantityToPctCapacity : function(index, pct) {
            this.elementQuantity[index] = this.capacities[index] * pct;
            this.changedValue();
        },

        // override
        changedValue : function() {

        },

        //===============================================================
        //===============================================================
        //===============================================================
        // Getters
        getAmtByName : function(name) {
            return this.elementQuantity[activeElements[name].id];
        },
        getPctByName : function(name) {
            return getAmtByName(name) / this.totalMass();
        },

        //===============================================================
        //===============================================================
        //===============================================================
        // Ways to transfer, add, fuse, or remove elements

        // Siphon in ONE random element at a time
        siphon : function(target, volume) {
            for (var i = 0; i < volume; i++) {
                var elem = utilities.getWeightedRandom(target.elementQuantity, function(index, elem) {
                    return index;
                });

                if (elem !== undefined) {
                    var siphonAmt = Math.min(150, target.elementQuantity[elem]);
                    //utilities.debugOutput("Siphoning " + siphonAmt);
                    //console.log(i + "/" + volume+ " Siphoning element " + elem + " amount " + siphonAmt);

                    if (this.playerBelt !== undefined) {
                        var elementName = activeElements[elem].name;
                        if (settings[elementName.toLowerCase() + "Unlocked"] === true) {
                            this.elementQuantity[elem] += siphonAmt;
                            target.elementQuantity[elem] -= siphonAmt
                            stellarGame.qManager.satisfy("Gather " + elementName);
                        }
                    } else {
                        this.elementQuantity[elem] += siphonAmt;
                        target.elementQuantity[elem] -= siphonAmt
                    }
                }

            }

            this.setTotalMass();
            target.setTotalMass();

        },
        transfer : function(target, element, amt) {
            var index = element.index;
            amt = Math.min(this.elementQuantity[index], amt);
            this.elementQuantity[index] -= amt;
            target.elementQuantity[index] += amt;
            this.setTotalMass();
            target.setTotalMass();

        },
        remove : function(element, amt) {
            var index = element.index;
            amt = Math.min(this.elementQuantity[index], amt);
            this.elementQuantity[index] -= amt;
            this.setTotalMass();
            return amt;
        },
        add : function(element, amt) {
            var index = element.index;
            this.elementQuantity[index] += amt;
            this.setTotalMass();
            return amt;
        },

        // Siphon off 1 element by name and percentage
        siphonOneByName : function(target, elementName, pct) {
            var index;
            for (var i = 0; i < activeElements.length; i++) {
                if (activeElements[i].name === elementName) {
                    index = i;
                }

            }

            var siphonAmt = Math.max(1, target.elementQuantity[index] * pct);
            if (target.elementQuantity[index] < siphonAmt)
                siphonAmt = target.elementQuantity[index];
            utilities.debugOutput("Siphoning " + siphonAmt);

            this.elementQuantity[index] += siphonAmt;
            target.elementQuantity[index] -= siphonAmt

            this.setTotalMass();
            target.setTotalMass();

        },
        setQuantity : function(index, volume) {
            this.elementQuantity[index] = volume;

            this.setTotalMass();
        },
        addElement : function(elementName, volume) {
            var index;
            for (var i = 0; i < activeElements.length; i++) {
                if (activeElements[i].name === elementName) {
                    index = i;
                }

            }

            utilities.touchOutput("Add " + elementName + " " + volume);
            this.elementQuantity[index] += volume;
            utilities.touchOutput(" result " + this.elementQuantity[elementName]);

            this.setTotalMass();
        },

        // Transfer a specific amount of elements to the target
        transferAmountsTo : function(target, amounts) {
            for (var i = 0; i < amounts.length; i++) {
                this.elementQuantity[i] -= amounts[i];
                target.elementQuantity[i] += amounts[i];

            }

            this.setTotalMass();
            target.setTotalMass();

        },

        // Transfer some of the elements to the target
        transferTo : function(target, pct) {
            for (var i = 0; i < activeElements.length; i++) {
                var amt = this.elementQuantity[i] * pct;
                this.elementQuantity[i] -= amt;
                target.elementQuantity[i] += amt;

            }
            this.setTotalMass();
            target.setTotalMass();

        },

        // Multiply the elements by some amount
        multiply : function(m) {
            for (var i = 0; i < activeElements.length; i++) {
                this.elementQuantity[i] *= m;

            }
            this.setTotalMass();

        },
        clearAllElements : function() {
            for (var i = 0; i < activeElements.length; i++) {
                this.elementQuantity[i] = 0;
            }

            this.setTotalMass();
        },
        //===============================================================
        //===============================================================
        //===============================================================

        setTotalMass : function() {
            this.totalMass = 0;

            for (var i = 0; i < activeElements.length; i++) {
                this.totalMass += this.elementQuantity[i];
            }
        },
        getElementCount : function() {
            var count = 0;
            for (var i = 0; i < activeElements.length; i++) {
                if (this.elementQuantity[i] > 0)
                    count++;
            }
            return count;
        },

        // Only burns 1 element at a time
        burnSomeFuel : function(temp, time, whoIsCallingMe) {
            var amountToRemove = 0;
            var amountToAdd = 0;
            var elemID = -1;
            this.heatGenerated = 0;
            this.burntElementID = [];
            this.burning = false;
            var t = time.ellapsed + 1;
            var elemSet = this;

            for (var i = 0; i < Reactions.length; i++) {
                //utilities.debugOutput("I'm a reaction! " + Reactions[i].input.minTemp);
                // If we are in the temperature threshold for this reaction
                var reactionSatisfied = false;
                if (temp >= Reactions[i].input.minTemp) {
                    $.each(Reactions[i].input, function(key, value) {
                        if (key !== "minTemp") {
                            elemID = activeElements[key].id;
                            //utilities.debugOutput(elemSet.parent.idNumber + " burn: " + elemID);
                            amountToRemove = tuning.elementBurnAmt * value * t;
                            if (elemSet.elementQuantity[elemID] >= amountToRemove + tuning.elementBurnElementMin) {
                                elemSet.elementQuantity[elemID] -= amountToRemove;
                                //utilities.debugOutput("burning... " + amountToRemove);
                                elemSet.burning = true;
                                elemSet.burntElementID.push(elemID);

                                reactionSatisfied = true;
                            }
                        }
                    });
                }

                if (reactionSatisfied === true) {
                    $.each(Reactions[i].output, function(key, value) {
                        if (key !== "heat") {
                            elemID = activeElements[key].id;
                            //utilities.debugOutput("generate: " + elemID);
                            amountToAdd = tuning.elementBurnAmt * value * t;
                            elemSet.elementQuantity[elemID] += amountToAdd;
                            //utilities.debugOutput("generating... " + amountToAdd);
                        } else {
                            elemSet.heatGenerated += value * tuning.elementBurnTempGenerationScalar;
                        }
                    });
                }
            }

            this.setTotalMass();
        },
        canBurnFuel : function(temp, time) {
            var t = time.ellapsed + 1;
            var elemSet = this;

            for (var i = 0; i < Reactions.length; i++) {
                var reactionSatisfied = false;
                if (temp >= Reactions[i].input.minTemp) {
                    var satisfiedNum = 0;
                    var satisfiedTargetNum = 0;
                    $.each(Reactions[i].input, function(key, value) {
                        if (key !== "minTemp") {
                            satisfiedTargetNum++;
                            elemID = activeElements[key].id;
                            amountToRemove = tuning.elementBurnAmt * value * t;
                            if (elemSet.elementQuantity[elemID] >= amountToRemove + tuning.elementBurnElementMin) {
                                satisfiedNum++;
                            }
                        }
                    });
                    if (satisfiedNum === satisfiedTargetNum)
                        return true;
                }
            }
            return false;

        },

        /* triggers when a supernova occurs
         * densityPerc: The percent of elements, from least dense to most dense. 1 = 100%, sheds some of all elements the star contains
         * 				Provides a hard cut-off point of the other two functions.
         * amtPerc: The percent of the least dense element to toss out. 1 = 100%, sheds all of the that density the star contains
         * amtDegradePerc: The percentage subtracted from amtPerc from each low-dense element to the next higher-dense element.
         * 					0% = all amtPerc is carried over to the next highest element
         *
         * For example: 1, 1, 0: throws all elements of the star off
         * 				1, .5, .5: throws 50% of H, 25% of He, 12.5% of C, etc until the end of the elements list
         * 				.5, .1, .1: throws 10% of H, 9% of He, 8.1% of C, etc until we've gone through HALF of elements the star contains
         */
        calcShedElements : function(densityPerc, amtPerc, amtDegradePerc) {
            var numElementsToShed = Math.floor(densityPerc * (activeElements.length - 1));
            var curAmtPercToShed = amtPerc;
            var amtToShed = [];
            for (var i = 0; i <= numElementsToShed; i++) {
                amtToShed.push(this.elementQuantity[i] * curAmtPercToShed);
                curAmtPercToShed *= amtDegradePerc;
            }
            return amtToShed;
        },

        //===============================================================
        //=========================   drawing   ========================
        //===============================================================

        draw : function(g, radius) {
            var totalRange = 6;
            var innerRadius = radius + 20;
            var endTheta = 0;
            var margin = .2;
            totalRange -= (margin * (this.getElementCount() - 1));
            for (var i = 0; i < activeElements.length; i++) {
                var amt = this.elementQuantity[i];
                if (amt > 0) {
                    //var outerRadius = amt / innerRadius + innerRadius;
                    var outerRadius = innerRadius + 2;
                    var thetaRange = totalRange * amt / this.totalMass;
                    activeElements[i].idColor.fill(g);

                    var startTheta = endTheta;
                    endTheta = startTheta + thetaRange;
                    drawArc(g, innerRadius, outerRadius, startTheta, endTheta);
                    endTheta += margin;
                }
            }
        },

        // radius here is the boundary of the dust cloud
        drawAsDustCloud : function(g, radius) {
            var t = stellarGame.time.universeTime;

            var minRadius = 2;

            for (var i = 0; i < activeElements.length; i++) {// big elements are on top
                //for (var i = activeElements.length - 1; i >= 0; i--) {// big elements are on bottom
                //var amt = this.elementQuantity[i];

                var amt = Math.ceil(Math.log(this.elementQuantity[i]));

                amt = Math.min(amt, 1);
                //var elementRad = activeElements[i].number/10;

                // var elementRad = Math.log(activeElements[i].number);

                var volume = utilities.constrain(this.elementQuantity[i], 0, 10000);
                var elementRad = .05 * volume * Math.pow(1.8, i);
                elementRad = Math.pow(elementRad, .5);
                //var elementRad = Math.sqrt(activeElements[i].number);
                if (elementRad < minRadius)
                    elementRad = minRadius;

                activeElements[i].idColor.fill(g);

                g.noStroke();
                //g.text(Math.floor(this.elementQuantity[i]), 0, 12 * i);

                if (amt > 0) {
                    // very rough scaling parameters, need to find better functions
                    for (var j = 0; j < amt; j++) {
                        var spread = radius * Math.pow(this.totalMass, .4) + 5;
                        var r = spread * .02 * Math.pow(i, .4) + 5;
                        var theta = j + t * (3 * Math.sin(i + j + this.parent.idNumber) - .5) + 10;
                        //      var xloc = 2 * radius * utilities.pnoise(.1 * t + 200 + amt + elementRad + j) - radius;
                        //i* 10;//
                        //     var yloc = 2 * radius * utilities.pnoise(.1 * t + 100 + amt + elementRad + j) - radius;
                        //i* 10;
                        //    g.ellipse(xloc, yloc, elementRad, elementRad)
                        g.ellipse(r * Math.cos(theta), r * Math.sin(theta), elementRad, elementRad)
                    }
                }

            }
        },
        drawAsSlice : function(g, radius, burning) {
            var currentRadius = radius;

            for (var i = 0; i < activeElements.length; i++) {
                var pctElement = this.elementQuantity[i] / this.totalMass;
                var r = pctElement * radius;
                var wiggleR;
                var segments = 25;
                var theta;
                var layers = 2;
                //utilities.debugOutput("Ugh " + $.inArray(i, this.burntElementID));

                activeElements[i].idColor.fill(g);
                /*
                if(burning && $.inArray(i, this.burntElementID) >= 0){
                utilities.debugOutput("drawing squiggle for " + i);
                g.stroke(.1 * i, 1, 1);
                g.strokeWeight(2);
                g.beginShape();
                var t = stellarGame.time.universeTime;

                for (var j = 0; j < layers; j++) {
                for (var k = 0; k < segments; k++) {
                theta = (k * 2 * Math.PI) / segments;
                wiggleR = 2*(1+ utilities.pnoise(theta, t * 2 + j * 100)) + r;
                g.vertex(wiggleR * Math.cos(theta), wiggleR * Math.sin(theta));
                }
                }
                g.endShape(g.CLOSE);
                } else {*/
                //utilities.debugOutput("drawing NO squiggle for " + i);
                g.noStroke();

                g.ellipse(0, 0, currentRadius, currentRadius);
                //}

                currentRadius -= r;

            }
        },

        // ===============================================================
        // ==================== View Stuff ========================
        // ===============================================================

        addAllElementsToADiv : function(parentID, contents) {
            var elementSet = this;
            this.parentIDFromUI = parentID;
            this.contents = contents;

            var parent = $("#" + parentID);
            parent.mouseleave(function() {

                elementSet.varMouseDown = false;
            });
            elementSet.processings = [];
            for (var i = 0; i < activeElements.length; i++) {
                //if(this.elementQuantity[i] > 0){
                this.createSpanForElement(parentID, activeElements[i].symbol, activeElements[i].name, this.elementQuantity[i], i);
                //}
            }
        },

        // Only call once all elements have been added to the parent div!
        updateAllElementsInDiv : function() {

            for (var i = 0; i < activeElements.length; i++) {
                this.updateSpanForElement(activeElements[i].symbol, activeElements[i].name, this.elementQuantity[i], i);
            }
        },
        createSpanForElement : function(parentID, elementID, elementName, elementAmount, i) {
            var elementSet = this;

            var newCanvas = $('<canvas/>', {
                'id' : this.parentIDFromUI + "_" + elementID + "_canvas"
            }).width(20).height(20);
            //console.log(newCanvas);

            var options = {
                //html : elementName + ": " + elementAmount + "<br>",
                //"class" : "element",
                "class" : "elementCanvasHolder",
                "id" : this.parentIDFromUI + "_" + elementID,

                // ========= controller stuff ===========
                mousedown : function() {
                },
                mouseup : function() {
                    elementSet.contents.setNewSelectedDivID(elementSet.parentIDFromUI + "_" + elementID, elementSet);
                    elementSet.siphonElement = elementName;
                    console.log(elementSet.siphonElement);
                },
                mouseleave : function() {
                },
                mouseenter : function() {

                }
            };

            var span = $('<span/>', options);
            span.append(newCanvas);
            span.css({
                opacity : .2
            });

            var parent = $("#" + parentID);
            parent.append(span);

            var processing = new Processing(this.parentIDFromUI + "_" + elementID + "_canvas", function(g) {

                g.size(30, 30);
                g.colorMode(g.HSB, 1);

                g.id = i;
                g.elementAmount = 2;

                g.draw = function() {
                    g.background(1, 0, .7, .3);
                    //g.background(250, 250, 250, .3);
                    g.noStroke();
                    g.fill(.1 * g.id, 1, 1);

                    var element = g.elementAmount;
                    if (elementAmount <= 2) {
                        //console.log("*** " + g.id + ": " + elementAmount);
                        element = 2;
                    }
                    var radius = 4 * Math.log(element);
                    //console.log("rad: " + radius);
                    //utilities.debugOutput("Rad " + elementID + ": " + radius);
                    g.ellipse(15, 15, radius, radius);
                };

            });
            elementSet.processings.push(processing);

        },
        placeInUniverseFromInventory : function() {
            // FIND A TARGET
            //console.log(this);
            utilities.debugOutput("SIPHONING...? " + this.siphonElement);
            stellarGame.touch.activeTool.elements.siphonOneByName(this, this.siphonElement, .01);

        },
        updateSpanForElement : function(elementID, elementName, elementAmount, i) {
            var span = $("#" + this.parentIDFromUI + "_" + elementID);
            //span.html(elementName + ": " + elementAmount + "<br>");
            //utilities.debugOutput(i+ " eS: " + elementAmount);
            this.processings[i].elementAmount = elementAmount;

        },
    });

    ElementSet.activeElements = activeElements;

    ElementSet.getElementBySymbol = function(symbol) {
        var e = elementsBySymbol[symbol];
        if (e === undefined)
            return activeElements[0];
        return e;

    }
    return ElementSet;

});
