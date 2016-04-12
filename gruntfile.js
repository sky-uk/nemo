module.exports = function (grunt) {

	grunt.initConfig({
		concat: {
			dist: {
				src: [
					'app/src/app.js',
					'app/src/messages/messagesProvider.js',
					'app/src/utilsProvider.js',
					'app/src/**/*Provider.js',
					'app/src/**/*.js'],
				dest: 'dist/nemo.js'
			}
		},
		uglify: {
			build: {
				src: ['dist/nemo.js'],
				dest: 'dist/nemo.min.js'
			}
		},
		express: {
			default_option: {
				options: {
					hostname: '0.0.0.0',
					port: 3333,
                    server: './server.js'
				}
			}
		},
		watch: {
			scripts: {
				files: ['app/**/*.js'],
				tasks: ['build']
			}
		},
        clean: {
            npm: {
                src: ['node_modules']
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express');

	grunt.registerTask('build', ['concat']);
	grunt.registerTask('build-and-min', ['build', 'uglify']);

	grunt.registerTask('dev', ['build', 'express', 'watch']);
};