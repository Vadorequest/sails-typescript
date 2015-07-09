///<reference path='./../../../typings/loader.d.ts'/>

import controller = require('./../CoreController');

/**
 * Package that contains all Controllers.
 */
export module Controllers {

    /**
     * This controller is a namespace (NS) controller.
     * It is inherited by all controllers in the same folder. It is possible to set properties that will be applied to all controllers inheriting this NS controller.
     */
    export class Dashboard extends controller.Controllers.Core.Controller {

        /**
         * Layout used by the controller by default.
         */
        protected _layout: string = 'dashboard';

        /**
         * Relative path to a layout from a view.
         */
        protected _layoutRelativePath: string = '../../_layouts/';

        /**
         * Exported methods, accessible from internet.
         */
        protected _exportedMethods: any = [
        ];

        /**
         **************************************************************************************************
         **************************************** Override default methods ********************************
         **************************************************************************************************
         */

        /**
         * Override the super method to bind data by default to avoid to have to do it in every method.
         *
         * @param req       Request.
         * @param res       Response.
         * @param callback  Callback.
         * @param options   Options that contains data used by the parent controller and will be injected in the view.
         */
        protected _handleRequest(req, res, callback, options: any = {}){
            // Do not override the controller to use in the child!
            if(!options.Controller){
                options.Controller = this;// Bind the controller to use in every single request but only if undefined.
            }

            super._handleRequest(req, res, callback, options);
        }

        /**
         * List accesses.
         *
         * @param req       Request.
         * @param res       Response.
         */
        public index(req, res){
            this._handleRequest(req, res, (req, res, options) => {
                options.title = 'Administration';

                this._renderView(req, res, options);
            });
        }

        /**
         **************************************************************************************************
         **************************************** Add custom methods **************************************
         **************************************************************************************************
         */

    }
}
