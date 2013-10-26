/**
 * @author April
 */

define(["inheritance"], function(Inheritance) {
    return (function() {

        var Save = Class.extend({
        	
            init : function() {
            	// These two arrays hold all the data we wish to save in this obj
            	// ex: All the questlibraries's quests
                this.itemsToSave = [];
                this.itemIDs = [];
                this.name = "";
            },
            
            getItemByName : function(name){
            	return this.itemsToSave[this.itemIDs[name]].item;
            },
            
            // Pushes an object into this class's object holders as is
            // NOTE: IT IS DANGEROUS TO USE THIS ON ITS OWN!!!
            saveItem : function(name, item){
            	console.log(".... Saving " + name + ": " + item + " .... ");
            	this.itemsToSave.push(
            		{ "name": name,
            		  "item" : item   });
            	this.itemIDs[name] = this.itemsToSave.length-1;
            },
            
            // Doesn't allow duplicates
            safeSaveItem : function(name, item){
            	console.log("itemIDs[name]: " + this.itemIDs[name]);
            	if(this.itemIDs[name] === -1 || this.itemIDs[name] === undefined){
            		this.saveItem(name, item);
            	} else {
            		var id = this.itemIDs[name];
            		console.log("....!! Found existing item with name " + name + " .... " );
            		console.log(".... Replacing " + this.itemsToSave[id].item + " with " + item + " .... " );
            		
            		this.itemsToSave[id] = { "name": name,
            								 "item": item };
            		// Note: itemIDs do not need to be updated because the data is being
            		// replaced on the same index in itemsToSave
            	}
            },
            
            // Puts all objects inside of the ObjsToSave into an actual object {}
            // This object {} will be written to JSON
            wrapIntoSaveObject : function(){
            	var obj = {};
            	console.log(".... Wrapping up save package on " + this.itemsToSave.length + " item(s) .... ");
            	for(var i = 0; i < this.itemsToSave.length; i++){
            		obj[this.itemsToSave[i].name] = this.itemsToSave[i].item;
            		console.log("...... Saving " + i + "-- " + this.itemsToSave[i].name + ": " + this.itemsToSave[i].item);
            	}
            	
            	return obj;
            },
            
            // writes the save object {} into a JSON string
            objectToJSONStr : function(obj){
            	console.log(".... Saving Package as JSON .... ");
            	return JSON.stringify(obj);
            },
            
            // "additive" is a boolean that when set to false empties this save's contents
            loadObjectFromJSONStr : function(str){
            	console.log(".... Loading Package from JSON .... ");
            	var obj = JSON.parse(str);
            	return obj;
            },
            
            // "additive" is a boolean that when set to false empties this save's contents
            parseJSONObject : function(obj, additive){
            	var save = this;
            	if(!additive){
            		console.log(".... Unpacking JSON object fresh .... ");
            		this.itemsToSave = [];
                	this.itemIDs = [];
                	$.each(obj, function(index, value){
                		// It is okay to use save item because of how save objects are saved
                		// There are no duplicates in a loaded save
                		save.saveItem(index, value);
                	});
            	} else {
            		console.log(".... Unpacking additive JSON .... ");
            		// TO DO: Make a new save function that checks if the data already exists,
            		// then modifies it instead -- DONE
            		$.each(obj, function(index, value){
                		save.safeSaveItem(index, value);
                	});
            	}
            	
            }
            
        });
        return Save;
    })();

});
