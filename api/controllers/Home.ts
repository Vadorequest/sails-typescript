///<reference path='./../../typings/loader.d.ts'/>

import controller = require('./CoreController');

/**
 * Package that contains all Controllers.
 */
export module Controllers {

    export class Home extends controller.Controllers.Core.Controller {

        /**
         * Exported methods, accessible from internet.
         */
        protected _exportedMethods: any = [
            'help'
        ];

        /**
         **************************************************************************************************
         **************************************** Override default methods ********************************
         **************************************************************************************************
         */

        /**
         * Index page. Main page.
         * @param req       Request.
         * @param res       Response.
         */
        public index(req, res){
            this._handleRequest(req, res, (req, res, options) => {
                options.title = 'Sails TS demo';
                req.flash('messages', 'You are now on the homepage!');

                this._renderView(req, res, options);
            });
        }

        /**
         **************************************************************************************************
         **************************************** Add custom methods **************************************
         **************************************************************************************************
         */

        /**
         * Help page.
         *
         * @param req
         * @param res
         */
        public help(req, res) {
            this._handleRequest(req, res, (req, res, options) => {
                options.title = "Help center";
                req.flash('messages', 'You are now on the help center!');

                this._renderView(req, res, options);
            });
        }

        /**
         **************************************************************************************************
         **************************************** Override magic methods **********************************
         **************************************************************************************************
         */
    }
}
