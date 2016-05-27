/* global pict */
/* global $ */
/* global _ */
/* global Backbone */

pict.features = pict.features || {};

var HeadlightApp = pict.features.HeadlightApp = (function(){
    
    var headlightAppData, session, currentProject;
    
    this.checkSessionStatus = function()
    {
    	$.ajax
    	(
    		{
    			type: 'GET',
    			url: '1.0/CheckSession',
    			datatype: 'json',
    			async: true
    		}
    	)
    	.done
    	(
    		function (pData)
    		{
    			if ((typeof(pData) === 'object') && 
    				(typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined') &&
    				(typeof(pData.LoggedIn) !== 'undefined') && (pData.LoggedIn))
    			{
    				// We are logged in.  Set the pict.session object to be this.
    				pict.session = session = pData;
    
    				// Put the hidden User ID into the wrapper -- this is for Selenium mostly
    				$('#wrapper #HeadlightLoggedInUserID').remove();
    				$('#wrapper').append('<input type="hidden" id="HeadlightLoggedInUserID" value="'+pData.UserID+'">');
    
    				// Write the page form content
                    $('#appNavigationContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Navigation').text()));
                    $('#appContentContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Form').text()));
                    $('#appFooterContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Footer').text()));
    
    				// Put the User name in the header
    				$(".fullUserName").text(pData.NameFirst + " " + pData.NameLast);	
    
    				// Now load the module
    				HeadlightApp.initializeModule();
    			}
    			else
    			{
    				// Reload to get the login page.
    				location.reload();
    			}
    		}
    	)
    	.fail
    	(
    		function ()
    		{
    			// This indicates connectivity issues
    		}
    	);
    };
    
    this.initialize = function(){
        bootstrap();
        this.checkSessionStatus();
    };
    
    this.start = function(appData){
        
        new NavigationView({ HeadlightAppData: appData });
        new HeaderView({ HeadlightAppData: appData });
        
        new DefaultRouter({ HeadlightAppData: appData });
        new ProjectsRouter({ HeadlightAppData: appData });
        new RecordsRouter({ HeadlightAppData: appData });
        
        Backbone.history.on('route', routeChanged);
        Backbone.history.start();
    };
    
    var routeChanged = function(router, routeName, parameters){
        console.log('routeChanged');
        // Can't figure out a better way to do this...
        var frags = Backbone.history.fragment.toLowerCase().split('/');
        var index;
        if((index = frags.indexOf('projects')) >= 0 && frags.length > index + 1){
            var projectId = parseInt(frags[index+1]);
            if(!currentProject || (currentProject && currentProject.get('IDProject') != projectId)) {
                currentProject = new ProjectModel({ IDProject: projectId });
                currentProject.fetch();
            }
        }
        else {
            currentProject = null;
        }

    };
    
    var bootstrap = function(){
        
        Backbone.ajax = function(params){
            
            var success = params.success;
            params.success = function(data, type, xhr){
                if(data && data.Error){
                    if(params.error){
                        params.error.call(this, xhr, xhr.responseText, null);
                    }
                }
                else if(success) {
                    success.call(this, data);
                }
            };
            
            return Backbone.$.ajax.apply(Backbone.$, arguments);
        };
        
        
        var typeToClass = { 'boolean': Boolean, 'number': Number, 'string': String, 'array': Array, 'regexp': RegExp, 'function': Function };
        
        _.extend(Backbone.Validation, {
            classToType: function(c){
                return _.find(_.keys(typeToClass), function(key) { return (typeToClass[key] == c); });
            },
            typeToClass: function(t){
                return typeToClass[t];
            }
        });
        
        _.extend(Backbone.Validation.validators, {
            type: function(value, attr, customValue, model){
                if(typeToClass[typeof(value)] !== customValue) return 'Not the correct type.';
            },
            enum: function(value, attr, customValue, model){
                if(!customValue || customValue.indexOf(value) < 0) return 'Not a valid value';
            }
        });
        
        var _t = _.template;
        _.extend(_, { 
            template: function(templateString, settings){
                var template = _t(templateString, settings);
                var templateWithHelpers = function(data) {
                    data = data || {};
                    _.extend(data, {
                        url: function(path){
                            return '/#headlightapp/' + headlightAppData.AppHash + (path.indexOf('/') == 0 ? path : '/' + path);
                        },
                        capitalize: function(str){
                            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                        },
                        humanize: function(text){
                            return text.replace(/([A-Z])/g, ' $1') // space before each capital letter
                                        .replace(/[_-]/g, ' ') // underscores to spaces
                                        .replace(/^./, function(str){ return str.toUpperCase(); })
                        }
                    });
                    return template(data);
                };
                return templateWithHelpers;
            }
        });
    };
    
    
    this.initializeModule = function(pModuleName)
    {
    	var tmpModuleName = (typeof(pModuleName) === 'undefined') ? false : pModuleName;
    
    	if ($.isEmptyObject(pict.features) || typeof(pict.features.HeadlightApp) === 'undefined' )
    		// There are no modules defined, or the HeadlightApp framework isn't loaded.  We are failing.
    		return false;
    
    	// AJAX Load the solo app manifest
    	$.ajax
    	(
    		{
    			type: 'GET',
    			url: 'headlight-app/Headlight-App.json',
    			datatype: 'json',
    			async: true
    		}
    	)
    	.done
    	(
    		function (pData)
    		{
    			if (typeof(pData) === 'object')
    			{
    			    headlightAppData = pData;
    				tmpModuleName = pData.AppHash;
    				// Load the module (maybe wrap this in try catch eventually)
    				if (pict.features[tmpModuleName].hasOwnProperty('initialize'))
    				{
    					console.log('--> Auto initializing Headlight App: '+tmpModuleName);
    					pict.features[tmpModuleName].initialize(pict.session);
    					HeadlightApp.start(pData);
    				}
    			}
    		}
    	)
    	.fail
    	(
    		function () {} // We might want this to do something.
    	);
    };
    
    
    this.loadModule = function(project, record) {
    
    	if (typeof(headlightAppData) === 'object'){
    		// Load the module (maybe wrap this in try catch eventually)
    		if (pict.features[headlightAppData.AppHash].hasOwnProperty('load')){
    			console.log('--> Loading Headlight App: ' + headlightAppData.AppHash);
    			pict.features[headlightAppData.AppHash].load(record, project, session);
    		}
    	}
    };
    
    var AppData = {
        
        load: function(id, success, error){
            
            var r = new AppDataModel({ IDAppData: id });
            r.fetch({ success: function(model, response){
                if(typeof(success) === 'function'){
                    var record = { 
                        id: response.IDAppData,
                        model: response.Datum
                    };
                    success(record);
                }
            }, error: function(){
                if(typeof(error) === 'function') error();
            }});
            
        },
        
        save: function(record, success, error) {
            var r = new AppDataModel({ 
                IDAppData: record.id || 0, 
                IDProject: currentProject.get('IDProject'),
                Type: headlightAppData.AppRecordHash,
                Title: record.model.Title || (headlightAppData.AppRecordName + ' ' + (record.id || '')),
                Datum: record.model
            });
            r.save(null, { success: function(model, response){
                if(typeof(success) === 'function'){
                    var record = { 
                        id: response.IDAppData,
                        model: response.Datum
                    };
                    success(record);
                }
            }, error: function(){
                if(typeof(error) === 'function') error();
            }});
        }
    };
    
    

    return {
        initialize: this.initialize,
        start: this.start,

        checkSessionStatus: this.checkSessionStatus,

        // module init
        initializeModule: this.initializeModule,
        loadModule: this.loadModule,
        
        // data proxies
        AppData: AppData
    };
})();
