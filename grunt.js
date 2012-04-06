/**
 * grunt
 * This compiles coffee to js
 *
 * grunt: https://github.com/cowboy/grunt
 */
module.exports = function(grunt){

  grunt.initConfig({
    parallelwatch: {
      coffee: {
        files: [
          '_src/coffee/*.coffee'
        ],
        tasks: 'coffee notifyOK'
      },
      sass: {
        files: [
          '_src/scss/*.scss'
        ],
        tasks: 'sass notifyOK'
      }
    },
    coffee: {
      'js/': '_src/coffee/'
    },
    sass: {
      'css/style.css': '_src/scss/style.scss'
    }
  });

  grunt.loadTasks('_grunt/tasks');
  grunt.registerTask('default', 'coffee sass notifyOK');

};
