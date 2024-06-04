
'use strict';

const nodesass = require('node-sass');

module.exports = function (grunt) {
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    grunt.initConfig({
        devDir: '../www-dev',
        distDir: '../www',
        tempDir: '<%= devDir %>/.tmp',

        clean: {
            temp:{
                options: {
                    force: true
                },
                src: ['<%= tempDir %>']
            },
			dist: {
                options: {
                    force: true
                },
                src: ['<%= tempDir %>', '<%= distDir %>']
            }
        },
        copy: {
			dev: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= devDir %>',
					dest: '<%= distDir %>/',
					src: [
                        '**/*.html',
                        '**/*.xml',
                        '**/*.txt',
                        'img/**/*',
                        'fonts/**/*',
                        'data/**/*'
					]
				}]
            },
            temp: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= tempDir %>',
					dest: '<%= distDir %>/',
					src: [
                        'css/**/*.css',
					]
				}]
			},
			toTemp: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= devDir %>',
					dest: '<%= tempDir %>/',
					src: [
                        'js/**/*',
                        'img/**/*',
                        'fonts/**/*',
                        'data/**/*'
					]
				}]
            },
			js: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= devDir %>',
					dest: '<%= tempDir %>/',
					src: [
                        'js/**/*'
					]
				}]
            }
        },

        stringReplacements: [{
            pattern: /<!-- @import (.*?) -->/ig,
            replacement: function (match, p1) {
                var arr = p1.split(' data=');
                var file = arr[0];
                var result = grunt.file.read(grunt.config.get('devDir') + '/' + file);
                var data = arr[1] || "{}";
                data = JSON.parse(data);
                for(var key in data){
                    if(data.hasOwnProperty(key)){
                        var regex = new RegExp("<%= " + key + " %>", "gi");
                        result = result.replace(regex, data[key]);
                    }
                }
                var notDefinedData = new RegExp("<%= (.*?) %>", "gi");
                result = result.replace(notDefinedData, '');
                return result;
            }
        }],
        'string-replace': {
            temp: {
				files: [{
					expand: true,
					cwd: '<%= devDir %>',
					src: ['partials/**/*.html', '*.html'],
					dest: '<%= tempDir %>'
				}],
				options: {
					replacements: '<%= stringReplacements %>'
				}
            },
            temp2: {
				files: [{
					expand: true,
					cwd: '<%= tempDir %>',
					src: ['partials/**/*.html', '*.html'],
					dest: '<%= tempDir %>'
				}],
				options: {
					replacements: '<%= stringReplacements %>'
				}
            },
            dist: {
				files: [{
					expand: true,
					cwd: '<%= distDir %>',
					src: ['partials/**/*.html', '*.html'],
					dest: '<%= distDir %>'
				}],
				options: {
					replacements: '<%= stringReplacements %>'
				}
			}
        },
        sass: {
            options: {
                implementation: nodesass,
                sourceMap: true,
                outputStyle: 'compressed'
            },
            main: {
                files: {
                    '<%= tempDir %>/css/style.css': '<%= devDir %>/scss/style.scss',
                }
            }
        },
        cacheBust: {
            dist: {
                options: {
                    baseDir: '<%= distDir %>/',
                    assets: [
                        'js/{,*/}*.js',
                        'data/{,*/}*.json',
                        'css/{,*/}*.css'
                    ],
                    queryString: true
                },
                src: ['<%= distDir %>/**/*.html']
            }
        },
		usemin: {
            html: '<%= distDir %>/**/*.html'
		},
        useminPrepare: {
			html: '<%= devDir %>/**/*.html',
            options: {
                dest: '<%= distDir %>',
                staging: '<%= tempDir %>'
            }
		},
		browserSync: {
			dev: {
				bsFiles: {
                    src: [
                        '<%= tempDir %>/css/style.css',
                        '<%= tempDir %>/js/**/*',
                        '<%= tempDir %>/data/**/*',
                        '<%= tempDir %>/**/*.html'
                    ]
				},
				options: {
					watchTask: true,
					open: false,
					browser: 'chrome',
					ports: {
						min: 3003,
						max: 3005
					},
					ghostMode: {
						clicks: false,
						scroll: false,
						links: false, // must be false to avoid interfering with angular routing
						forms: false
					},
					server: {
						baseDir: "<%= tempDir %>"
					}
				}
			}
		},
        watch: {
            sass: {
                files: [
                    '<%= devDir %>/scss/**/*'
                ],
                tasks: ['sass:main']
            },
            'string-replace': {
                files: [
                    '<%= devDir %>/**/*.html'
                ],
                tasks: ['string-replace:temp', 'string-replace:temp2']
            },
            js: {
                files: [
                    '<%= devDir %>/js/**/*'
                ],
                tasks: ['copy:js']
            }
        },
    });
    grunt.registerTask('dev', [
        'clean:temp',
        'sass',
        'string-replace:temp',
        'string-replace:temp2',
        'copy:toTemp',
        'browserSync',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean:dist',
        'sass',
        'useminPrepare',
		'concat',
		'uglify',
		'copy:dev',
		'copy:temp',
		// 'rev',
        'string-replace:dist',
        'string-replace:dist',
        'usemin',
        // 'uncss',
        'cacheBust',
	]);


};
