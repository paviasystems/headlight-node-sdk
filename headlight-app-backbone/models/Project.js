// Pavia Systems Headlight app SDK
// Project model
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global Backbone */
"use strict";

var ProjectModel = Backbone.Model.extend({
    idAttribute: 'IDProject',
    urlRoot: '1.0/Project',
    isNew: function(){
        return this.get(this.idAttribute) == 0;  
    },
    sync: function(method, model, options) {
        options || (options = {});
        if(method == 'create' || method == 'update'){
            // no ID parameter required for our API
            options.url = '1.0/Project';
        }
        return Backbone.sync.apply(this, arguments);
    },
    defaults: {
        IDProject: 0,
        Name: null,
        Description: null,
        Latitude: 47.6062,
        Longitude: -122.3321
    },
    validation: {
        Name: { required: true, type: String, msg: 'Your project must have a name.' },
        Latitude: { type: Number, min: -90, max: 90 },
        Longitude: { type: Number, min: -180, max: 180 }
    }
});


var ProjectsCollection = Backbone.Collection.extend({
    initialize: function(){
        this.total = null;
        this.last = 0;
        this.pageSize = 10;
    },
    url: function(){
        return '1.0/Projects/' + this.last + '/' + this.pageSize;
    },
    fetch: function(options){
        var self = this;
        var fetch = function(options){
            return Backbone.Collection.prototype.fetch.call(self, options);
        };
        
        if(!this.total){
            $.ajax({
    			type: 'GET',
    			url: '1.0/Projects/Count',
    			datatype: 'json',
    			async: true
        	})
        	.done(function(response){
        	    if(response && response.Count){
        	        self.total = response.Count;
        	        fetch(options);
        	    }
        	})
        	.fail(function(){ 
        	    // TODO
        	});
            
        }
        else {
            fetch(options);
        }
    },
    next: function(){
        if(this.last + this.pageSize < this.total){
            this.last = this.last + this.pageSize;
            this.fetch();
            return true;
        }
        return false;
    },
    prev: function(){
        if(this.last - this.pageSize >= 0){
            this.last = this.last - this.pageSize;
            this.fetch();
            return true;
        }
        return false;
    },
    move: function(page){
        this.last = page * this.pageSize;
        this.fetch();
        return true;
    },
    model: ProjectModel
});