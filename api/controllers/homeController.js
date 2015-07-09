/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Home page.
 */
var Controller = require('./Home').Controllers.Home;

/**
 * Bind public controller methods.
 */
module.exports = new Controller().exports();
