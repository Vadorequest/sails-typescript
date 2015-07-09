///<reference path='./../../typings/loader.d.ts'/>

export module Controllers.Core {

    /**
     * Core controller which defines common logic between controllers.
     *
     * Workflow details:
     * - First, the "_handleRequest" method must be called. It ensures common stuff happens, and bind some data into the option object.
     * - It calls a magic method such as "__beforeIndex" if the request was coming from an "index" method.
     * - If it doesn't find any specific magic method to call, it calls directly the "__beforeEach" method.
     * - If it does find a custom magic method, then the "__beforeIndex" will automatically call the "__beforeEach" once it is done.
     * - Once all the "__before" magic methods have been called, the caller's callback function is called.
     *
     * The options object contains specific stuff that belongs to the controllers logic, I could have use the req but I prefer not.
     *
     * The public methods such as index/show/etc. are defined but send by default a 404 response if they are not overridden in the child class.
     * They exists just to bind by default all these methods without take care if they exists or not in order to speed up development.
     */
    export class Controller {

        /**
         * Overrides for the settings in `config/controllers.js`
         * (specific to the controller where it's defined)
         * Specific to sails. Don't rename.
         */
        protected _config: any = {};

        /**
         * Exported methods. Must be overridden by the child to add custom methods.
         */
        protected _exportedMethods: string[] = [];

        /**
         * Theme used by the controller by default.
         * Could be overridden by the user theme. (One day, when the feature will be done...)
         */
        protected _theme: string = 'ayolan';

        /**
         * Layout used by the controller by default.
         */
        protected _layout: string = 'default';

        /**
         * Relative path to a layout from a view.
         */
        protected _layoutRelativePath: string = '../_layouts/';

        /**
         * Default exported methods.
         * These methods will be accessible.
         */
        private _defaultExportedMethods: string[] = [
            // Sails controller custom config.
            '_config',

            // Default predefined controller methods.
            'index',
            'show',
            'new',
            'create',
            'edit',
            'update',
            'destroy'
        ];

        /**
         **************************************************************************************************
         **************************************** Public methods ******************************************
         **************************************************************************************************
         */

        /**
         * Returns an object that contains all exported methods of the controller.
         * These methods must be defined in either the "_defaultExportedMethods" or "_exportedMethods" arrays.
         *
         * @returns {*}
         */
        public exports(): any{
            // Merge default array and custom array from child.
            var methods: any = this._defaultExportedMethods.concat(this._exportedMethods);
            var exportedMethods: any = {};

            for(var i = 0; i < methods.length; i++){
                // Check if the method exists.
                if(typeof this[methods[i]] !== 'undefined'){
                    // Check that the method shouldn't be private. (Exception for _config, which is a sails config)
                    if(methods[i][0] !== '_' || methods[i] === '_config'){
                        if(_.isFunction(this[methods[i]])){
                            exportedMethods[methods[i]] = this[methods[i]].bind(this);
                        }else{
                            exportedMethods[methods[i]] = this[methods[i]];
                        }
                    }else{
                        console.error('The method "' + methods[i] + '" is not public and cannot be exported. ' + this);
                    }
                }else{
                    console.error('The method "' + methods[i] + '" does not exist on the controller ' + this);
                }
            }

            return exportedMethods;
        }

        /**
         **************************************************************************************************
         **************************************** Protected methods ******************************************
         **************************************************************************************************
         */

        /**
         * Acts as a requests workflow handler to automatically call magic methods such as "__before".
         * Used to call magic methods before the targeted methods is called.
         * Bind some data as well, like the current controller and action name.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         *          controller  Controller      Child controller class. (static)
         *
         */
        protected _handleRequest(req, res, callback, options: any = {}): void {
            // Extract information from the child. req.target is sails < 0.10 compatible, req.options is sails >0.10 compatible.
            options.controller = req.target && req.target.controller ? req.target.controller : req.options.controller;
            options.action = req.target && req.target.action ? req.target.action : req.options.action;

            // Check that the dedicated method has a __before magic method in the current controller.
            if(this['__before' + this._cleanMethodName(options.action)]){
                // Custom before method is available. Call it. Remove underscores by security. (Protected/private methods)
                this['__before' + this._cleanMethodName(options.action)](req, res, callback, options);
            }else{
                // By default, always call the global magic method.
                this.__beforeEach(req, res, callback, options);
            }
        }

        /**
         * Default view renderer, manages basic data and stuff to always bind into the views.
         *
         * @param req           Request.
         * @param res           Response.
         * @param options       Specific options to render the view.
         * @param view          View to load. Use the path controller/method by default.
         */
        protected _renderView(req, res, options: any = {}, view: any = false): void {
            // Bind default data.
            options._layoutFile = this._getLayout(options);

            // Bind automatically the content into each views, even partials called by the main view. Don't erase native res.locals (bind by the sails middleware) but override/add them.
            res.locals = _.merge(res.locals, {
                action: options.action,
                Controller: this,// Controller class.
                controller: options.controller,// Controller string name.
                currentUser: options.currentUser || req.session.user,
                date: new Date().getTime(),
                layout: options._layout || this._layout,
                theme: options._theme || this._theme,
                flash: req.flash ? req.flash() : {}
            });

            // If the controller called belongs to a sub module.
            if((options.controller.split('/')).length > 1){
                this._renderViewSubModule(req, res, options, view);

            }else{
                try{
                    // The controller is "basic", it doesn't belong to a sub module.
                    if(view === false){
                        return res.view(options);// No view forced, will follow the native way.
                    }else{
                        return res.view(view, options);// The view is forced from the controller and doesn't respect the standard.
                    }
                }catch(e){
                    // Catch correctly any failure, because for instance if the view doesn't exists it would display Converting circular structure to JSON. Not really helpful!
                    // TODO Catch the exception in a better way and maybe do something better.
                    res.render(e);
                }
            }
        }

