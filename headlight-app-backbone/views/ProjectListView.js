// Pavia Systems Drainage app
// Project List views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

// View class for displaying each project list item
var ProjectListItemView = Backbone.View.extend({
    tagName: 'tr',
    className: 'project',
    
    initialize: function() {
        this.template = _.template($('#project-item-tmpl').html());
        //this.listenTo(this.model, 'destroy', this.remove)
    },
    
    render: function() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },
    
    events: {
        'click .delete-project':    'delete',
        'click .edit-project':      'edit'
    },
    
    edit: function(){
        Backbone.history.navigate('projects/' + this.model.get('IDProject'), true);
    },
    
    delete: function() {
        if(confirm('Are you sure?')){
            this.$el.remove();
            this.model.destroy();
        }
    }
});

// View class for rendering the list of all projects
var ProjectListView = Backbone.View.extend({
    el: '#drainage-app',

    initialize: function() {
        this.template = _.template($('#project-list-tmpl').html());
        this.listenTo(this.collection, 'sync', this.render);
    },

    render: function() {
        var html = this.template();
        this.$el.html(html);

        var $list = this.$('.projects-list').empty();
        
        this.collection.each(function(model) {
            var item = new ProjectListItemView({model: model});
            $list.append(item.render().$el);
        }, this);
        
        this.$('.pagination .page').remove();
        _.each(_.range(Math.ceil(this.collection.total / this.collection.pageSize)), function(page){
            self.$('.pagination .next-page').parent().before('<li data-page="' + page + '"><span class="page">' + (page+1) + '</span></li>');
        });
        
        var currentPage = this.collection.last / this.collection.pageSize;
        this.$('.pagination li[data-page=' + currentPage + ']').addClass('active');
        
        return this;
    },

    events: {
        'click .next-page': 'nextPage',
        'click .prev-page': 'prevPage',
        'click .page': 'page'
    },
    
    nextPage: function(){
        this.collection.next();
    },
    
    prevPage: function(){
        this.collection.prev();
    },
    
    page: function(e){
        var page = parseInt($(e.target).text()) - 1;
        this.collection.move(page);
    }
});