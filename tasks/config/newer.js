/**
 * Allow to filter a set of filepath to only kep those that have been updated since:
 *  - (default) the last time the "newer" task ran.
 *  - a specified folder.
 *
 * @param grunt
 * @see https://github.com/tschaub/grunt-newer
 */
module.exports = function(grunt) {
    grunt.config.set('newer', {
        newer: {
            options: {
                //cache: 'path/to/custom/cache/directory',
                //override: function(detail, include) {
                //    if (detail.task === 'less') {
                //        checkForModifiedImports(detail.path, detail.time, include);
                //    } else {
                //        include(false);
                //    }
                //}
            }
        }
    });

    grunt.loadNpmTasks('grunt-newer');
};
