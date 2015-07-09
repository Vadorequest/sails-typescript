module.exports = function (grunt) {
	grunt.registerTask('default', [
        'compileAssets',
        'linkAssets',
        'ts:server_commonJs',// Compile TS files
        'watch'
    ]);
};
