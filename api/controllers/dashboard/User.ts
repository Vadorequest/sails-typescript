///<reference path='./../../../typings/loader.d.ts'/>

import controller = require('./Dashboard');

/**
 * Package that contains all Controllers.
 */
export module Controllers {

    export class User extends controller.Controllers.Dashboard {

        /**
         * Exported methods, applicationible from internet.
         */
        protected _exportedMethods: any = [
        ];

        /**
         **************************************************************************************************
         **************************************** Override default methods ********************************
         **************************************************************************************************
         */

        /**
         * List applicationes.
         *
         * @param req       Request.
         * @param res       Response.
         */
        public index(req, res){
            this._handleRequest(req, res, (req, res, options) => {
                options.title = 'Index';

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
