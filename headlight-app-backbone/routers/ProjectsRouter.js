// Pavia Systems Headlight app SDK
// Project router
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var ProjectsRouter = Backbone.Router.extend({
    
    HeadlightAppData: null,
    
    initialize: function(options){
        options || (options = {});
        this.HeadlightAppData = options.HeadlightAppData;
    },

    routes: {
        'headlightapp/:appHash/projects':     'projects',
        'headlightapp/:appHash/projects/new': 'newProject',
        'headlightapp/:appHash/projects/:id': 'editProject'
    },
    
    projects: function(appHash) {
        var projects = new ProjectsCollection();
        var view = new ProjectListView({ collection: projects, HeadlightAppData: this.HeadlightAppData });
        projects.fetch();
    },
    
    newProject: function(appHash) {
        var project = new ProjectModel();
        var view = new ProjectEditView({ model: project, HeadlightAppData: this.HeadlightAppData });
    },
    
    editProject: function(appHash, id) {
        var project = new ProjectModel({ IDProject: id });
        var view = new ProjectEditView({ model: project, HeadlightAppData: this.HeadlightAppData });
        project.fetch();
    }

});
