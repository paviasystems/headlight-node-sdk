// Pavia Systems Headlight App SDK
// AppData router
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var RecordsRouter = Backbone.Router.extend({
    
    recordHash: null,
    
    initialize: function(options){
        options = (options || {});
        if(options.recordHash){
            this.recordHash = options.recordHash;
        }
        console.log(this.recordHash);
    },

    routes: {
        'projects/:projectId/records':         'list',
        'projects/:projectId/records/new':     'new',
        'projects/:projectId/records/:id':     'edit'
    },
    
    list: function(projectId) {
        var project = new ProjectModel({ IDProject: projectId });
        var list = new AppDataCollection([], { projectId: projectId, type: this.recordHash });
        var view = new CalculationListView({ collection: list, project: project });
        project.fetch();
        list.fetch();
    },
    
    new: function(projectId) {
        projectId = parseInt(projectId);
        var model = new CalculationModel({ Type: this.recordHash }, { IDProject: projectId });
        var view = new CalculationEditView({ model: model });
    },
    
    edit: function(projectId, id) {
        var model = new CalculationModel({ IDAppData: id });
        var view = new CalculationEditView({ model: model });
        model.fetch();
    }

});
