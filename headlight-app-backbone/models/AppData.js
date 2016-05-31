// Pavia Systems Headlight app SDK
// AppData models
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var AppDataModel = Backbone.Model.extend({
    idAttribute: 'IDAppData',
    urlRoot: '1.0/AppData',
    initialize: function(attrs, options){
    },
    isNew: function(){
        return this.get(this.idAttribute) == 0;  
    },
    sync: function(method, model, options) {
        options || (options = {});
        if(method == 'create' || method == 'update'){
            // no ID parameter required for our API
            options.url = '1.0/AppData';
        }
        return Backbone.sync.apply(this, arguments);
    },
    defaults: {
        IDAppData: 0,
        Type: null,
        //IDProject: null,
        Title: null,
        Description: '',
        Datum: null
    },
    validation: {
        Type: { required: true },
        Title: { required: true }
    }
});

var AppDataCollection = Backbone.Collection.extend({
    contentType: null,
    initialize: function(models, options){
        this.options = options || {};
        if(this.options.type){
            this.contentType = this.options.type;
        }
    },
    url: function(){
        return '1.0/AppDatas/FilteredTo/FBV~Type~EQ~' + this.contentType + (this.options.projectId ? '~FBV~IDProject~EQ~' + this.options.projectId : '');
    },
    model: AppDataModel
});
