// Pavia Systems Headlight App SDK
// Project router
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var DefaultRouter = Backbone.Router.extend({
    
    HeadlightAppData: null,
    
    initialize: function(options){
        options || (options = {});
        this.HeadlightAppData = options.HeadlightAppData;
    },

    routes: {
        '':             'default',
        'logout':       'logout'
    },
    
    default: function(){
        if(this.HeadlightAppData.Offline)
            this.navigate('headlightapp/' + this.HeadlightAppData.AppHash + '/records/new', { trigger: true, replace: true });
        else if(!this.HeadlightAppData.ProjectList)
            this.navigate('headlightapp/' + this.HeadlightAppData.AppHash + '/records', { trigger: true, replace: true });
        else if (this.HeadlightAppData.AppHash)
            this.navigate('headlightapp/' + this.HeadlightAppData.AppHash + '/projects', { trigger: true, replace: true });
        else if (pict.features.HeadlightApp.LastLoadedApp)
            this.navigate('headlightapp/' + pict.features.HeadlightApp.LastLoadedApp + '/projects', { trigger: true, replace: true });
    },
    
    logout: function(){
        var self = this;
        $.ajax({
			type: 'GET',
			url: '1.0/Deauthenticate',
			datatype: 'json',
			async: true
    	})
    	.done(function(response){
    	    self.navigate('', { trigger: true, replace: true });
    	    window.location.reload();
    	})
    	.fail(function(){ 
    	    // TODO
    	});

    }

});
