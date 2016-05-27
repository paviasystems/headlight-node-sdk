// Pavia Systems Headlight App SDK
// Project editing views
// @author Ryan Vanderpol <me@ryanvanderpol.com>

/* global pict */
/* global $ */
/* global _ */
/* global Backbone */
"use strict";

var ProjectEditView = Backbone.View.extend({
    el: '#headlight-app',
    
    HeadlightAppData: null,

    initialize: function(options) {
        options || (options = {});
        
        this.HeadlightAppData = options.HeadlightAppData;
        
        this.template = _.template($('#project-edit-tmpl').html());

        this.listenTo(this.model, 'sync', this.render);
        this.listenTo(this.model, 'validated:invalid', this.showErrors);

        Backbone.Validation.bind(this);
        this.render();
    },

    render: function() {
        var html = this.template({ project: this.model.toJSON(), HeadlightAppData: this.HeadlightAppData });
        this.$el.html(html);
        
        this.$('.project-map').locationpicker({
        	location: { latitude: this.model.get('Latitude'), longitude: this.model.get('Longitude') },	
        	radius: 0,
        	enableAutocomplete: true,
        	inputBinding: {
                latitudeInput: $('.project-latitude'),
                longitudeInput: $('.project-longitude'),
                locationNameInput: $('.project-location')
            }
        });

        return this;
    },

    events: {
        'click .save-project': 'save',
        'click .cancel-project': 'cancel'
    },
    
    save: function() {
    
        this.model.set('Name', this.$('.project-name').val());
        this.model.set('Description', this.$('.project-description').val());
        this.model.set('Latitude', parseFloat(this.$('.project-latitude').val()));
        this.model.set('Longitude', parseFloat(this.$('.project-longitude').val()));
        
        if(this.model.save()){
            this.close();
        }
    },
    
    cancel: function(){
        this.close();
    },
    
    close: function(){
        this.undelegateEvents();
        this.unbind();
        Backbone.Validation.unbind(this);
        
        Backbone.history.navigate('headlightapp/' + this.HeadlightAppData.AppHash + '/projects', true);
    },
    
    showErrors: function(model, errors){
        new ValidationSummaryView({ model: this.model.validationError });
    }
});