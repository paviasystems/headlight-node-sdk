// Pavia Systems Headlight App SDK
// AppData router
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var RecordsRouter = Backbone.Router.extend({
    
    HeadlightAppData: null,
    
    initialize: function(options){
        options = (options || {});
        this.HeadlightAppData = options.HeadlightAppData;
    },

    routes: {
        'headlightapp/:appHash/projects/:projectId/records':         'list',
        'headlightapp/:appHash/projects/:projectId/records/new':     'new',
        'headlightapp/:appHash/projects/:projectId/records/:id':     'edit'
    },
    
    list: function(appHash, projectId) {
        var project = new ProjectModel({ IDProject: projectId });
        var list = new AppDataCollection([], { projectId: projectId, type: this.HeadlightAppData.AppRecordHash });
        var view = new RecordListView({ collection: list, project: project, HeadlightAppData: this.HeadlightAppData });
        project.fetch();
        list.fetch();
    },
    
    new: function(appHash, projectId) {
        projectId = parseInt(projectId);
        var project = new ProjectModel({ IDProject: projectId });
        project.fetch({ success: function(model, response){
            var p = model.toJSON();
            HeadlightApp.loadModule(p, { id: null, model: {} });
        }});

        //var model = new AppDataModel({ Type: this.HeadlightAppData.AppRecordHash }, { IDProject: projectId });
        //var view = new RecordEditView({ model: model, HeadlightAppData: this.HeadlightAppData });
    },
    
    edit: function(appHash, projectId, id) {
        projectId = parseInt(projectId);
        var project = new ProjectModel({ IDProject: projectId });
        project.fetch({ success: function(model, response){
            var projectModel = model.toJSON();
            var recordModel = new AppDataModel({ IDAppData: id });
            recordModel.fetch({ success: function(model, response){
                var record = { id: id, model: model.get('Datum') };
                HeadlightApp.loadModule(projectModel, record);
            }});
        }});
    }

});
