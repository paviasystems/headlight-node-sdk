// Pavia Systems Headlight app SDK
// Project router
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var ProjectsRouter = Backbone.Router.extend({

    routes: {
        'projects':     'projects',
        'projects/new': 'newProject',
        'projects/:id': 'editProject'
    },
    
    projects: function() {
        var projects = new ProjectsCollection();
        var view = new ProjectListView({ collection: projects });
        projects.fetch();
    },
    
    newProject: function() {
        var project = new ProjectModel();
        var view = new ProjectEditView({ model: project });
    },
    
    editProject: function(id) {
        console.log(id);
        var project = new ProjectModel({ IDProject: id });
        var view = new ProjectEditView({ model: project });
        project.fetch();
    }

});
