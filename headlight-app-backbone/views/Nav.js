// Pavia Systems Headlight App SDK
// Navigation views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var NavigationView = Backbone.View.extend({
    el: '#app-nav',
    
    currentProject: null,

    initialize: function(options) {
        this.options = options || {};
        
        this.template = _.template($('#app-nav-tmpl').html());
        
        this.listenTo(Backbone.history, 'route', this.routeChanged);
        
        this.render();
    },
    
    routeChanged: function(router, routeName, parameters){
        // Can't figure out a better way to do this...
        var frags = Backbone.history.fragment.toLowerCase().split('/');
        var index;
        if((index = frags.indexOf('projects')) >= 0 && frags.length > index + 1){
            var projectId = parseInt(frags[index+1]);
            if(!this.currentProject || (this.currentProject && this.currentProject.get('IDProject') != projectId)) {
                this.currentProject = new ProjectModel({ IDProject: projectId });
                this.listenToOnce(this.currentProject, 'sync', this.render);
                this.currentProject.fetch();
            }
        }
        else {
            this.currentProject = null;
            this.render();
        }
    },

    render: function() {
        
        var html = this.template({ project: (this.currentProject ? this.currentProject.toJSON() : null), HeadlightAppData: pict.features.HeadlightApp.getModuleData() });
        this.$el.html(html);

        return this;
    }
});