/**
 * Génération de la documentation typescript.
 *
 * @see http://typedoc.io/guides/installation.html
 */
module.exports = function(grunt) {
    grunt.config.set('typedoc', {
        typedoc: {
            options: {
                module: 'commonjs',
                target: 'es5',
                out: 'documentation/Developper Guide',
                name: 'Ayolan Translatation'
            },
            src: [
                'api/**/*.ts',
                'assets/**/*.ts',
                'shared/**/*.ts'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-typedoc');
};
