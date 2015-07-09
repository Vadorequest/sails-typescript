/**
 * Compile TS files to JS.
 *
 * @see https://github.com/TypeStrong/grunt-ts
 */
module.exports = function(grunt) {
    grunt.config.set('ts', {
        server_commonJs: {
            files: [
                {
                    src: [
                        'api/**/*.ts'
                    ],
                    dest: ''// Will generate at the exact same location as the source.
                }
            ],

            options: {
                module: 'commonjs',
                target: 'es5',
                fast: 'watch',
                comments: true,
                sourceMap: false,// Useless on the server side.
                declaration: true,// Always useful to have declarations available.
                noEmitOnError: false,// Force log errors.
                failOnTypeErrors: true,// Force log grunt errors pipeline.
                verbose: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
};
