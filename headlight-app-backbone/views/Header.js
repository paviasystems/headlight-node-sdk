// Pavia Systems Headlight App SDK
// Navigation views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var HeaderView = Backbone.View.extend({
    el: '#headlight-app-header-logo',

    initialize: function() {
        this.template = _.template($('#header-tmpl').html());
        this.render();
    },

    render: function() {
        var html = this.template();
        this.$el.html(html);
        
        var appData = pict.features.HeadlightApp.getModuleData();
        if(appData && appData.Page.Logo){
            this.$('.app-logo').append('<a href="/"><img src="/headlight-app/' + appData.Page.Logo + '" title="' + appData.AppName + '" /></a>');
        }
        
        return this;
    },

    events: {
    }
});