/**
 * A module of various browser polyfills
 * @file polyfill.js
 */

/**
 * Promise.prototype.done polyfill
 */
if (!Promise.prototype.done) { Promise.prototype.done = function (cb, eb) { this.then(cb, eb).then(null, function (err) { setTimeout(function () { throw err; }, 0); }); }; }