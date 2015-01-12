module.exports = function (grunt) {

	grunt.initConfig({
		concat: {
			dist: {
				src: ['app/**/*.js', '!app/lib/angular/**/*.js'],
				dest: 'dist/build.js'
			}
		},
		uglify: {
			build: {
				src: ['dist/build.js'],
				dest: 'dist/build.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['concat'])
	grunt.registerTask('build-and-min', ['concat', 'uglify'])
}