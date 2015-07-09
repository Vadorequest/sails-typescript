/**
 *
 *
 * @module		:: Controller
 * @description	::
 */
var Controller = require('./Dashboard').Controllers.Dashboard;

/**
 * Bind public controller methods.
 */
module.exports = new Controller().exports();