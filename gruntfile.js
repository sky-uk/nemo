module.exports = function (grunt) {

	grunt.initConfig({
		bower: {
			install: {
				options: {
					targetDir: 'app/lib'
				}
			}
		},
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
		},
		express: {
			default_option: {
				options: {
					bases: './app',
					hostname: 'localhost',
					port: 3333
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
            bower: {
                src: ['bower_components']
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-bower-task');

	grunt.registerTask('build', ['clean:bower', 'bower:install', 'concat']);
	grunt.registerTask('build-and-min', ['build', 'uglify']);

	grunt.registerTask('dev', ['build', 'express', 'watch'])
}