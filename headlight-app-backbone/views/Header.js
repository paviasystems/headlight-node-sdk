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
        
        var logo = pict.features.HeadlightApp.getModuleData().Page.Logo;
        if(logo){
            this.$('.app-logo').append('<img src="/headlight-app/' + logo + '" />');
        }
        
        return this;
    },

    events: {
    }
});