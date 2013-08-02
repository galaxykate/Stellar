/**
 * @author Stellar
 */

// UParticle-inherited class

define(["modules/models/vector", "uparticle", 'lifespan'], function(Vector, UParticle, Lifespan) {
    return (function() {
    	
    	var startLifespan = function(sparkle){
			
			var sparkleMaxOpacity = sparkle.maxOpacity;
			var duration = (Math.random() * 2) + .5; // duration is in seconds
			
			sparkle.lifespan = new Lifespan(duration);
			
			var lifespanUpdate = function(){
				
				sparkle.opacityOffset = sparkle.lifespan.figuredPctCompleted * (-sparkleMaxOpacity);
				//utilities.debugOutput("updating opacity: " + sparkle.opacityOffset);
			};
			
			var lifespanOnEnd = function(){
				// remove the sparkles... will this crash?!
				sparkle.remove();
			};
			
			sparkle.lifespan.onUpdate(lifespanUpdate);
			sparkle.lifespan.onEnd(lifespanOnEnd);
			sparkle.lifespans.push(sparkle.lifespan);
		};

        var Sparkle = UParticle.extend({

            init : function(universe, parent) {
                this._super(universe);
				this.scale = .7;
				this.baseOpacity = .2;
				this.maxOpacity = 1 + this.baseOpacity;
                this.opacityOffset = 0;
				if(parent !== undefined){
                	this.parent = parent;
                }
				
				this.type = "sparkle";
				
				startLifespan(this);
				
				stellarGame.statistics.numberofSparkles++;
            },

            drawBackground : function(g, options) {
				this.idColor.fill(g, -.8, .5);
                g.noStroke();
                //g.ellipse(0, 0, this.radius, this.radius);

            },

            drawMain : function(g, options) {
				this.idColor.fill(g, .9, 1);
                var t = stellarGame.time.universeTime;
                var radius = this.radius*this.scale;
                g.noStroke();
                var points = 5;
                var starLevels = 2;
                for (var j = 0; j < starLevels; j++) {
                    var jPct = j * 1.0 / (starLevels - 1);
                    //utilities.debugOutput(this.idNumber + " / " + j + ": " + (.2 + jPct));
                    g.fill(.65, (.3 - .3 * jPct), 1, this.baseOpacity + this.opacityOffset + jPct);
                    g.beginShape();
                    g.vertex(0, 0);
                    var pop = 0;
                    var segments = points * 10;
                    for (var i = 0; i < segments + 1; i++) {
                        var theta = i * 2 * Math.PI / segments;

                        var spike = Math.abs(Math.sin(theta * points / 2));
                        spike = 1 - Math.pow(spike, .2);

                        var sparkle = 1.1 * utilities.pnoise(t * 2 + theta + this.idNumber);
                        sparkle = Math.pow(sparkle, 2);

                        var r = .6 * radius * (spike * sparkle);

                        r += 1 + 1.5 * pop;
                        r *= radius * .7 * (1.2 - Math.pow(.7 * jPct, 1));
                        g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    }
                    g.endShape();
                }
            },

            drawOverlay : function(g, options) {

            },

            update : function(time) {
                this._super(time);
                
            }
        });

        return Sparkle;
    })();

});
