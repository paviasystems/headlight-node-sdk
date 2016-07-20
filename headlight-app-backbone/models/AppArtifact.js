// Pavia Systems Headlight SDK
// AppArtifact models
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var AppArtifactModel = Backbone.Model.extend({
    idAttribute: 'IDAppArtifact',
    urlRoot: '1.0/AppArtifact',
    initialize: function(attributes, options){
        this.options = options || {};
        if(this.options.ID){
            this.set(this.idAttribute, this.options.ID);
        }
    },
    isNew: function(){
        return this.get(this.idAttribute) == 0;  
    },
    sync: function(method, model, options) {
        options || (options = {});
        if(method == 'create' || method == 'update'){
            // no ID parameter required for our API
            options.url = '1.0/AppArtifact';
        }
        return Backbone.sync.apply(this, arguments);
    },
    defaults: {
        IDAppArtifact: 0,
        AppHash: null,
        Type: null,
        Artifact: null
    },
    validation: {
        AppHash: { required: true },
        FileName: { required: true }
    }
});

var AppArtifactCollection = Backbone.Collection.extend({
    initialize: function(models, options){
    },
    url: function(){
        return '1.0/AppArtifacts/FilteredTo/FBV~AppHash~EQ~';
    },
    model: AppArtifactModel
});