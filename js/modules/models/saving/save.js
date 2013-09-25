/**
 * @author April
 */

define(["inheritance"], function(Inheritance) {
    return (function() {

        var Save = Class.extend({
        	
            init : function() {
                this.objectsToSave = [];
                this.objectIDs = [];
            },
            
            saveObject : function(name, obj){
            	console.log(".... Saving " + name + " .... ");
            	this.objectsToSave.push(
            		{ "name": name,
            		  "obj" : obj   });
            	this.objectsIDs[name] = this.objectsToSave.length()-1;
            },
            
            wrapIntoSaveObject : function(){
            	var obj = {};
            	console.log(" .... Wrapping up save package .... ");
            	for(var i = 0; i < this.objectsToSave.length; i++){
            		obj[this.objectsToSave[i].name] = this.objectsToSave[i].obj;
            	}
            	
            	return obj;
            }
            
        });
        return Save;
    })();

});
