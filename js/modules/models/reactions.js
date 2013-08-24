/**
 * @author April Grow
 */

// Information about the elements reactions

define([], function() {
    return (function() {
		// ["Hydrogen", "Helium", "Carbon", "Oxygen", "Silicon", "Iron", "Gold", "Uranium"];
        return [
        {
        	input : {
        		"Hydrogen" : 4,
        		"minTemp" : 1000,
        	},
        	output : {
        		"Helium" : 1,
        		"heat" : 100,
        	}
        },{
        	input : {
        		"Helium" : 3,
        		"minTemp" : 2000,
        	},
        	output : {
        		"Carbon" : 1,
        		"heat" : 200,
        	}
        },{
        	input : {
        		"Helium" : 1,
        		"Carbon" : 1,
        		"minTemp" : 2500,
        	},
        	output : {
        		"Oxygen" : 1,
        		"heat" : 300,
        	}
        },{
        	input : {
        		"Helium" : 1,
        		"Oxygen" : 1,
        		"minTemp" : 3000,
        	},
        	output : {
        		"Silicon" : 1,
        		"heat" : 200,
        	}
        },{
        	input : {
        		"Helium" : 1,
        		"Silicon" : 1,
        		"minTemp" : 3500,
        	},
        	output : {
        		"Iron" : 1,
        		"heat" : 100,
        	}
        },{
        	input : {
        		"Helium" : 1,
        		"Iron" : 1,
        		"minTemp" : 5000,
        	},
        	output : {
        		"Gold" : 1,
        		"heat" : -500,
        	}
        },{
        	input : {
        		"Helium" : 1,
        		"Gold" : 1,
        		"minTemp" : 10000,
        	},
        	output : {
        		"Uranium" : 1,
        		"heat" : -1000,
        	}
        },
           
            
        ];
    })();

});
