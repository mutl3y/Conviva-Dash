//noinspection JSHint
/**
 * @module adminApp
 * @author Created by MHeynes on 04/09/2014.
 */

//noinspection JSHint
var app;

//noinspection JSHint
/**
 *
 * @class angular_module
 * @param name {String} Name of Angular application
 * @param dependancies {module} inject ngResource and UI-bootstrap}
 * @extends API
 * Main Admin App - BOOTSTRAP
 * @description         Bootstraps Application <br><br>
 * Injects ngResource and ui-bootstrap as dependencies of adminApp
 *
 * Root of admin app
 */
app = angular.module('mongoDash', ['ngResource', 'ui.bootstrap', 'ngAnimate']);

