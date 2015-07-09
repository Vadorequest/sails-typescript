/**
 *
 *
 * @module		:: Controller
 * @description	::
 */
var Controller = require('./User').Controllers.User;

/**
 * Bind public controller methods.
 */
module.exports = new Controller().exports();