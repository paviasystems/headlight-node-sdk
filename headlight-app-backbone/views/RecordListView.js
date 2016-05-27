// Pavia Systems Headlight App SDK
// Record List views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var RecordListItemView = Backbone.View.extend({
    tagName: 'tr',
    
    initialize: function() {
        this.template = _.template($('#record-item-tmpl').html());
        //this.listenTo(this.model, 'destroy', this.remove)
    },
    
    render: function() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },
    
    events: {
        'click .delete':    'delete'
    },
    
    delete: function() {
        if(confirm('Are you sure?')){
            this.$el.remove();
            this.model.destroy();
        }
    }
});


var RecordListView = Backbone.View.extend({
    el: '#headlight-app',
    HeadlightAppData: null,

    initialize: function(options) {
        this.options = options || {};
        
        this.HeadlightAppData = this.options.HeadlightAppData;
        
        this.template = _.template($('#record-list-tmpl').html());
        
        this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.options.project, 'sync', this.render);
    },

    render: function() {
        var html = this.template({ IDProject: this.collection.projectId, project: this.options.project.toJSON(), records: this.collection.toJSON(), HeadlightAppData: this.HeadlightAppData });
        this.$el.html(html);

        var $list = this.$('.list').empty();
        
        this.collection.each(function(model) {
            var item = new RecordListItemView({model: model});
            $list.append(item.render().$el);
        }, this);
        
        return this;
    },

    events: {
    }
    
});