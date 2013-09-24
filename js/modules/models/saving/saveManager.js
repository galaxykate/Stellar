/**
 * @author April Grow
 */

// Saves/Loads states via localStorage

define([], function() {
	return (function() {

        function init() {
        	if(localStorage.stellarSave){
        		console.log("LOAD SAVE : " + localStorage.getItem("stellarSave"));
        	} else {
        		var id = Math.random();
        		localStorage.setItem("stellarSave", "hello? " + id);
        		console.log("SET SAVE: " + id);
        	}
        };
        

        return {
            init : init,
        };

    })();

});
