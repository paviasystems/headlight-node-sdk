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
        'headlightapp/:appHash/records':         'list',
        'headlightapp/:appHash/records/new':     'new',
        'headlightapp/:appHash/records/:id':     'editWithoutProject',
        'headlightapp/:appHash/projects/:projectId/records':         'list',
        'headlightapp/:appHash/projects/:projectId/records/new':     'new',
        'headlightapp/:appHash/projects/:projectId/records/:id':     'edit'
    },
    
    list: function(appHash, projectId) {
        if(!projectId && this.HeadlightAppData.ProjectList){
            this.navigate('/', { trigger: true, replace: true });
        }
        else {
            var project;
            if(projectId){
                project = new ProjectModel({ IDProject: projectId });
                project.fetch();
            }
            var list = new AppDataCollection([], { projectId: projectId, type: this.HeadlightAppData.AppRecordHash });
            var view = new RecordListView({ collection: list, project: project, HeadlightAppData: this.HeadlightAppData });
            list.fetch();
        }
    },
    
    new: function(appHash, projectId) {
        if(!projectId && this.HeadlightAppData.ProjectList){
            this.navigate('/', { trigger: true, replace: true });
        }
        else {
            if(projectId){
                projectId = parseInt(projectId);
                var project = new ProjectModel({ IDProject: projectId });
                project.fetch({ success: function(model, response){
                    var p = model.toJSON();
                    HeadlightApp.loadModule(p, { id: null, model: {} });
                }});
            }
            else {
                HeadlightApp.loadModule(null, { id: null, model: {} });
            }
        }
    },
    
    editWithoutProject: function(appHash, id){
        this.edit(appHash, null, id);  
    },
    
    edit: function(appHash, projectId, id) {
        if(!projectId && this.HeadlightAppData.ProjectList){
            this.navigate('/', { trigger: true, replace: true });
        }
        else {
            if(projectId){
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
            else {
                var recordModel = new AppDataModel({ IDAppData: id });
                recordModel.fetch({ success: function(model, response){
                    var record = { id: id, model: model.get('Datum') };
                    HeadlightApp.loadModule(null, record);
                }});
            }
        }
    }

});
