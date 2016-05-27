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
        'projects/:projectId/records':         'list',
        'projects/:projectId/records/new':     'new',
        'projects/:projectId/records/:id':     'edit'
    },
    
    list: function(projectId) {
        var project = new ProjectModel({ IDProject: projectId });
        var list = new AppDataCollection([], { projectId: projectId, type: this.recordHash });
        var view = new RecordListView({ collection: list, project: project, HeadlightAppData: this.HeadlightAppData });
        project.fetch();
        list.fetch();
    },
    
    new: function(projectId) {
        projectId = parseInt(projectId);
        var project = new ProjectModel({ IDProject: projectId });
        project.fetch({ success: function(model, response){
            var p = model.toJSON();
            HeadlightApp.loadModule(p, {});
        }});

        //var model = new AppDataModel({ Type: this.HeadlightAppData.AppRecordHash }, { IDProject: projectId });
        //var view = new RecordEditView({ model: model, HeadlightAppData: this.HeadlightAppData });
    },
    
    edit: function(projectId, id) {
        projectId = parseInt(projectId);
        var project = new ProjectModel({ IDProject: projectId });
        project.fetch({ success: function(model, response){
            var projectModel = model.toJSON();
            var record = new AppDataModel({ IDAppData: id });
            record.fetch({ success: function(model, response){
                var recordModel = model.toJSON();
                HeadlightApp.loadModule(projectModel, recordModel);
            }});
        }});
    }

});
