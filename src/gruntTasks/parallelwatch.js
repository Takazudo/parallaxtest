/**
 * parallelwatch
 */
module.exports = function(grunt){
  
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  // Nodejs libs.
  var fs = require('fs');
  var path = require('path');

  var mtimes = {};

  grunt.registerTask('parallelwatch', 'test', function() {

    // This task is asynchronous.
    var taskDone = this.async();
    // This task's name + optional args, in string format.
    var nameArgs = this.nameArgs;

    var all = config('parallelwatch');

    Object.keys(all).forEach(function(key){
      var filesProp = ['parallelwatch', key, 'files'];
      var tasksProp = ['parallelwatch', key, 'tasks'];
      runWatch(filesProp, tasksProp);
    });

    log.write('Waiting...');

    function runWatch(filesProp, tasksProp){

      // ========= a little modified original watch start =========
      
      // Get a list of ffles to be watched.
      var getFiles = file.expandFiles.bind(file, config(filesProp));
      // The tasks to be run.
      var tasks = config(tasksProp);
      // An ID by which the setInterval can be canceled.
      var intervalId;
      // Files that are being watched.
      var watchedFiles = {};
      // File changes to be logged.
      var changedFiles = {};

      // Define an alternate fail "warn" behavior.
      grunt.fail.warnAlternate = function() {
        task.clearQueue().run(nameArgs);
      };

      // Cleanup when files have changed. This is debounced to handle situations
      // where editors save multiple files "simultaneously" and should wait until
      // all the files are saved.
      var done = utils._.debounce(function() {
        // Clear the files-added setInterval.
        clearInterval(intervalId);
        // Ok!
        log.ok();
        Object.keys(changedFiles).forEach(function(filepath) {
          // Log which file has changed, and how.
          log.ok('File "' + filepath + '" ' + changedFiles[filepath] + '.');
          // Clear the modified file's cached require data.
          file.clearRequireCache(filepath);
        });
        // Unwatch all watched files.
        Object.keys(watchedFiles).forEach(unWatchFile);
        // Enqueue all specified tasks (if specified)...
        if (tasks) { task.run(tasks); }
        // ...followed by the watch task, so that it loops.
        task.run(nameArgs);
        // Continue task queue.
        taskDone();
      }, 250);

      // Handle file changes.
      function fileChanged(status, filepath) {
        // If file was deleted and then re-added, consider it changed.
        if (changedFiles[filepath] === 'deleted' && status === 'added') {
          status = 'changed';
        }
        // Keep track of changed status for later.
        changedFiles[filepath] = status;
        // Execute debounced done function.
        done();
      }

      // Watch a file.
      function watchFile(filepath) {
        if (!watchedFiles[filepath]) {
          // Watch this file for changes. This probably won't scale to hundreds of
          // files.. but I bet someone will try it!
          watchedFiles[filepath] = fs.watch(filepath, function(event) {
            var mtime;
            // Has the file been deleted?
            var deleted = !path.existsSync(filepath);
            if (deleted) {
              // If file was deleted, stop watching file.
              unWatchFile(filepath);
              // Remove from mtimes.
              delete mtimes[filepath];
            } else {
              // Get last modified time of file.
              mtime = +fs.statSync(filepath).mtime;
              // If same as stored mtime, the file hasn't changed.
              if (mtime === mtimes[filepath]) { return; }
              // Otherwise it has, store mtime for later use.
              mtimes[filepath] = mtime;
            }
            // Call "change" for this file, setting status appropriately (rename ->
            // renamed, change -> changed).
            fileChanged(deleted ? 'deleted' : event + 'd', filepath);
          });
        }
      }

      // Unwatch a file.
      function unWatchFile(filepath) {
        if (watchedFiles[filepath]) {
          // Close watcher.
          watchedFiles[filepath].close();
          // Remove from watched files.
          delete watchedFiles[filepath];
        }
      }

      // Watch all currently existing files for changes.
      getFiles().forEach(watchFile);

      // Watch for files to be added.
      intervalId = setInterval(function() {
        // Files that have been added since last interval execution.
        var added = utils._.difference(getFiles(), Object.keys(watchedFiles));
        added.forEach(function(filepath) {
          // This file has been added.
          fileChanged('added', filepath);
          // Watch this file.
          watchFile(filepath);
        });
      }, 200);

      // ========= a little modified original watch end =========

    } // runWatch

  });

  grunt.registerHelper('parallelwatch', function() {
    return 'parallelwatch!!!';
  });

};
