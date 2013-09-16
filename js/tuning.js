/**
 * @author Kate Compton
 */

var tuning = {
    starEvolutionSpeed : 1,

    maxZoom : 1,
    minZoom : .01,
    
    
    ///////////////////////////////////////////////////////////////////
    ///////////// Star Element Burning and Supernova Scales ///////////
    ///////////////////////////////////////////////////////////////////

    // Sets the rate that the star burns through its fuel if it past its temp threshold
    // Debug default has been 0.1, but we probably will scale it way slower than that
    elementBurnAmt : .1,
    
    // Temperature generation scalar: multiples the amount found in the reactions.js
    elementBurnTempGenerationScalar : 1,
    
    // The amount of residual elements to leave in the star
    elementBurnElementMin : 40,

    // Star temperature is based on density and mass of the star
    // density * totalMass * starTempCalcScalar
    // Default: 10
    // Setting very low will turn off supernova.
    // Setting very high will ensure stars reach full supernova state
    starTempCalcScaler : .001,
    
    // How much star radii fluctuate during collapse
    starCollapseRadiusScalar : 1,
    // How much star density changes during collapse
    starCollapseDensityScalar : 1000,

    starReactionTempScale : 1,
};