        /**
         * View renderer adapted to manage to render a view that belongs to a sub module of the application.
         *
         * @param req           Request.
         * @param res           Response.
         * @param options       Specific options to render the view.
         * @param view          View to load. Use the path controller/method by default.
         */
        protected _renderViewSubModule(req, res, options: any = {}, view: any = false): any{
            if(view){
                // Custom path, just add the backoffice folder.
                view = options.controller + '/' + view;
            }else{
                // No path, use the targets to know which view to call.
                view = options.controller + '/' + options.action
            }

            return res.view(view, options);
        }

        /**
         **************************************************************************************************
         **************************************** Private methods *****************************************
         **************************************************************************************************
         */

        /**
         * Clean the name of a method to avoid anything bad.
         *
         * @param method
         * @returns {*}
         * @private
         */
        private _cleanMethodName(method: string): string{
            return _.str.capitalize(method.replace('_', ''));
        }

        /**
         * Should return the layout to use without have to take care of the relative path, it should be managed by the controller.
         *
         * @param options       Specific options to render the view.
         * @returns {string}
         * @private
         */
        private _getLayout(options: any = {}): string{
            return this._layoutRelativePath + (options._layout || this._layout);
        }

        /**
         **************************************************************************************************
         **************************************** Controller basic methods ********************************
         **************************************************************************************************
         */

        /**
         * Displays the global content, displays several resources.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public index(req, res, callback: any, options: any = {}){
            this.__beforeIndex(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Show only one resource. (Focuses on one, not many)
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public show(req, res, callback: any, options: any = {}){
            this.__beforeShow(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Display the content to create a new resource.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public new(req, res, callback: any, options: any = {}){
            this.__beforeNew(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Manage the request to create a new resource.
         * Basically called from a "new" view.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public create(req, res, callback: any, options: any = {}){
            this.__beforeCreate(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Display the content to edit an existing resource.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public edit(req, res, callback: any, options: any = {}){
            this.__beforeEdit(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Manage the request to update an existing resource.
         * Basically called from an "edit" view.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public update(req, res, callback: any, options: any = {}){
            this.__beforeUpdate(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         * Destroy a resource.
         * This method is just to return a 404 error and explain the role.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         */
        public destroy(req, res, callback: any, options: any = {}){
            this.__beforeDestroy(req, res, (req, res, callback, options) => {
                res.notFound();
            }, options)
        }

        /**
         **************************************************************************************************
         **************************************** Magic methods *******************************************
         **************************************************************************************************
         */

        /**
         * Automatically triggered before each called method.
         * Allow to execute some code that will be executed by all methods of all controllers.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeEach(req, res, callback: any, options: any = {}){
            // Default user.
            if(!req.session.user){
                req.session.user = {
                    // Ensure that we always know if the user is logged in or not and what is default access is.
                    connected: false,
                };
            }

            // Add debug information.
            // TODO Use express middleware instead...
            console.log('---' +
                '----------------- start -------------------', 'debug');
            console.log('Url: ' + req.method + ' ' + req.baseUrl + req._parsedUrl.href, 'debug');

            if(!_.isEmpty(req.body)){
                console.log('Parameters: ' + JSON.stringify(req.body), 'debug');
            }

            console.log('Options: ' + CircularJSON.stringify(options), 'debug');
            console.log('Route: ' + req.route.method + ' => ' + req.path + ' (' + req.route.regexp + ')', 'debug');

            if(typeof req.headers.cookie !== "undefined"){
                console.log('Cookies: ' + req.headers.cookie, 'debug');
            }

            if(typeof req.headers['user-agent'] !== "undefined"){
                console.log('User agent: ' + req.headers['user-agent'], 'debug');
            }

            console.log('Session: ' + JSON.stringify(req.session), 'debug');
            console.log('---------------------------------------', 'debug');

            // Once we have done the stuff common to all methods, execute the actual callback.
            callback(req, res, options);
        }

        /**
         * Automatically triggered before all index methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeIndex(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all show methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeShow(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all new methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeNew(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all create methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeCreate(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all edit methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeEdit(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all update methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeUpdate(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }

        /**
         * Automatically triggered before all destroy methods are called.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Function to execute.
         * @param options   Object that contains options.
         * @private
         */
        public __beforeDestroy(req, res, callback: any, options: any = {}){
            this.__beforeEach(req, res, (req, res, options) => {
                callback(req, res, options);
            }, options);
        }
    }
}
