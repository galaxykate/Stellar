/**
 * @author Kate Compton
 */

var settings = {

    ///////////////////////////////////////////////////////////////////
    ///////////// Star Element Burning and Supernova Scales ///////////
    ///////////////////////////////////////////////////////////////////

    // Sets the rate that the star burns through its fuel if it past its temp threshold
    // Debug default has been 0.01, but we probably will scale it way slower than that
    elementBurnAmtScaler : 0.005,

    // Star temperature is based on density and mass of the star
    // density * totalMass * starTempCalcScalar
    // Default: 10
    // Setting very low will turn off supernova.
    // Setting very high will ensure stars reach full supernova state
    starTempCalcScaler : 10,


};
