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
          'src/coffee/*.coffee'
        ],
        tasks: 'coffee notifyOK'
      },
      sass: {
        files: [
          'src/scss/*.scss'
        ],
        tasks: 'sass notifyOK'
      }
    },
    coffee: {
      'js/': 'src/coffee/'
    },
    sass: {
      'css/style.css': 'src/scss/style.scss'
    }
  });

  grunt.loadTasks('src/gruntTasks');
  grunt.registerTask('default', 'coffee sass notifyOK');

};
