/**
 * @author Kate Compton
 */

var settings = {
	
	unlockAll: function(){
		settings.hydrogenUnlocked = true;
	    settings.heliumUnlocked= true;
	    settings.carbonUnlocked= true;
	    settings.oxygenUnlocked= true;
	    settings.siliconUnlocked= true;
	    settings.ironUnlocked= true;
	    settings.goldUnlocked= true;
	    settings.uraniumUnlocked= true;
	    settings.playerElementCapacity= 100;
	    settings.moveZoomToolUnlocked= true;
	    settings.siphoningFromDust = true;
	    settings.tempToolUnlocked= true;
	    settings.densityToolUnlocked= true;
	},

	// unlocks via quests
    hydrogenUnlocked: true,
    heliumUnlocked: false,
    carbonUnlocked: false,
    oxygenUnlocked: false,
    siliconUnlocked: false,
    ironUnlocked: false,
    goldUnlocked: false,
    uraniumUnlocked: false,
    
    // increases via quests
    playerElementCapacity: 10,
    
    // unlocks via quests
    moveZoomToolUnlocked: false,
    siphoningFromDust: false,
    tempToolUnlocked: false,
    densityToolUnlocked: false,
    
};

// debug
settings.unlockAll();
