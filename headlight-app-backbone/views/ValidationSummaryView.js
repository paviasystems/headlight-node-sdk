// Pavia Systems Headlight App SDK
// Validation summary view
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var ValidationSummaryView = Backbone.View.extend({
    el: '.validation-summary',

    initialize: function() {
        this.template = _.template($('#validation-summary-tmpl').html());
        
        this.render();
    },

    render: function() {
        var html = this.template();
        this.$el.html(html);
        
        var $list = this.$('.summary-list').empty();
        
        for(var p in this.model){
            var error = this.model[p];
            var item = new ValidationSummaryItemView({ model: error });
            $list.append(item.render().$el);
        }

        return this;
    },

    events: {
    }
});

var ValidationSummaryItemView = Backbone.View.extend({
    tagName: 'div',
    className: function(){
        return 'alert alert-danger';
    },

    initialize: function() {
        this.template = _.template($('#validation-summary-item-tmpl').html());
        
        this.render();
    },

    render: function() {
        var html = this.template({ message: this.model });
        this.$el.html(html);
        
        return this;
    },

    events: {
    }
});