/**
 * @author Kate Compton
 */

var settings = {
	
	init : function(){
		// debug
		//settings.unlockAll();
		settings.tutorialSettings();
	},

    unlockAll : function() {
    	settings.setHydrogenUnlocked(true);
    	settings.setHeliumUnlocked(true);
    	settings.setCarbonUnlocked(true);
    	settings.setOxygenUnlocked(true);
    	settings.setSiliconUnlocked(true);
    	settings.setIronUnlocked(true);
    	settings.setGoldUnlocked(true);
    	settings.setUraniumUnlocked(true);
    	settings.setPlayerElementCapacity(100);
    	settings.setMoveZoomToolUnlocked(true);
    	settings.setSiphoningFromDustUnlocked(true);
    	settings.setTempToolUnlocked(true);
    	settings.setDensityToolUnlocked(true);
    },
    
    tutorialSettings : function(){
    	settings.setHydrogenUnlocked(true);
    	settings.setHeliumUnlocked(false);
    	settings.setCarbonUnlocked(false);
    	settings.setOxygenUnlocked(false);
    	settings.setSiliconUnlocked(false);
    	settings.setIronUnlocked(false);
    	settings.setGoldUnlocked(false);
    	settings.setUraniumUnlocked(false);
    	settings.setPlayerElementCapacity(10);
    	settings.setMoveZoomToolUnlocked(false);
    	settings.setSiphoningFromDustUnlocked(true);
    	settings.setTempToolUnlocked(false);
    	settings.setDensityToolUnlocked(false);
    	
    },
  

    // unlocks via quests
    setHydrogenUnlocked : function(bool){ settings.hydrogenUnlocked = bool; },
    setHeliumUnlocked : function(bool){ settings.heliumUnlocked = bool; },
    setCarbonUnlocked : function(bool){ settings.carbonUnlocked = bool; },
    setOxygenUnlocked : function(bool){ settings.oxygenUnlocked = bool; },
    setSiliconUnlocked : function(bool){ settings.siliconUnlocked = bool; },
    setIronUnlocked : function(bool){ settings.ironUnlocked = bool; },
    setGoldUnlocked : function(bool){ settings.goldUnlocked = bool; },
    setUraniumUnlocked : function(bool){ settings.uraniumUnlocked = bool; },

    // increases via quests
    setPlayerElementCapacity : function(val){ settings.playerElementCapacity = val; },

    // unlocks via quests
    setMoveZoomToolUnlocked : function(bool){ settings.moveZoomToolUnlocked = bool; },
    setSiphoningFromDustUnlocked : function(bool){ settings.siphoningFromDust = bool; },
    setTempToolUnlocked : function(bool){ settings.tempToolUnlocked = bool; },
    setDensityToolUnlocked : function(bool){ settings.densityToolUnlocked = bool; },

};



