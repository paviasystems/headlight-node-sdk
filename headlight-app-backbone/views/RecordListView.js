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
    HeadlightAppData: null,
    CurrentState: null,
    
    initialize: function(options) {
        options || (options = {});
        this.template = _.template($('#record-item-tmpl').html());
        //this.listenTo(this.model, 'destroy', this.remove)
        this.HeadlightAppData = options.HeadlightAppData;
        this.CurrentState = options.CurrentState;
    },
    
    render: function() {
        var html = this.template({ record: this.model.toJSON(), HeadlightAppData: this.HeadlightAppData, CurrentState: this.CurrentState });
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

var RecordComparisonView = Backbone.View.extend({
    Details: null,

    initialize: function(options) {
        options || (options = {});
        this.template = _.template($('#record-comparison-tmpl').html());
        this.Details = options.Details;
    },
    render: function() {
        var html = this.template({ Details: this.Details });
        this.$el.html(html);
        return this;
    }
});

var RecordComparisonSummaryView = Backbone.View.extend({
    Simulations: null,

    initialize: function(options) {
        options || (options = {});
        this.template = _.template($('#record-comparison-summary-tmpl').html());
        this.Simulations = options.Simulations;
    },
    render: function() {
        var html = this.template({ Simulations: this.Simulations });
        this.$el.html(html);
        return this;
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
        var html = this.template({ IDProject: this.collection.projectId, project: this.options.project ? this.options.project.toJSON() : {}, records: this.collection.toJSON(), HeadlightAppData: this.HeadlightAppData });
        this.$el.html(html);

        var $list = this.$('.list').empty();
        
        this.collection.each(function(model) {
            var currentState = false;
            
            if(model.attributes.Datum) {
                currentState = model.attributes.Datum.map(function(datum) {
                    if(datum.name == "CurrentState") {
                        return datum.value;
                    }
                }).filter(function(datum) {
                    return datum;
                }).shift();
            }

            var item = new RecordListItemView({ model: model, HeadlightAppData: this.HeadlightAppData, CurrentState: currentState });
            $list.append(item.render().$el);
        }, this);

        $(".compare-selected").on('click', function(e) {
            $("#compare_reports .modal-body").empty();
            var Simulations = [];
            $(".record-select:checkbox:checked").each(function(key, record) {
                if($(record).attr("data-complete") == 'false') {
                    return;
                }
                var obj = {
                    RecordId: $(record).attr("data-record-id"),
                    Complete: $(record).attr("data-complete"),
                    WorkingWindow: $(record).attr("data-working-window"),
                    ActualWorkingWindow: $(record).attr("data-actual-window"),
                    SimulationName: $(record).attr("data-simulation-name"),
                    ProgressPerDay: $(record).attr("data-progress-per-day"),
                    RequiredWindows: $(record).attr("data-required-windows"),
                    WorkLength: $(record).attr("data-work-length"),
                    Units: $(record).attr("data-units"),
                    SequenceMethod: $(record).attr("data-sequence-method"),
                    ShiftClosure: $(record).attr("data-shift-closure"),
                    Route: $(record).attr("data-route"),
                    LaneCount: $(record).attr("data-lane-count"),
                    LaneWidth: $(record).attr("data-lane-width"),
                    Created: $(record).attr("data-created"),
                    BaseThickness: $(record).attr("data-base-thickness"),
                    AsphaltThickness: $(record).attr("data-asphalt-thickness"),
                    DemolitionThickness: $(record).attr("data-demolition-thickness"),
                    PavementType: $(record).attr("data-pavement-type"),
                    Lifts: $(record).attr("data-lifts"),
                    LimitingFactors: $(record).attr("data-limiting-factors"),
                    ClosureType: $(record).attr("data-closure-type"),
                    CoolingTime: $(record).attr("data-cooling-time")
                } ;
                var item = new RecordComparisonView({ 
                    Details: obj
                });
                Simulations.push(obj);
                
                $("#compare_reports .modal-body").append(item.render().$el);
            })

            var items = new RecordComparisonSummaryView({
                Simulations: Simulations
            })
            $("#compare_reports .modal-body").prepend(items.render().$el);

            $("#compare_reports").modal('show')
            return false;
        });

        $(".delete-selected").on('click', function(e) {
            alert('Delete Feature Coming Soon.')
            return false;
        });

        $(".duplicate-selected").on('click', function(e) {
            alert('Duplicate Feature Coming Soon')
            return false;
        });
        
        return this;
    },

    events: {
    }
    
});