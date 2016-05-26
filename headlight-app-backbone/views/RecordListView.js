// Pavia Systems Drainage app
// Calculation List views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var CalculationListItemView = Backbone.View.extend({
    tagName: 'tr',
    
    initialize: function() {
        this.template = _.template($('#calculation-item-tmpl').html());
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


var CalculationListView = Backbone.View.extend({
    el: '#drainage-app',

    initialize: function(options) {
        this.options = options || {};
        
        this.template = _.template($('#calculation-list-tmpl').html());
        
        this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.options.project, 'sync', this.render);
    },

    render: function() {
        var html = this.template({ IDProject: this.collection.projectId, project: this.options.project.toJSON(), calculations: this.collection.toJSON() });
        this.$el.html(html);

        var $list = this.$('.list').empty();
        
        this.collection.each(function(model) {
            var item = new CalculationListItemView({model: model});
            $list.append(item.render().$el);
        }, this);
        
        return this;
    },

    events: {
    }
    
});