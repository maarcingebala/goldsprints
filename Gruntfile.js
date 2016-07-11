var _ = require('underscore');
var webpack = require('webpack');
var developWebpackConfig = require('./webpack.config');

module.exports = function (grunt) {
  grunt.initConfig({
    NODE_MODULES_DIR: 'node_modules/',
    STATIC_DIR: 'goldsprint/static/',
    DIST_DIR: '<%= STATIC_DIR %>dist/',
    pkg: grunt.file.readJSON('package.json'),

    browserSync: {
      default: {
        bsFiles: {
          src: [
            '<%= DIST_DIR %>/css/*.css',
            '<%= DIST_DIR %>/js/*.js',
            'goldsprint/**/*.html',
            'templates/**/*.html'
          ]
        },
        options: {
          open: false,
          port: '3004',
          proxy: 'localhost:8000',
          reloadOnRestart: true,
          watchTask: true
        }
      }
    },
    clean: {
      options: {force: true},
      default: '<%= DIST_DIR %>'
    },
    imagemin: {
      default: {
        files: [{
          expand: true,
          cwd: '<%= STATIC_DIR %>',
          src: 'images/*.{png,svg,gif,jpg,ico}',
          dest: '<%= DIST_DIR %>'
        }
        ]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')
        ]
      },
      default: {
        src: [
          '<%= DIST_DIR %>/css/main.css'
        ]
      }
    },
    sass: {
      options: {
        sourceMap: true,
        includePaths: ['<%= NODE_MODULES_DIR %>']
      },
      default: {
        files: {
          '<%= DIST_DIR %>/css/main.css': '<%= STATIC_DIR %>/scss/main.scss'
        }
      }
    },
    watch: {
      options: {
        atBegin: true,
        interrupt: false,
        livereload: true,
        spawn: false
      },
      sass: {
        files: ['<%= STATIC_DIR %>/scss/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      uglify: {
        files: ['<%= STATIC_DIR %>/js/**/*.js', '<%= STATIC_DIR %>/js/**/*.js'],
        tasks: ['webpack:develop']
      }
    },
    webpack: {
      develop: developWebpackConfig
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['clean', 'sass', 'postcss', 'webpack:develop']);
  grunt.registerTask('sync', ['browserSync', 'watch']);
};
